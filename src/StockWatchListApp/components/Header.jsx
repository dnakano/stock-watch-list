import React from 'react';
import StockSearch from './StockSearch';
import Buttons from './Buttons';

// Header component contains stock search input field and buttons
function Header() {

  // Prevent reloading the page when form is submitted
  function handleSubmit(evt) {
    evt.preventDefault();
  }

  return (
    <form className="Header" onSubmit={handleSubmit}>

      <StockSearch />

      <Buttons />

    </form>
  );
}

export default Header;
