import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Toaster } from '$/pages/RootLayoutPage/components/Toaster';
import { useEffect, useRef, useState, useContext } from 'react';
import { AppContext } from '$/context/AppContextProvider';
import { isMeaningfulQuestion } from '$/utils/questionValidation';

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

    // Validation for empty input submit, or question shorter than ~4 words.
    // Counts CJK characters too, since they carry no spaces to split on.
    if (!isMeaningfulQuestion(trimmedInput, 4)) {
      toast.warning('Please enter a more complete and meaningful question.');
      return;
    }

    // TODO: Save the input as user prompt in the context for later use
    saveUserPrompt(trimmedInput);
    // TODO: change route accordingly
    navigate('/fortune');
  };

  return (
    <>
      <div className="w-full max-w-2xl mx-auto">
        {/* TODO: Font to be changed later */}
        <h2 className="title font-cormorant font-extrabold text-4xl text-ink-800 text-center mb-2">
          What answer do you seek?
        </h2>
        <div className="relative leading-none">
          <textarea
            id="text-area-user-prompt"
            placeholder="Type a question you'd like to seek"
            value={input}
            onChange={handleChange}
            rows={1}
            ref={textAreaRef}
            maxLength={280}
            className={`w-full border-1 border-mist-400 rounded-lg py-3 pl-4 pr-16 text-lg text-ink-900 placeholder-mist-500 max-sm:placeholder:text-base bg-mist-500/10 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:bg-mist-100/50 overflow-hidden`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <button
            onClick={handleSubmit}
            className={`absolute ${
              textAreaHeight <= 56 ? 'top-1/2 -translate-y-1/2' : 'bottom-2'
            } right-2 size-9 bg-mist-600 rounded-md border-mist-600 cursor-pointer text-mist-50 hover:bg-mist-500 flex items-center justify-center`}
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M13.25 2a.75.75 0 0 0-.75.75v6.5H4.56l.97-.97a.75.75 0 0 0-1.06-1.06L2.22 9.47a.75.75 0 0 0 0 1.06l2.25 2.25a.75.75 0 0 0 1.06-1.06l-.97-.97h8.69A.75.75 0 0 0 14 10V2.75a.75.75 0 0 0-.75-.75Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <Toaster />
      </div>
    </>
  );
}

export default UserQuestionInput;
