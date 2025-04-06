import arcanaVerseLogo from '../../assets/arcanaVerse.png';
import './ArcanaVerseLogo.css';

function ArcanaVerseLogo() {
  return (
    <div>
      <a href="#" target="_blank">
        <img src={arcanaVerseLogo} className="logo" alt="ArcanaVerse logo" />
      </a>
    </div>
  );
}

export default ArcanaVerseLogo;
