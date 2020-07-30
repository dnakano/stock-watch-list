import React from 'react';
import PropTypes from 'prop-types';
import './stylesheets/InputErrorMessage.scss';

// Display error message
function InputErrorMessage({ message }) {
  return (
    <span className="InputErrorMessage">{message}</span>
  );
}

InputErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

export default InputErrorMessage;
