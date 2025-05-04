import { Link } from 'react-router-dom';
import arcanaVerseLogo from '../../assets/arcanaVerse.png';

function ArcanaVerseLogo() {
  return (
    <div>
      <Link to="/" target="_self">
        <img
          src={arcanaVerseLogo}
          className="h-35 mx-auto mt-6 transition-[filter] duration-300 hover:[filter:drop-shadow(0_0_2em_rgba(100,108,255,0.67))]"
          alt="ArcanaVerse logo"
        />
      </Link>
    </div>
  );
}

export default ArcanaVerseLogo;
