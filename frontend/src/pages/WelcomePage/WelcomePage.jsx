import FloatingPrompt from '../../components/FloatingPrompt/FloatingPrompt';
import { useNavigate } from 'react-router-dom';

function WelcomePage() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/user-input');
  };
  return (
    <div className="welcome-page-container">
      <FloatingPrompt onClick={handleClick} />
    </div>
  );
}

export default WelcomePage;
