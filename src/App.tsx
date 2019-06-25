import {ThemeProvider as FannypackThemeProvider} from 'fannypack';
import React from 'react';
import {Routes} from './Routes';
import {Scene} from './Scene';

interface AppProps {}

export const App: React.FC<AppProps> = _props => {
  return (
    <FannypackThemeProvider
      theme={{palette: {text: '#41536C', primary: '#41536C'}}}
    >
      <>
        <Scene />
        <Routes />
      </>
    </FannypackThemeProvider>
  );
};
