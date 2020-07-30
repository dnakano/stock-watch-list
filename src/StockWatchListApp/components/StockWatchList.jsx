import React, { useContext, useCallback } from 'react';
import { StateContext, DispatchContext } from 'Utils/contexts';
import StockWatchListItem from './StockWatchListItem';

// Component for stock watch list
function StockWatchList() {
  const state = useContext(StateContext);
  const { symbols } = state;
  const dispatch = useContext(DispatchContext);

  // Use useCallback hook to attach ref to the watch list item with error
  const callbackRef = useCallback((node) => {
    // Make sure node has symbol and error values on dataset
    if (node && node.dataset && node.dataset.symbol && node.dataset.error) {
      const { symbol, error } = node.dataset;

      // Set proper error message
      const errorMsg = error.includes('Invalid API call') ? `Stock symbol <${symbol}> does not exist. Please try again.` : error;

      // Remove symbol with an error from the symbols set
      dispatch({
        type: 'DELETE_SYMBOL',
        payload: { symbol },
      });

      // Set error state
      dispatch({
        type: 'SET_ERROR',
        payload: { error: errorMsg },
      });
    }
  }, [dispatch]);

  // Convert set of symbols to an array and create stock list items
  const items = [...symbols].map((symbol) => (
    <StockWatchListItem
      key={symbol}
      symbol={symbol}
      errorRef={callbackRef}
    />
  ));

  // Return the table of stocks or show empty message
  return (
    <table className="StockWatchList-table">
      <caption className="StockWatchList-caption">Stock Watch List</caption>

      <thead className="StockWatchList-header">
        <tr>
          <th scope="col">Symbol</th>
          <th scope="col">Price $</th>
          <th scope="col">Change $</th>
          <th scope="col">Change %</th>
          <th scope="col">Volume</th>
        </tr>
      </thead>

      {
        (items.length > 0) && (
          <tbody className="StockWatchList-tbody">
            {items}
          </tbody>
        )
      }
    </table>
  );
}

export default StockWatchList;
