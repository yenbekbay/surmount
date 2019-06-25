import {Flex, Portal, Spinner} from 'fannypack';
import React from 'react';

interface AppLoadingProps {}

export const AppLoading: React.FC<AppLoadingProps> = _props => (
  <Portal>
    <Flex
      position="absolute"
      top={0}
      left={0}
      bottom={0}
      right={0}
      alignItems="center"
      justifyContent="center"
      backgroundColor="white"
      zIndex={Number.MAX_SAFE_INTEGER}
    >
      <Spinner size="large" />
    </Flex>
  </Portal>
);
