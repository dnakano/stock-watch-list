import React, { useContext } from 'react';
import { StateContext, DispatchContext } from 'Utils/contexts';

function Buttons() {
  const state = useContext(StateContext);
  const { keywords, symbols, error } = state;
  const dispatch = useContext(DispatchContext);

  // When 'add' button is clicked...
  function handleAddClick() {
    const input = document.getElementById('StockSearch-input');

    // Add unique symbol to the symbols state
    if (keywords && !symbols.has(keywords.toUpperCase()) && !error) {
      dispatch({
        type: 'ADD_SYMBOL',
        payload: { symbol: keywords.toUpperCase().trim() },
      });
    }

    // TODO: Show error message when symbol already exists??

    // Clear input field
    if (keywords) {
      dispatch({
        type: 'UPDATE_KEYWORDS',
        payload: { keywords: '' },
      });
    }

    // Focus input field
    input && input.focus();
  }

  return (
    <div className="Buttons">
      <button
        type="button"
        className="Buttons-add"
        name="add"
        title="Add selected stock to the watch list"
        onClick={handleAddClick}
      >
        Add
      </button>
    </div>
  );
}

export default Buttons;
