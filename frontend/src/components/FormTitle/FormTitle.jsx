import { PropTypes } from 'prop-types';
function FormTitle({ title = 'Title', subtitle = 'Subtitle' }) {
  return (
    <header className="pt-4 pb-6 flex flex-col items-center gap-4">
      <h1 className="text-5xl font-bold leading-7xl">{title}</h1>
      <h2 className="text-2xl">{subtitle}</h2>
    </header>
  );
}

FormTitle.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
};

export default FormTitle;
