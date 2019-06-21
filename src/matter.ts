import Matter from 'matter-js';

import terrainSvg from './terrain.svg';

// @ts-ignore: no typings
import decomp from 'poly-decomp';
(window as any).decomp = decomp;

export const initMatter = (element: HTMLDivElement) => {
  // create engine
  const engine = Matter.Engine.create();

  // create renderer
  const render = Matter.Render.create({
    element,
    engine,
    options: {
      width: 524,
      height: 385,
    },
  });
  Matter.Render.run(render);

  // create runner
  const runner = Matter.Runner.create({});
  Matter.Runner.run(runner, engine);

  // add terrain
  const terrainSvgDoc = Object.assign(document.createElement('svg'), {
    innerHTML: terrainSvg,
  });
  const terrainSvgPaths = terrainSvgDoc.getElementsByTagName('path');
  const vertexSets = Array.from(terrainSvgPaths).map(path =>
    Matter.Svg.pathToVertices(path, 30),
  );
  const terrain = Matter.Bodies.fromVertices(
    524,
    470,
    vertexSets,
    {
      isStatic: true,
      render: {
        fillStyle: '#2e2b44',
        strokeStyle: '#2e2b44',
        lineWidth: 1,
      },
    },
    true,
  );
  Matter.World.add(engine.world, terrain);

  // add composites
  const bodyOptions = {
    frictionAir: 0,
    friction: 0.0001,
    restitution: 0.6,
  };
  const composites = Matter.Composites.stack(
    524,
    0,
    5,
    5,
    10,
    10,
    (x: number, y: number) => {
      if (Matter.Query.point([terrain], {x, y}).length === 0) {
        return Matter.Bodies.polygon(x, y, 5, 12, bodyOptions);
      }

      return undefined;
    },
  );
  Matter.World.add(engine.world, composites);

  // add mouse control
  const mouse = Matter.Mouse.create(render.canvas);
  const mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false,
      },
    } as any,
  });
  Matter.World.add(engine.world, mouseConstraint);

  // keep the mouse in sync with rendering
  render.mouse = mouse;

  // fit the render viewport to the scene
  Matter.Render.lookAt(render, {
    min: {x: 0, y: 0},
    max: {x: 800, y: 600},
  });

  return () => {
    Matter.Render.stop(render);
    Matter.Runner.stop(runner);
  };
};
