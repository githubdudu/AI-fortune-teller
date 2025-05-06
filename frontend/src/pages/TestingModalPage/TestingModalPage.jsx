import { useState } from 'react';
import FloatingPrompt from '../../components/FloatingPrompt/FloatingPrompt';
/*This page is used to test whether the floating window function is normal. 
After the user input page is completed, this page can be deleted*/
function WelcomePage() {
  const [showPrompt, setShowPrompt] = useState(true);
  const handlePromptClick = () => {
    setShowPrompt(false);
  };
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>🔮 Welcome to the Fortune Teller!</h1>
      <FloatingPrompt visible={showPrompt} onClick={handlePromptClick} />
    </div>
  );
}

export default WelcomePage;
