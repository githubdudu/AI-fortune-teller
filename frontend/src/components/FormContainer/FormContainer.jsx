import PropTypes from 'prop-types';

function FormContainer({ children, withBackground = true }) {
  // `shadow-mm` was not a real utility and had been silently dropped, so this
  // container has never actually had a shadow.
  const backgroundClass = withBackground ? 'bg-veil shadow-md ' : '';
  return (
    <div
      className={`px-0 sm:px-9 py-5 flex flex-col items-center ${backgroundClass} rounded-xl`}
    >
      {children}
    </div>
  );
}

FormContainer.propTypes = {
  children: PropTypes.node.isRequired,
  withBackground: PropTypes.bool,
};

export default FormContainer;
