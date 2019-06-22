import {useWindowSize} from 'react-use';
import React, {useCallback} from 'react';

import {initPhaser} from './phaser';

interface AppProps {}

export const App: React.FC<AppProps> = _props => {
  const windowSize = useWindowSize();

  const phaserRef = useCallback((element: HTMLDivElement | null) => {
    if (element) {
      initPhaser({element, windowSize});
    }
  }, []);

  return <div ref={phaserRef} id="phaser" />;
};
