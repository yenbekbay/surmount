import {ThemeProvider as FannypackThemeProvider, Box} from 'fannypack';
import React from 'react';
import {Scene} from './components/Scene';
import {Onboarding} from './components/Onboarding';

interface AppProps {}

export const App: React.FC<AppProps> = _props => {
  return (
    <FannypackThemeProvider
      theme={{palette: {text: '#41536C', primary: '#41536C'}}}
    >
      <>
        <Scene />
        <Box
          style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0}}
        >
          <Onboarding />
        </Box>
      </>
    </FannypackThemeProvider>
  );
};
