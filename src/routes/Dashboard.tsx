import {differenceInCalendarDays, parse} from 'date-fns';
import {Card, Flex, Heading, Text} from 'fannypack';
import React, {useEffect, useMemo} from 'react';
import {calculateMoneySaved, SMOKE_FREE_PROGRAM_DAYS} from '../logic';
import {useUserSettings} from '../storage';
import {route} from './_route';

export const Dashboard = route(({navigate}) => {
  const [userSettings] = useUserSettings();
  const today = useMemo(() => new Date(), []);

  useEffect(() => {
    if (!userSettings) {
      if (navigate) navigate('/onboarding');
    }
  }, [userSettings]);

  if (!userSettings) return null;

  const smokeFreeDays = differenceInCalendarDays(
    today,
    parse(userSettings.lastSmokedAt),
  );

  return (
    <Flex
      textAlign="center"
      alignItems="center"
      flexDirection="column"
      marginTop="4rem"
      marginLeft="2rem"
      marginRight="2rem"
    >
      <Heading use="h5" marginBottom={0}>
        Smoke free
      </Heading>
      <Heading use="h1">{smokeFreeDays} days</Heading>
      <Text>
        ({Math.max(0, SMOKE_FREE_PROGRAM_DAYS - smokeFreeDays)} days left)
      </Text>
      <Card padding="0.5rem 1rem" marginTop="1rem">
        Money saved:{' '}
        <Heading use="h5">
          {calculateMoneySaved({smokeFreeDays, userSettings}).toLocaleString(
            'en-NL',
            {style: 'currency', currency: 'EUR'},
          )}
        </Heading>
      </Card>
    </Flex>
  );
});
