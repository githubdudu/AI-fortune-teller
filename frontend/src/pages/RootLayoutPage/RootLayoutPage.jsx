import { Outlet } from 'react-router-dom';
import { Box, Flex } from 'gestalt';

import ArcanaVerseLogo from './components/ArcanaVerseLogo';
import UserAvatarButton from './components/UserAvatarButton';

function RootLayoutPage() {
  return (
    <Flex
      alignItems="center"
      justifyContent="start"
      direction="column"
      height="100vh"
      width="100%"
      gap={{ row: 0, column: 5 }}
    >
      <Flex.Item flex="none" alignSelf="stretch">
        <UserAvatarButton />
        <ArcanaVerseLogo />
      </Flex.Item>
      <Flex.Item flex="grow">
        <Outlet />
      </Flex.Item>
    </Flex>
  );
}

export default RootLayoutPage;
