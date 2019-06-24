import Phaser from 'phaser';

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

export const initPhaser = ({
  element,
  windowSize,
}: {
  element: HTMLDivElement;
  windowSize: {width: number; height: number};
}) => {
  let background: {
    [filename in (typeof BACKGROUND_FILENAMES)[number]]?: Phaser.GameObjects.Image;
  } = {};
  let ground: Phaser.Physics.Matter.Image | null = null;
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
        // debug: true,
      },
    },
    scene: {
      preload(this: Phaser.Scene) {
        this.load.image('block', './block.png');
        this.load.multiatlas('scene-sprites', './scene-sprites.json');
        this.load.json('scene-shapes', './scene-shapes.json');
      },
      create(this: Phaser.Scene) {
        const sceneShapes = this.cache.json.get('scene-shapes');

        // add background
        BACKGROUND_FILENAMES.forEach(filename => {
          const sprite = this.add
            .image(0, 0, 'scene-sprites', filename)
            .setOrigin(0, 0)
            .setScrollFactor(0);
          const spriteScale = windowSize.height / sprite.height;
          sprite.setScale(spriteScale);
          background[filename] = sprite;
        });

        // add ground
        ground = this.matter.add.image(0, 0, 'scene-sprites', 'ground.png', {
          shape: sceneShapes.ground,
        });
        const groundScale = windowSize.height / 2 / ground.height;
        const groundVertices = verticesForShape(sceneShapes.ground, {
          scale: groundScale,
          constant: {x: 0, y: windowSize.height / 2},
        });
        ground.setScale(groundScale);
        ground.setPosition(
          ground.centerOfMass.x * groundScale,
          windowSize.height / 2 + ground.centerOfMass.y * groundScale,
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
          0 + girl.width,
          groundVertices,
        );
        girl.setPosition(
          girlOnGroundPosition.x - girl.centerOfMass.x,
          girlOnGroundPosition.y - girl.centerOfMass.y,
        );
        girl.play('girl_idle');

        // create cursor keys
        cursors = this.input.keyboard.createCursorKeys();

        // set bounds so the camera won't go outside the world
        this.matter.world.setBounds(0, 0, ground.width, windowSize.height);
        this.cameras.main.setBounds(0, 0, ground.width, windowSize.height);
        // make the camera follow the girl
        this.cameras.main.startFollow(girl);

        // set background color, so the sky is not black
        this.cameras.main.setBackgroundColor(BACKGROUND_SKY_COLOR);
      },
      update(this: Phaser.Scene, _time, _delta) {
        if (!ground || !girl || !cursors) return;

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
        BACKGROUND_FILENAMES.forEach((filename, idx) => {
          const sprite = background[filename];
          if (sprite && ground) {
            const parallaxFactor =
              0.1 * Math.pow(0.3, BACKGROUND_FILENAMES.length - idx);

            sprite.x =
              -(ground.width - windowSize.width) * parallaxFactor +
              this.cameras.main.scrollX * parallaxFactor;
          }
        });
      },
    },
  });

  return () => {
    game.destroy(true);
  };
};
