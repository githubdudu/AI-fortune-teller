import { Outlet } from 'react-router-dom';
import { Box, Flex } from 'gestalt';

import ArcanaVerseLogo from '../../components/ArcanaVerseLogo';

function RootLayoutPage() {
  return (
    <Flex
      alignItems="center"
      justifyContent="start"
      direction="column"
      height="100vh"
      width={1920}
    >
      <Box marginBottom={10}>
        <ArcanaVerseLogo />
      </Box>
      <Flex
        alignItems="center"
        justifyContent="start"
        direction="column"
        width={1920}
      >
        <Outlet />
      </Flex>
    </Flex>
  );
}

export default RootLayoutPage;
