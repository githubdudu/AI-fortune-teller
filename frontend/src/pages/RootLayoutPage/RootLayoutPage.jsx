import { Outlet, useLocation } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { Box, Flex } from 'gestalt';

import ArcanaVerseLogo from './components/ArcanaVerseLogo';
import UserAvatarButton from './components/UserAvatarButton';
import SoundToggle from './components/SoundToggle';
import RouteErrorFallback from './components/RouteErrorFallback';
import { useAudioBootstrap } from '$/hooks/useAudio';

function RootLayoutPage() {
  // Arms the audio engine on the first gesture anywhere in the app
  useAudioBootstrap();
  const location = useLocation();

  return (
    <Flex
      justifyContent="start"
      direction="column"
      height="100svh"
      width="100%"
      gap={{ row: 0, column: 0 }}
    >
      <Flex.Item flex="none">
        <div className="flex justify-between pt-4 px-3">
          <SoundToggle />
          <UserAvatarButton />
        </div>
        <ArcanaVerseLogo />
      </Flex.Item>
      <Flex.Item flex="grow">
        <ErrorBoundary
          FallbackComponent={RouteErrorFallback}
          resetKeys={[location.pathname]}
        >
          <Outlet />
        </ErrorBoundary>
      </Flex.Item>
    </Flex>
  );
}

export default RootLayoutPage;
