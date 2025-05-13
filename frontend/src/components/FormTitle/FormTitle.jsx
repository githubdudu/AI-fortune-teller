import { PropTypes } from 'prop-types';
function FormTitle({ title = 'Title', subtitle = 'Subtitle', className = '' }) {
  return (
    <header
      className={`pt-4 pb-2 flex flex-col items-center gap-4 ${className}`}
    >
      <h1 className="text-4xl pb-2 lg:text-5xl font-bold text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        {title}
      </h1>
      <h2 className="text-lg lg:text-xl text-gray-600 text-center">
        {subtitle}
      </h2>
    </header>
  );
}

FormTitle.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  className: PropTypes.string,
};

export default FormTitle;
