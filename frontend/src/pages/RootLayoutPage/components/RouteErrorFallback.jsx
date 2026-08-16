import PropTypes from 'prop-types';

function RouteErrorFallback({ resetErrorBoundary }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-4 px-4 py-12 text-center"
    >
      <h2 className="text-2xl font-medium text-ink">Something went wrong</h2>
      <p className="text-ink/70">
        This part of the reading failed to load. Try again.
      </p>
      <button
        type="button"
        onClick={resetErrorBoundary}
        className="px-6 py-3 bg-core text-bg font-medium rounded-md hover:bg-ink transition-colors"
      >
        Try again
      </button>
    </div>
  );
}

RouteErrorFallback.propTypes = {
  resetErrorBoundary: PropTypes.func.isRequired,
};

export default RouteErrorFallback;
