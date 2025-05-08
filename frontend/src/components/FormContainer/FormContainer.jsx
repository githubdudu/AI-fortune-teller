import PropTypes from 'prop-types';

function FormContainer({ children }) {
  return (
    <div className="px-9 py-5 flex flex-col items-center bg-gray-50 rounded-xl shadow-md">
      {children}
    </div>
  );
}

FormContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default FormContainer;
