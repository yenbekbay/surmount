import {RouteComponentProps} from '@reach/router';
import {Overlay, Heading, Flex} from 'fannypack';
import React, {useMemo} from 'react';
import {useUserSettings} from '../storage';
import {differenceInCalendarDays, parse} from 'date-fns';
import {useWindowSize} from 'react-use';

interface DashboardProps extends RouteComponentProps {}

export const Dashboard: React.FC<DashboardProps> = _props => {
  const [userSettings] = useUserSettings();
  const windowSize = useWindowSize();
  const today = useMemo(() => new Date(), []);

  if (!userSettings) return null;

  return (
    <Overlay
      fade
      slide
      visible
      placement="top"
      top={windowSize.height / 2 - 100}
    >
      <Flex textAlign="center" flexDirection="column">
        <Heading use="h5" color="text" marginBottom={0}>
          Smoke free
        </Heading>
        <Heading use="h1" color="text">
          {differenceInCalendarDays(today, parse(userSettings.lastSmokedAt))}{' '}
          days
        </Heading>
      </Flex>
    </Overlay>
  );
};
