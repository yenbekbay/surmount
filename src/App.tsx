import React, {useCallback} from 'react';

import {initMatter} from './matter';

interface AppProps {}

export const App: React.FC<AppProps> = _props => {
  const matterRef = useCallback((element: HTMLDivElement | null) => {
    if (element) {
      initMatter(element);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div ref={matterRef} id="matter" />
    </div>
  );
};
