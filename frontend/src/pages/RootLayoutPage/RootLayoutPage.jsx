import { Outlet } from 'react-router-dom';
import { Box, Flex, Sticky, Tabs } from 'gestalt';

import ArcanaVerseLogo from '../../components/ArcanaVerseLogo';

function RootLayoutPage() {
  return (
    <Flex
      alignItems="center"
      justifyContent="start"
      direction="column"
      height="100vh"
    >
      <Sticky top={0}>
        <div className="bg-white w-screen flex justify-between px-4 shadow-md">
          <Tabs
            tabs={[{ text: 'Home', href: '/' }]}
            onChange={() => {}}
            selectedTabIndex={0}
            size="md"
            accessibilityLabel="Main navigation"
          />
          <Tabs
            tabs={[
              { text: 'About', href: '/about' },
              { text: 'Login', href: '/login' },
            ]}
            onChange={() => {}}
            selectedTabIndex={1}
            size="md"
            accessibilityLabel="Main navigation"
          />
        </div>
      </Sticky>

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
