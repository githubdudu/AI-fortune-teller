import { useContext } from 'react';
import ArcanaVerseLogo from '../../components/ArcanaVerseLogo';
import { AppContext } from '../../context/AppContextProvider';
import './HomePage.css';

function HomePage() {
  const { count, setCount } = useContext(AppContext);

  return (
    <>
      <ArcanaVerseLogo />
      <h1>ArcanaVerse</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          👍 {count}
        </button>
        <p>Let&apos;s rock !</p>
      </div>
    </>
  );
}

export default HomePage;
