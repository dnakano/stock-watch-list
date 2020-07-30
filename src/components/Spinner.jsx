import React from 'react';
import Modal from 'Components/Modal';

// Show spinner while loading
function Spinner() {

  const config = {
    borders: 'round',
    hideTitle: true,
    position: 'center',
    size: 'compact',
  };

  return (
    <Modal config={config}>
      <p>Loading...</p>
    </Modal>
  );
}

export default Spinner;
