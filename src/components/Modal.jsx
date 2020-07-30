import React from 'react';
import PropTypes from 'prop-types';
import { isValidValue, isValidSet } from 'Utils/utils';
import './stylesheets/Modal.scss';

/*
  Create generic modal window

  The shape of config:
    borders: <string> (['normal', 'round']),
    className: <string>,
    hideTitle: <boolean>,
    position: <string> (['top', 'center', 'bottom']),
    showClose: <boolean>,
    size: <string> (['full', 'compact']),
    title: <string>,
    onCloseClick: <function>,
*/
function Modal({ config, children }) {

  // Default config values
  const {
    borders = 'normal',
    className = '',
    hideTitle = false,
    position = 'top',
    showClose = false,
    size = 'full',
    title = '',
    onCloseClick = null,
  } = config;

  // Prevent modal box from propagating when clicked
  function handleClick(evt) {
    evt.stopPropagation();
  }

  // Validate config properties
  function validConfig() {
    if (
      !isValidSet(borders, new Set(['normal', 'round'])) ||
      !isValidValue(className) ||
      !isValidValue(hideTitle, 'boolean') ||
      !isValidSet(position, new Set(['top', 'center', 'bottom'])) ||
      !isValidValue(showClose, 'boolean') ||
      !isValidSet(size, new Set(['full', 'compact'])) ||
      !isValidValue(title) ||
      (showClose && !isValidValue(onCloseClick, 'function'))
    ) {
      return false;
    }

    // Make sure onCloseClick callback is present when showClose is true
    if (showClose && typeof onCloseClick !== 'function') {
      console.error('The value of onCloseClick has to be a function when showClose is <true>.');

      return false;
    }

    return true;
  }

  if (!validConfig()) {
    return null;
  }

  return (
    <div
      className={`Modal-mask Modal-box-${position.toLowerCase()} ${className}`}
      onClick={onCloseClick}
      role="presentation"
    >
      <div
        className={`Modal-box Modal-box-${size.toLowerCase()} ${hideTitle ? 'Modal-box-body-only' : ''}`}
        onClick={handleClick}
        role="presentation"
      >

        {
          !hideTitle && <h4 className={`Modal-box-title Modal-box-title-${borders.toLowerCase()}`}>{title}</h4>
        }

        {
          showClose && (
            <button
              type="button"
              title="Close"
              className="Modal-btn-close"
              onClick={onCloseClick}
            >
              <span>Close</span>
            </button>
          )
        }

        <div className={`Modal-box-body Modal-box-body-${borders.toLowerCase()}`}>
          {children}
        </div>

      </div>
    </div>
  );
}

// Specifies the default values for props:
Modal.defaultProps = {
  config: {
    borders: 'normal',
    className: '',
    hideTitle: false,
    position: 'top',
    showClose: false,
    size: 'full',
    title: '',
    onCloseClick: null,
  },
};

Modal.propTypes = {
  config: PropTypes.shape({
    borders: PropTypes.oneOf(['normal', 'round']),
    className: PropTypes.string,
    hideTitle: PropTypes.bool,
    position: PropTypes.oneOf(['top', 'center', 'bottom']),
    showClose: PropTypes.bool,
    size: PropTypes.oneOf(['full', 'compact']),
    title: PropTypes.string,
    onCloseClick: PropTypes.func,
  }),

  children: PropTypes.node.isRequired,
};

export default Modal;
