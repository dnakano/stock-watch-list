/* eslint jsx-a11y/click-events-have-key-events: "off" */

import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { StateContext } from 'Utils/contexts';
import { useFetch } from '../utils/hooks';
import AlphaVantage, { SEARCH_ENDPOINT } from '../utils/AlphaVantage';

const alphaVantage = new AlphaVantage();

// Fetch matching stocks from Alpha Vantage and create dropdown list
function BestMatchList({
  listboxId,
  labelName,
  hasData,
  onClick,
  bestMatchRef,
}) {
  const state = useContext(StateContext);
  const { keywords } = state;

  // Set up Alpha Vantage search url
  const url = alphaVantage.getSearchEndpointUrl(keywords);

  // Retrieve data and/or error from Alpha Vantage
  const { data, error } = useFetch({ url, type: 'timeout', delay: 1200 });

  // Return null if no keywords, no valid data, or empty list
  if (
    !keywords ||
    (!data && !error) ||
    (data && data.bestMatches && data.bestMatches.length === 0)
  ) {
    // Set hasData ref to false
    hasData.current = false;

    return null;
  }

  let items = null;

  // If fetch returned an error, show error inside the popup
  if (error) {
    items = (
      <li className="BestMatchList-error">
        ERROR<br />
        <i>{error}</i>
      </li>
    );
  }

  // Retrieved best match results
  if (data && data.bestMatches && !error) {
    items = data.bestMatches.map((match, index) => {
      const symbol = match[SEARCH_ENDPOINT.SYMBOL];
      const name = match[SEARCH_ENDPOINT.NAME];

      return (
        <li
          key={symbol}
          id={`BestMatchListItem${index}`}
          className="BestMatchList-item"
          role="option"
          aria-selected="false"
          onClick={onClick}
        >
          <span className="BestMatchList-item-symbol">{symbol}</span>
          <span className="BestMatchList-item-name">{name}</span>
        </li>
      );
    });
  }

  // Set hasData ref to true
  hasData.current = true;

  return (
    items ? (
      <ul
        ref={bestMatchRef}
        id={listboxId}
        role="listbox"
        aria-label={labelName}
        onClick={onClick}
      >
        {items}
      </ul>
    ) : null
  );
}

BestMatchList.propTypes = {
  listboxId: PropTypes.string.isRequired,
  labelName: PropTypes.string.isRequired,
  hasData: PropTypes.shape({
    current: PropTypes.bool,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  bestMatchRef: PropTypes.func.isRequired,
};

export default BestMatchList;
