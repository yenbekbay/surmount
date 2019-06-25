import Phaser from 'phaser';
import React, {useCallback} from 'react';
import {useWindowSize} from 'react-use';

const verticesForShape = (
  shape: {
    fixtures: {
      vertices: {x: number; y: number}[][];
    }[];
  },
  {
    scale,
    constant,
  }: {
    scale: number;
    constant: {x: number; y: number};
  },
) =>
  shape.fixtures[0].vertices
    .reduce((a, b) => [...a, ...b])
    .sort((a, b) => a.x - b.x)
    .map(vertex => ({
      x: vertex.x * scale + constant.x,
      y: vertex.y * scale + constant.y,
    }));

const vertexAtPoint = (x: number, vertices: {x: number; y: number}[]) =>
  [...vertices].sort((a, b) => Math.abs(x - a.x) - Math.abs(x - b.x))[0];

const BACKGROUND_SKY_COLOR = '#edf1f4';
const BACKGROUND_FILENAMES = [
  'background_6_sky.png',
  'background_5_clouds.png',
  'background_4_mountain.png',
  'background_3_trees.png',
  'background_2_trees.png',
  'background_1_trees.png',
] as const;
const GROUND_FILENAMES = Array.from(
  {length: 8},
  (_, idx) => `ground_${idx + 1}.png`,
);

export const initPhaser = ({
  element,
  windowSize,
  onLoadComplete,
}: {
  element: HTMLDivElement;
  windowSize: {width: number; height: number};
  onLoadComplete: () => void;
}) => {
  let background: Phaser.GameObjects.Image[] | null = null;
  let smog: Phaser.GameObjects.Image | null = null;
  let ground: Phaser.Physics.Matter.Image[] | null = null;
  let girl: Phaser.Physics.Matter.Sprite | null = null;
  let cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;

  const game = new Phaser.Game({
    type: Phaser.AUTO,
    width: windowSize.width,
    height: windowSize.height,
    backgroundColor: BACKGROUND_SKY_COLOR,
    parent: element,
    render: {
      // pixelArt: true,
    },
    physics: {
      default: 'matter',
      matter: {
        gravity: {y: 1},
      },
    },
    scene: {
      preload(this: Phaser.Scene) {
        this.load.image('block', './block.png');
        this.load.multiatlas('scene-sprites', './scene-sprites.json');
        this.load.json('scene-shapes', './scene-shapes.json');
        this.load.on('complete', onLoadComplete);
      },
      create(this: Phaser.Scene) {
        const sceneShapes = this.cache.json.get('scene-shapes');

        // add background
        background = BACKGROUND_FILENAMES.map(filename => {
          const sprite = this.add
            .image(0, 0, 'scene-sprites', filename)
            .setOrigin(0, 0)
            .setScrollFactor(0);

          const spriteScale = windowSize.height / sprite.height;
          sprite.setScale(spriteScale);

          return sprite;
        });

        // add smog
        smog = this.add
          .image(0, 0, 'scene-sprites', 'smog.png')
          .setOrigin(0, 0)
          .setScrollFactor(0);
        const smogScale = windowSize.height / smog.height;
        smog.setScale(smogScale);

        // add ground
        ground = GROUND_FILENAMES.reduce<Phaser.Physics.Matter.Image[]>(
          (acc, filename, idx) => {
            const prevSprite = acc[idx - 1];

            const sprite = this.matter.add.image(
              0,
              0,
              'scene-sprites',
              filename,
              {shape: sceneShapes[filename]},
            );

            const spriteScale = prevSprite
              ? prevSprite.scale
              : windowSize.height / 2 / sprite.height;
            sprite.setScale(spriteScale);

            sprite.setPosition(
              (prevSprite
                ? prevSprite.x -
                  prevSprite.centerOfMass.x * spriteScale +
                  prevSprite.width * spriteScale
                : 0) +
                sprite.centerOfMass.x * spriteScale,
              windowSize.height / 2 + sprite.centerOfMass.y * spriteScale,
            );

            return [...acc, sprite];
          },
          [],
        );

        // add girl
        this.anims.create({
          key: 'girl_idle',
          frames: this.anims.generateFrameNames('scene-sprites', {
            prefix: 'girl_idle_',
            suffix: '.png',
            start: 1,
            end: 3,
          }),
          repeat: -1,
          frameRate: 3,
        });
        this.anims.create({
          key: 'girl_walk',
          frames: this.anims.generateFrameNames('scene-sprites', {
            prefix: 'girl_walk_',
            suffix: '.png',
            start: 1,
            end: 6,
          }),
          repeat: -1,
          frameRate: 10,
        });
        girl = this.matter.add.sprite(
          0,
          0,
          'scene-sprites',
          'girl_idle_1.png',
          {
            frictionAir: 0.1,
          },
        );
        const girlScale = windowSize.height / 4 / girl.height;
        girl.setScale(girlScale);
        const girlOnGroundPosition = vertexAtPoint(
          0 + girl.width * girlScale,
          verticesForShape(sceneShapes[GROUND_FILENAMES[0]], {
            scale: ground[0].scale,
            constant: {x: 0, y: windowSize.height / 2},
          }),
        );
        girl.setPosition(
          girlOnGroundPosition.x - girl.centerOfMass.x * girlScale,
          girlOnGroundPosition.y - girl.centerOfMass.y * girlScale,
        );
        girl.play('girl_idle');

        // create cursor keys
        cursors = this.input.keyboard.createCursorKeys();

        // set bounds so the camera won't go outside the world
        const groundSize = {
          width: ground.reduce(
            (acc, sprite) => acc + sprite.width * sprite.scale,
            0,
          ),
          height: ground.reduce(
            (acc, sprite) => Math.max(acc, sprite.height * sprite.scale),
            0,
          ),
        };
        this.matter.world.setBounds(0, 0, groundSize.width, windowSize.height);
        this.cameras.main.setBounds(0, 0, groundSize.width, windowSize.height);
        // make the camera follow the girl
        this.cameras.main.startFollow(girl);

        // set background color, so the sky is not black
        this.cameras.main.setBackgroundColor(BACKGROUND_SKY_COLOR);
      },
      update(this: Phaser.Scene, _time, _delta) {
        if (!background || !smog || !ground || !girl || !cursors) return;

        if (cursors.left && cursors.left.isDown) {
          girl.setVelocityX(-10); // move left
          girl.setAngle(0); // reset angle to prevent tipping over
          girl.anims.play('girl_walk', true); // play walk animation
          girl.flipX = true; // flip the sprite to the left
        } else if (cursors.right && cursors.right.isDown) {
          girl.setVelocityX(10); // move right
          girl.setAngle(0); // reset angle to prevent tipping over
          girl.anims.play('girl_walk', true); // play walk animation
          girl.flipX = false; // use the original sprite looking to the right
        } else {
          girl.setVelocityX(0);
          girl.anims.play('girl_idle', true);
        }

        // adjust background positions for parallax effect
        const groundSize = {
          width: ground.reduce(
            (acc, sprite) => acc + sprite.width * sprite.scale,
            0,
          ),
          height: ground.reduce(
            (acc, sprite) => Math.max(acc, sprite.height * sprite.scale),
            0,
          ),
        };
        background.forEach((sprite, idx) => {
          const parallaxFactor =
            0.05 * Math.pow(0.3, BACKGROUND_FILENAMES.length - idx);

          sprite.x =
            -(groundSize.width - windowSize.width) * parallaxFactor -
            this.cameras.main.scrollX * parallaxFactor;
        });

        // adjust opacity for smog
        smog.alpha =
          1 - this.cameras.main.scrollX / (groundSize.width - windowSize.width);
      },
    },
  });

  return () => {
    game.destroy(true);
  };
};

interface SceneProps {
  onLoadComplete: () => void;
}

export const Scene: React.FC<SceneProps> = ({onLoadComplete}) => {
  const windowSize = useWindowSize();

  const phaserRef = useCallback((element: HTMLDivElement | null) => {
    if (element) {
      initPhaser({element, windowSize, onLoadComplete});
    }
  }, []);

  return <div ref={phaserRef} id="phaser" />;
};
