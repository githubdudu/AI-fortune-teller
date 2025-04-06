import { useContext } from 'react';
import ArcanaVerseLogo from '../../components/ArcanaVerseLogo';
import { AppContext } from '../../context/AppContextProvider';

function HomePage() {
  const { count, setCount } = useContext(AppContext);

  return (
    <>
      <ArcanaVerseLogo />
      <h1 className="text-5xl leading-tight">ArcanaVerse</h1>
      <div className="p-8">
        <button
          className="px-5 py-2 rounded-lg border border-w-1 border-solid border-transparent bg-slate-100 font-medium hover:border-indigo-500 transition-colors duration-[0.25s] cursor-pointer focus:ring-4 focus:ring-indigo-500 focus-visible:ring-4 focus-visible:ring-indigo-500"
          onClick={() => setCount((count) => count + 1)}
        >
          👍 {count}
        </button>
        <p className="text-2xl text-blue-500 font-bold">Let&apos;s rock !</p>
      </div>
    </>
  );
}

export default HomePage;
