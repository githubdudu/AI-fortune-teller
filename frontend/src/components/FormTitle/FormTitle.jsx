import { PropTypes } from 'prop-types';

// The login page used to get its own hardcoded orange gradient and every other
// form a purple-to-pink one. Both were Figma-era decoration with nothing left
// to express once there was a single palette — colour is carried by the form
// and the cards now, so the title only has to be clear.
function FormTitle({ title = 'Title', subtitle = 'Subtitle', className = '' }) {
  return (
    <header
      className={`pt-4 pb-2 flex flex-col items-center gap-4 ${className}`}
    >
      <h1 className="text-4xl pb-2 lg:text-5xl font-bold text-center text-ink">
        {title}
      </h1>
      <h2 className="text-lg lg:text-xl text-ink/70 text-center">{subtitle}</h2>
    </header>
  );
}

FormTitle.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  className: PropTypes.string,
};

export default FormTitle;
