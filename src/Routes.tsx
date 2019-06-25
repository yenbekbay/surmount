import {navigate, Router} from '@reach/router';
import {Box} from 'fannypack';
import React, {useEffect} from 'react';
import {Dashboard} from './routes/Dashboard';
import {Onboarding} from './routes/Onboarding';
import {Settings} from './routes/Settings';
import {useUserSettings} from './storage';
import {useLocation} from 'react-use';

interface RoutesProps {}

/**
 * Main navigation of the app. This is where all routing logic happens.
 */
export const Routes: React.FC<RoutesProps> = _props => {
  const [userSettings] = useUserSettings();
  const location = useLocation();

  useEffect(() => {
    if (!userSettings) {
      navigate('onboarding');
    } else if (location.pathname === '/') {
      navigate('dashboard');
    }
  }, [userSettings]);

  return (
    <Box position="absolute" top={0} left={0} bottom={0} right={0}>
      <Router>
        <Onboarding path="onboarding" />
        <Dashboard path="dashboard" />
        <Settings path="settings" />
      </Router>
    </Box>
  );
};
