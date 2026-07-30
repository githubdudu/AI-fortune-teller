import { useNavigate } from 'react-router-dom';
import { Flex, Box, Button, Text, TextArea, Toast } from 'gestalt';
import { useEffect, useRef, useState, useContext } from 'react';
import { AppContext } from '$/context/AppContextProvider';
import './UserQuestionInput.css';

function UserQuestionInput() {
  const textAreaRef = useRef(null);

  // Context state
  const {
    saveUserPrompt,
    clearQuestionAndTheme,
    userChosenTheme,
    userPrompt,
    userChosenCards,
    saveUserChosenCards,
  } = useContext(AppContext);
  // internal state
  const [input, setInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [textAreaHeight, setTextAreaHeight] = useState(0);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  useEffect(() => {
    textAreaRef.current.style.height = 'auto';
    textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px';
    setTextAreaHeight(textAreaRef.current.scrollHeight);
  }, [input]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleSubmit = () => {
    clearQuestionAndTheme();
    // Clear the user question and theme from context
    if (!userPrompt) {
      console.log('userPrompt is empty');
    } else {
      console.log('userPrompt:', userPrompt);
    }
    if (!userChosenTheme) {
      console.log('userChosenTheme is empty');
    } else {
      console.log('userChosenTheme:', userChosenTheme);
    }

    // Clear the user chosen cards from context
    saveUserChosenCards(null);
    if (!userChosenCards) {
      console.log('userChosenCards is empty');
    } else {
      console.log('userChosenCards:', userChosenCards);
    }

    const trimmedInput = input.trim();
    const wordCount = trimmedInput.split(/\s+/).length;

    // Validation for empty input submit, or question with less than 4 words
    // TODO: Come up with a logic for validating non sense words combination...
    if (trimmedInput.length < 10 || wordCount < 4) {
      setErrorMessage('Please enter a more complete and meaningful question.');
      setInput('');
      return;
    }

    // TODO: Save the input as user prompt in the context for later use
    saveUserPrompt(trimmedInput);
    // TODO: change route accordingly
    navigate('/fortune');
  };

  const handleDismiss = () => {
    setErrorMessage('');
  };

  return (
    <>
      <div className="w-full max-w-2xl mx-auto">
        {/* TODO: Font to be changed later */}
        <h2 className="title">What answer do you seek?</h2>
        <div className="relative mb-1">
          <textarea
            id="text-area-user-prompt"
            placeholder="Type a question you'd like to seek from the cards"
            value={input}
            onChange={handleChange}
            rows={1}
            ref={textAreaRef}
            maxLength={280}
            className={`w-full border-1 border-gray-300 rounded-lg py-3 pl-4 pr-32 text-lg text-[#261060] placeholder-[#261060] resize-none focus:outline-none focus:ring-2 focus:ring-indigo-200 overflow-hidden`}
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
            className={`absolute ${
              textAreaHeight <= 56 ? 'top-1/2 -translate-y-1/2' : 'bottom-2'
            } right-3 p-0 mr-2 bg-transparent border-none cursor-pointer text-[#261060] hover:text-[#261060] flex items-center justify-center`}
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
        {errorMessage && (
          <div className="flex justify-center mt-2">
            <Toast
              text={errorMessage}
              dismissButton={{
                onDismiss: handleDismiss,
              }}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default UserQuestionInput;
