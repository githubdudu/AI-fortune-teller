import { useNavigate } from 'react-router-dom';
import { Flex, Box, Button, Text, TextArea } from 'gestalt';
import { useState } from 'react';

function UserQuestionInput() {
  const [input, setInput] = useState('');

  const navigate = useNavigate();

  const handleSubmit = () => {
    // TODO: Post API call to come here

    // TODO: change route accordingly
    navigate('/user-info-input');
  };

  return (
    <>
      {/* Gestalt */}
      {/* <Text size="600" weight="bold" align="center">
        What answer do you seek?
      </Text>
      <Box marginBottom={6} />
      <TextArea
        id="text-area-user-prompt"
        label="User input"
        labelDisplay="hidden"
        onChange={({ value }) => setInput(value)}
        placeholder="Select a category or type a question"
        rows={1}
        maxLength={{
          characterCount: 280,
          errorAccessibilityLabel:
            'Limit reached. You can only use 280 characters in this field.',
        }}
        value={input}
        disabled={false}
      />
      <Flex alignItems="center" justifyContent="center">
        <Button text="Tell a Fortune" onClick={handleSubmit} size="sm" />
      </Flex> */}

      {/* Tailwind */}
      <div className="w-full max-w-2xl mx-auto">
        {/* TODO: Font to be changed later */}
        <h2 className="text-[#261060] text-5xl font-bold text-center mb-7">
          What answer do you seek?
        </h2>
        <div className="relative mb-1">
          <textarea
            id="text-area-user-prompt"
            placeholder="Select a category or type a question"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={1}
            maxLength={280}
            className="w-full border-1 border-gray-300 rounded-lg py-3 pl-4 pr-32 text-lg text-[#261060] placeholder-[#261060] resize-none focus:outline-none focus:ring-2 focus:ring-indigo-200"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            style={{ backgroundColor: '#FFFBEF' }}
          />
          <button
            onClick={handleSubmit}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-0 mr-2 bg-transparent border-none cursor-pointer text-[#261060] hover:text-[#261060] flex items-center justify-center"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 mb-1"
            >
              <path
                fillRule="evenodd"
                d="M13.25 2a.75.75 0 0 0-.75.75v6.5H4.56l.97-.97a.75.75 0 0 0-1.06-1.06L2.22 9.47a.75.75 0 0 0 0 1.06l2.25 2.25a.75.75 0 0 0 1.06-1.06l-.97-.97h8.69A.75.75 0 0 0 14 10V2.75a.75.75 0 0 0-.75-.75Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

export default UserQuestionInput;
