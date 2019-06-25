import {Router, navigate} from '@reach/router';
import {Box} from 'fannypack';
import React, {useEffect} from 'react';
import {Dashboard} from './routes/Dashboard';
import {Onboarding} from './routes/Onboarding';
import {useUserSettings} from './storage';

interface RoutesProps {}

export const Routes: React.FC<RoutesProps> = _props => {
  const [userSettings] = useUserSettings();

  useEffect(() => {
    if (!userSettings) {
      navigate('onboarding');
    }
  }, [userSettings]);

  return (
    <Box style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0}}>
      <Router>
        <Onboarding path="onboarding" />
        <Dashboard path="dashboard" />
      </Router>
    </Box>
  );
};
