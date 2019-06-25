import {RouteComponentProps, Router, Link} from '@reach/router';
import {Box, Menu, ThemeProvider as FannypackThemeProvider} from 'fannypack';
import React, {useState} from 'react';
import {AppLoading} from './AppLoading';
import {Dashboard} from './routes/Dashboard';
import {Onboarding} from './routes/Onboarding';
import {Settings} from './routes/Settings';
import {Scene} from './Scene';
import {theme} from './theme';

interface AppProps {}

export const App: React.FC<AppProps> = _props => {
  const [loading, setLoading] = useState(true);

  return (
    <FannypackThemeProvider theme={theme}>
      <>
        <Scene onLoadComplete={() => setLoading(false)} />
        <Router>
          <Main path="/">
            <Onboarding path="onboarding" />
            <Dashboard path="dashboard" default />
            <Settings path="settings" />
          </Main>
        </Router>
        {loading && <AppLoading />}
      </>
    </FannypackThemeProvider>
  );
};

interface MainProps extends RouteComponentProps {}

const Main: React.FC<MainProps> = ({children}) => {
  return (
    <Box position="absolute" top={0} left={0} bottom={0} right={0}>
      <Menu.Popover
        content={
          <Menu a11yTitle="Main menu">
            <Menu.Group>
              <Menu.Item>
                <Link to="/dashboard">Dashboard</Link>
              </Menu.Item>
              <Menu.Item>
                <Link to="/settings">Settings</Link>
              </Menu.Item>
              <Menu.Item>
                <Link to="/contact">Contact us</Link>
              </Menu.Item>
            </Menu.Group>
          </Menu>
        }
      >
        <Menu.Button margin="0.5rem 0 0 0.5rem">Menu</Menu.Button>
      </Menu.Popover>
      {children}
    </Box>
  );
};
