import PropTypes from 'prop-types';

function FormContainer({ children, withBackground = true }) {
  const backgroundClass = withBackground ? 'bg-gray-50 shadow-mm ' : '';
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
