import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'Components/ErrorBoundary';

// ErrorChecker component sets React's strict mode and error boundary
function ErrorChecker({ children }) {
  return (
    <React.StrictMode>
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    </React.StrictMode>
  );
}

ErrorChecker.propTypes = {
  children: PropTypes.element.isRequired,
};

export default ErrorChecker;
