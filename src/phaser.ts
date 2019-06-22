import Phaser from 'phaser';

import groundImagePath from '../public/assets/ground.png';
import blockImagePath from '../public/assets/block.png';
import sceneSpritesImagePath from '../public/assets/scene.png';
// @ts-ignore
import sceneShapesJsonPath from '../public/assets/scene.shapes';
// @ts-ignore
import sceneSpritesJsonPath from '../public/assets/scene.sprites';

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
    backgroundColor: '#1b1464',
    parent: element,
    physics: {
      default: 'matter',
      matter: {},
    },
    scene: {
      preload: function preload(this: Phaser.Scene) {
        this.load.image('block', blockImagePath);
        this.load.image('ground', groundImagePath);
        this.load.atlas(
          'scene-sprites',
          sceneSpritesImagePath,
          sceneSpritesJsonPath,
        );
        this.load.json('scene-shapes', sceneShapesJsonPath);
      },
      create: function create(this: Phaser.Scene) {
        // set the world bounds, restrict the area to the screen – no scrolling
        this.matter.world.setBounds(0, 0, windowSize.width, windowSize.height);

        // add ground
        const sceneSprites = this.cache.json.get('scene-sprites');
        const sceneShapes = this.cache.json.get('scene-shapes');
        const groundSize: {
          w: number;
          h: number;
        } = sceneSprites.textures[0].frames.find(
          (frame: any) => frame.filename === 'ground.png',
        ).sourceSize;
        const groundScale = windowSize.height / 2 / groundSize.h;
        const ground = this.matter.add.sprite(
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
