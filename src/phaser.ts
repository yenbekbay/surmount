import Phaser from 'phaser';

export const initPhaser = ({
  element,
  windowSize,
}: {
  element: HTMLDivElement;
  windowSize: {width: number; height: number};
}) => {
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    width: windowSize.width,
    height: windowSize.height,
    backgroundColor: '#fff',
    parent: element,
    physics: {
      default: 'matter',
      matter: {},
    },
    scene: {
      preload: function preload(this: Phaser.Scene) {
        this.load.image('block', './block.png');
        this.load.multiatlas('scene-sprites', './scene-sprites.json');
        this.load.json('scene-shapes', './scene-shapes.json');
      },
      create: function create(this: Phaser.Scene) {
        const sceneSprites = this.cache.json.get('scene-sprites');
        const sceneShapes = this.cache.json.get('scene-shapes');
        const sceneFrames = (sceneSprites as {
          textures: {
            frames: {filename: string; sourceSize: {w: number; h: number}}[];
          }[];
        }).textures.reduce<
          {filename: string; sourceSize: {w: number; h: number}}[]
        >((acc, texture) => [...acc, ...texture.frames], []);

        // set the world bounds, restrict the area to the screen – no scrolling
        this.matter.world.setBounds(0, 0, windowSize.width, windowSize.height);

        // add background
        [
          'background_6_sky.png',
          'background_5_clouds.png',
          'background_4_mountain.png',
          'background_3_trees.png',
          'background_2_trees.png',
          'background_1_trees.png',
        ].forEach(filename => {
          const spriteFrame = sceneFrames.find(
            frame => frame.filename === filename,
          );
          const spriteSize = spriteFrame
            ? {
                width: spriteFrame.sourceSize.w,
                height: spriteFrame.sourceSize.h,
              }
            : windowSize;
          const spriteScale = windowSize.height / spriteSize.height;
          const sprite = this.add.image(0, 0, 'scene-sprites', filename);
          sprite.setScale(spriteScale).setOrigin(0, 0);
        });

        // add ground
        const groundFrame = sceneFrames.find(
          frame => frame.filename === 'ground.png',
        );
        const groundSize = groundFrame
          ? {
              width: groundFrame.sourceSize.w,
              height: groundFrame.sourceSize.h,
            }
          : windowSize;
        const groundScale = windowSize.height / 2 / groundSize.height;
        const ground = this.matter.add.image(
          0,
          0,
          'scene-sprites',
          'ground.png',
          {
            shape: sceneShapes.ground,
          },
        );
        ground
          .setScale(groundScale)
          .setPosition(
            ground.centerOfMass.x * groundScale,
            windowSize.height / 2 + ground.centerOfMass.y * groundScale,
          );

        // add blocks
        this.matter.add.image(325, -100, 'block');
        this.matter.add.image(400, 300, 'block');
        this.matter.add.image(450, 50, 'block');
      },
    },
  });

  return () => {
    game.destroy(true);
  };
};
