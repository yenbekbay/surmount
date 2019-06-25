import {ThemeProvider as FannypackThemeProvider} from 'fannypack';
import React, {useState} from 'react';
import {Routes} from './Routes';
import {Scene} from './Scene';
import {theme} from './theme';
import {AppLoading} from './AppLoading';

interface AppProps {}

export const App: React.FC<AppProps> = _props => {
  const [loading, setLoading] = useState(true);

  return (
    <FannypackThemeProvider theme={theme}>
      <>
        <Scene onLoadComplete={() => setLoading(false)} />
        <Routes />
        {loading && <AppLoading />}
      </>
    </FannypackThemeProvider>
  );
};
