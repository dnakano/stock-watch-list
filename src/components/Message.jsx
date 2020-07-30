import React from 'react';
import PropTypes from 'prop-types';
import { isValidValue, isValidSet } from 'Utils/utils';
import Modal from 'Components/Modal';
import './stylesheets/Message.scss';

// Show message modal
function Message({
  type='confirm',
  title='',
  message='',
  onCloseClick,
  confirmButton=null,
}) {
  const className = `Message Message-${type} ${confirmButton ? `Message-confirm-${confirmButton.type}` : ''}`;

  // Set up modal configuration
  const config = {
    className,
    position: 'center',
    showClose: true,
    size: 'compact',
    title,
    onCloseClick,
  };

  // Validate props
  if (!isValidSet(type, new Set(['confirm', 'error'])) ||
    !isValidValue(title) ||
    !isValidValue(message) ||
    !isValidValue(onCloseClick, 'function')
  ) {
    return null;
  }

  // For type='confirm', confirmButton prop is required
  if (type === 'confirm' && !confirmButton) {
    console.error('Message(): confirmButton prop is required when type="confirm"');

    return null;
  }

  // Check whether confirmButton object has 'type', 'name' and 'onClick' properties
  const hasTypeProperty = confirmButton && Object.prototype.hasOwnProperty.call(confirmButton, 'type');
  const hasNameProperty = confirmButton && Object.prototype.hasOwnProperty.call(confirmButton, 'name');
  const hasOnClickProperty = confirmButton && Object.prototype.hasOwnProperty.call(confirmButton, 'onClick');

  // Validate confirmButton prop
  if (type === 'confirm' && confirmButton && (
    !hasTypeProperty || !hasNameProperty || !hasOnClickProperty ||
    !isValidSet(confirmButton.type, new Set(['ok', 'warn'])) ||
    !isValidValue(confirmButton.name) ||
    !isValidValue(confirmButton.onClick, 'function')
  )) {
    return null;
  }

  return (
    <Modal config={config}>
      <p className="Message-content">{message}</p>

      <div className="Message-buttons">
        <button
          type="button"
          title="Close"
          className="Message-button Message-button-close"
          onClick={onCloseClick}
        >
          {type === 'confirm' && confirmButton ? 'Cancel' : 'OK'}
        </button>

        {
          type === 'confirm' && confirmButton && (
            <button
              type="button"
              title={confirmButton.name}
              className="Message-button Message-button-confirm"
              onClick={confirmButton.onClick}
            >
              {confirmButton.name}
            </button>
          )
        }
      </div>
    </Modal>
  );
}

// Specifies the default values for props:
Message.defaultProps = {
  confirmButton: null,
};

Message.propTypes = {
  type: PropTypes.oneOf(['confirm', 'error']).isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onCloseClick: PropTypes.func.isRequired,
  confirmButton: PropTypes.shape({
    type: PropTypes.oneOf(['ok', 'warn']).isRequired,
    name: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  }),
};

export default Message;
