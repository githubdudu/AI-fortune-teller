import { Outlet } from 'react-router-dom';
import { Box, Flex } from 'gestalt';

import ArcanaVerseLogo from '../../components/ArcanaVerseLogo';
import UserAvatarButton from './UserAvatarButton';

function RootLayoutPage() {
  return (
    <Flex
      alignItems="center"
      justifyContent="start"
      direction="column"
      height="100vh"
    >
      <UserAvatarButton />
      <Box marginBottom={10}>
        <ArcanaVerseLogo />
      </Box>
      <Flex alignItems="center" justifyContent="start" direction="column">
        <Outlet />
      </Flex>
    </Flex>
  );
}

export default RootLayoutPage;
