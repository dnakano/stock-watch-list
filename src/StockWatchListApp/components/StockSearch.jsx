import React, {
  lazy,
  Suspense,
  useState,
  useRef,
  useCallback,
  useContext,
} from 'react';
import { StateContext, DispatchContext } from 'Utils/contexts';
import Spinner from 'Components/Spinner';

// Dynamically load BestMatchList component and name it 'BestMatchList' for webpackChunkName. For more info: https://webpack.js.org/guides/code-splitting/#dynamic-imports
const BestMatchList = lazy(() => import(/* webpackChunkName: 'BestMatchList' */ './BestMatchList'));

// Component for stock search input field
function StockSearch() {
  const state = useContext(StateContext);
  const { keywords, symbols } = state;
  const dispatch = useContext(DispatchContext);

  // Contains listbox element
  const [listbox, setListBox] = useState(null);

  // Flag to get data
  const [getData, setGetData] = useState(false);

  // Keep track of wheter fetch returned data or not
  const hasData = useRef(false);

  // Keep track of index of currently active element
  const activeIndex = useRef(-1);

  const labelName = 'Search stock';
  const comboboxId = 'StockSearch-combobox';
  const inputId = 'StockSearch-input';
  const listboxId = 'BestMatchList';

  let items = null;

  // Use useCallback hook to attach ref to the listbox
  const callbackRef = useCallback((node) => {
    // Store listbox node in a state variable
    setListBox(node);
  }, []);

  // Get hasData
  const getHasData = () => (hasData.current);

  // Set hasData
  const setHasData = (value=false) => {
    hasData.current = value;
  };

  // Get activeIndex
  const getActiveIndex = () => (activeIndex.current);

  // Set activeIndex
  const setActiveIndex = (value=-1) => {
    activeIndex.current = typeof value === 'number' ? value : -1;
  };

  // When a descendant of a listbox popup is focused, DOM focus remains on the textbox and the textbox has 'aria-activedescendant' set to a value that refers to the focused element within the popup.
  const setActiveDescendant = (el=null, setIt=false) => {
    setIt ? (
      el && el.setAttribute('aria-activedescendant', `BestMatchListItem${getActiveIndex()}`)
    ) : (
      el && el.removeAttribute('aria-activedescendant')
    );
  };

  // Set input field value
  const setInputValue = (value='') => {
    dispatch({
      type: 'UPDATE_KEYWORDS',
      payload: {
        keywords: typeof value === 'string' ? value.trim() : '',
      },
    });
  };

  // Focus & select item
  const selectItem = (el = null, selected=false) => {
    // Set or remove focus class on item
    selected ? (
      el && el.classList.add('BestMatchList-item-focus')
    ) : (
      el && el.classList.remove('BestMatchList-item-focus')
    );

    // In a combobox with a listbox popup, when a suggested value is visually indicated as the currently selected value, the 'option' containing that value has 'aria-selected' set to 'true'.
    el && el.setAttribute('aria-selected', `${selected}`);
  };

  // Set active item
  const setActiveItem = (el=null, item=null, index=-1) => {
    setActiveIndex(index);
    setActiveDescendant(el, true);
    selectItem(item, true);
  };

  // Reset all variables
  const resetAll = (el=null) => {
    setActiveIndex(-1);
    setActiveDescendant(el, false);
    setListBox(null);
    setGetData(false);
    setHasData(false);
  };

  // When key is pressed inside the input field...
  function handleKeyDown(evt) {
    const { target, key } = evt;

    // If popup is closed, has no data, or listbox doesn't exist, exit
    if (!getData || !getHasData() || !listbox) {
      resetAll(target);

      return;
    }

    // Get listbox items
    items = listbox.querySelectorAll('li');

    if (!items) {
      resetAll(target);

      return;
    }

    const previousItem = items[getActiveIndex()];

    // Reset item
    selectItem(previousItem, false);

    switch (key) {

      case 'ArrowUp': {
        // When focus is in the input field or first item, get last item's index, else get previous index
        const index = getActiveIndex() <= 0 ? items.length - 1 : getActiveIndex() - 1;

        setActiveItem(target, items[index], index);

        // Consume key events to prevent browser from performing the events
        evt.preventDefault();

        break;
      }

      case 'ArrowDown': {
        // When focus is in the last item, get first item's index, else get next index
        const index = getActiveIndex() < items.length - 1 ? getActiveIndex() + 1 : 0;

        setActiveItem(target, items[index], index);

        // Consume key events to prevent browser from performing the events
        evt.preventDefault();

        break;
      }

      case 'ArrowLeft':
      case 'ArrowRight':
      case 'Home':
      case 'End': {
        // ArrowLeft: Focus the input field w/o closing the popup and moves the input cursor one character to the left. If the input cursor is on the left-most character, the cursor does not move.

        // ArrowRight: Focus the input field w/o closing the popup and moves the input cursor one character to the right. If the input cursor is on the right-most character, the cursor does not move.

        // Home: Return focus to the input field and places the cursor on the first character.

        // End: Return focus to the input field and places the cursor after the last character.

        // Reset and focus input field
        setActiveIndex(-1);
        setActiveDescendant(target, false);

        target && target.focus();

        break;
      }

      case 'Enter': {
        if (getActiveIndex() === -1) {
          // When Enter is pressed inside the input field, add the symbol to the list if it doesn't exist...
          if (keywords && !symbols.has(keywords.toUpperCase())) {
            dispatch({
              type: 'ADD_SYMBOL',
              payload: { symbol: keywords.toUpperCase().trim() },
            });
          }

          resetAll(target);
          setInputValue('');
        } else {
          // When Enter is pressed when focus is in the listbox, select the item and make its symbol input value...
          setInputValue(previousItem.firstElementChild.textContent);
          setActiveIndex(-1);
          setActiveDescendant(target, false);
        }

        break;
      }

      case 'Escape': {
        // Close the popup, return focus to the input field, and clear the contents of the input field
        resetAll(target);
        setInputValue('');
        target && target.focus();

        break;
      }

      case 'Tab': {
        // Close popup, reset, and focus the 'add' button
        resetAll(target);

        break;
      }

      default: {
        // Do nothing...
      }
    }

    evt.stopPropagation();
  }

  // When input field value changes...
  function handleChange({ target }) {
    const { value } = target;

    // Value must be alphanumeric and can contain space
    const regex = /^[a-z\d\-_\s]+$/iu;

    // Update input value
    setInputValue(value);

    // Reset values
    setActiveIndex(-1);
    setActiveDescendant(target, false);

    // When input field is empty or invalid, reset
    if (!value || (value && !regex.test(value))) {
      resetAll(target);

      return;
    }

    setGetData(true);
  }

  // When list item is clicked...
  function handleClick(evt) {
    const { target } = evt;

    if (getActiveIndex() === -1) {
      // Input field has focus

      // If target is <SPAN>, get its parent (<LI>)
      const el = target.tagName === 'SPAN' ? target.parentElement : target;

      el && setInputValue(el.firstElementChild.textContent);

      // Reset
      setActiveIndex(-1);
      setActiveDescendant(target, false);
    }

    evt.stopPropagation();
  }

  // When input field loses focus...
  function handleBlur(evt) {
    if (getActiveIndex() !== -1) {
      // When listbox item has focus, get selected item's symbol and update input field
      setInputValue(items[getActiveIndex()].firstElementChild.textContent);

      // Reset selected item
      selectItem(items[getActiveIndex()], false);
      setActiveDescendant(evt.target, false);
    }

    evt.stopPropagation();
  }

  // When input field gains focus...
  function handleFocus(evt) {
    // Reset active item
    setActiveIndex(-1);
    setActiveDescendant(evt.target, false);
    evt.stopPropagation();
  }

  // Update combobox attributes - A combobox is said to be expanded when both the textbox and a secondary element that serves as its popup are visible.
  const setComboBox = () => {
    const combobox = document.getElementById(comboboxId);

    combobox && combobox.setAttribute('aria-expanded', getHasData() ? 'true' : 'false');
  };

  setComboBox();

  return (
    <div className="StockSearch">
      <label htmlFor={inputId}>{labelName}</label>

      <div
        id={comboboxId}
        role="combobox"
        aria-controls={listboxId}
        aria-expanded="false"
        aria-haspopup="listbox"
        aria-label={labelName}
        aria-owns={listboxId}
      >

        <input
          id={inputId}
          type="search"
          role="searchbox"
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-multiline="false"
          name="q"
          value={keywords}
          placeholder="Enter a stock symbol"
          autoComplete="off"
          onBlur={handleBlur}
          onFocus={handleFocus}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />

      </div>

      <Suspense fallback={<Spinner />}>
        {
          getData && (
            <BestMatchList
              listboxId={listboxId}
              labelName={labelName}
              hasData={hasData}
              onClick={handleClick}
              bestMatchRef={callbackRef}
            />
          )

        }
      </Suspense>
    </div>
  );
}

export default StockSearch;
