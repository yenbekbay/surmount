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

export const initPhaser = ({
  element,
  windowSize,
}: {
  element: HTMLDivElement;
  windowSize: {width: number; height: number};
}) => {
  let girl: Phaser.Physics.Matter.Sprite | null = null;
  let cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;

  const game = new Phaser.Game({
    type: Phaser.AUTO,
    width: windowSize.width,
    height: windowSize.height,
    backgroundColor: '#fff',
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
        [
          'background_6_sky.png',
          'background_5_clouds.png',
          'background_4_mountain.png',
          'background_3_trees.png',
          'background_2_trees.png',
          'background_1_trees.png',
        ].forEach(filename => {
          const sprite = this.add
            .image(0, 0, 'scene-sprites', filename)
            .setOrigin(0, 0)
            .setScrollFactor(0);
          const spriteScale = windowSize.height / sprite.height;
          sprite.setScale(spriteScale);
        });

        // add ground
        const ground = this.matter.add.image(
          0,
          0,
          'scene-sprites',
          'ground.png',
          {
            shape: sceneShapes.ground,
          },
        );
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
        this.cameras.main.setBackgroundColor('#ccccff');
      },
      update(_time, _delta) {
        if (!girl || !cursors) return;

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
      },
    },
  });

  return () => {
    game.destroy(true);
  };
};
