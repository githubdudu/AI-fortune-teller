import { Button, Image, TextArea, Box, Flex } from 'gestalt';
import UserQuestionInput from '../../components/UserQuestionInput';
import ThemeView from '../../components/ThemeView';

/**
 * This a page where user either selects from themes of fortune telling, or ask his own question.
 * @returns
 */

function UserInputPage() {
  return (
    <>
      <div className="w-165">
        <UserQuestionInput />
      </div>
      <Box marginBottom={2} />
      <h2> - or - </h2>
      <Box marginBottom={2} />
      <h2 className="text-[#261060] text-3xl font-bold text-center mb-7">
        Select a theme to let fate speak first.
      </h2>
      <div className="w-250">
        <ThemeView />
      </div>
      <div
        className="fixed top-115 left-1/2 -translate-x-1/2 w-1200 h-1200 bg-[#FFF9F7] rounded-full z-[-1] pointer-events-none"
        style={{ boxShadow: '0px 80px 300px rgba(0, 0, 0, 0.75)' }}
      />
    </>
  );
}

export default UserInputPage;
