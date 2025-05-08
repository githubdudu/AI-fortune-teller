import { Outlet } from 'react-router-dom';
import { Box, Flex } from 'gestalt';

import ArcanaVerseLogo from '../../components/ArcanaVerseLogo';
import NavBar from './NavBar';

function RootLayoutPage() {
  return (
    <Flex
      alignItems="center"
      justifyContent="start"
      direction="column"
      height="100vh"
    >
      <NavBar />
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
