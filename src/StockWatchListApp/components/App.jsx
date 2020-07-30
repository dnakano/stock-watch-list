import React, { useReducer } from 'react';
import { StateContext, DispatchContext } from 'Utils/contexts';
import ErrorChecker from 'Components/ErrorChecker';
import Message from 'Components/Message';
import Header from './Header';
import StockWatchList from './StockWatchList';

/*
  Initial state to be passed as a 2nd argument to useReducer() hook

  The shape of state object:
    {
      keywords: <string>, // Search input field value
      symbols: <Set>, // Unique set of stock symbols added to the list
      error: <string>, // Error message
    }
*/
const initialState = {
  keywords: '',
  symbols: new Set(),
  error: null,
};

/*
  Reducer function takes (previous state, action) => return new state

  The shape of action object:
    {
      type: <string>,
      payload: {
        keywords: <string>,
        symbol: <string>,
        error: <string>,
      },
    }
*/
function reducer(prevState, action) {
  switch (action.type) {
    case 'UPDATE_KEYWORDS':
      return ({
        ...prevState,
        keywords: action.payload.keywords,
      });

    case 'ADD_SYMBOL': {
      const prevSymbols = prevState.symbols;

      return ({
        ...prevState,
        symbols: prevSymbols.add(action.payload.symbol),
      });
    }

    case 'DELETE_SYMBOL': {
      const prevSymbols = prevState.symbols;

      // Delete symbol from the symbols set
      prevSymbols.delete(action.payload.symbol);

      return ({
        ...prevState,
        ...prevSymbols,
      });
    }

    case 'SET_ERROR':
      return ({
        ...prevState,
        error: action.payload.error,
      });

    default:
      return prevState;
  }
}

// Main app component
function App() {
  // Use useReducer() hook to create state and dispatch function
  const [state, dispatch] = useReducer(reducer, initialState);

  // Callback function for error message component
  function handleCloseClick() {
    // Reset error state
    dispatch({
      type: 'SET_ERROR',
      payload: { error: null },
    });
  }

  // Use StateContext & DispatchContext context providers to pass state and dispatch function down to children
  return (
    <div className="apps-wrapper">
      <ErrorChecker>
        <StateContext.Provider value={state}>
          <DispatchContext.Provider value={dispatch}>

            {
              state.error && (
                <Message
                  type="error"
                  title="Error"
                  message={state.error}
                  onCloseClick={handleCloseClick}
                />
              )
            }

            <Header />

            <StockWatchList />

          </DispatchContext.Provider>
        </StateContext.Provider>
      </ErrorChecker>
    </div>
  );
}

export default App;
