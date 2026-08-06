import { Link } from 'react-router-dom';
import arcanaVerseLogo from '$/assets/arcanaVerse.png';

function ArcanaVerseLogo() {
  return (
    <div title="Go to home page" className="flex items-center justify-center">
      <Link to="/" target="_self" aria-label="Go to home page">
        <img
          src={arcanaVerseLogo}
          className="h-25 mx-auto cursor-pointer transition-[filter] duration-300 hover:glow-spark"
          alt="ArcanaVerse logo"
        />
      </Link>
    </div>
  );
}

export default ArcanaVerseLogo;
