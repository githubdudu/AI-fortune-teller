import { Outlet } from 'react-router-dom';
import { Box, Flex } from 'gestalt';

import ArcanaVerseLogo from './components/ArcanaVerseLogo';
import UserAvatarButton from './components/UserAvatarButton';
import SoundToggle from './components/SoundToggle';
import { useAudioBootstrap } from '$/hooks/useAudio';

function RootLayoutPage() {
  // Arms the audio engine on the first gesture anywhere in the app
  useAudioBootstrap();

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
        <div className="flex justify-between pt-4 px-3">
          <SoundToggle />
          <UserAvatarButton />
        </div>
        <ArcanaVerseLogo />
      </Flex.Item>
      <Flex.Item flex="grow">
        <Outlet />
      </Flex.Item>
    </Flex>
  );
}

export default RootLayoutPage;
