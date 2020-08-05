import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useFetch } from '../utils/hooks';
import AlphaVantage, { TIME_SERIES_INTRADAY } from '../utils/AlphaVantage';

const alphaVantage = new AlphaVantage();

// Create a list item with stock data retrieved from Alpha Vantage
const StockWatchListItem = ({ symbol, errorRef }) => {

  // Create unique class name for each stock
  const itemClass = `StockWatchListItem-${symbol}`;

  // Set Time Series interval and get Alpha Vantage quote url
  const tsInterval = 1;
  const url = alphaVantage.getTimeSeriesUrl(symbol, tsInterval);

  // Retrieve data from Alpha Vantage
  const { data, error } = useFetch({ url, type: 'off' });

  // States for stock data
  const [price, setPrice] = useState(0);
  const [changePrice, setChangePrice] = useState(0);
  const [changePercent, setChangePercent] = useState(0);
  const [volume, setVolume] = useState(0);

  // Update stock data from an array of data
  useEffect(() => {
    // Time Series key
    const tsKey = `Time Series (${tsInterval}min)`;

    let timeSeries = null;
    let index = 0;

    if (data && data[tsKey]) {
      // data contains stock quote data, now store it in an array
      timeSeries = Object.values(data[tsKey]);
    }

    // Update data to display
    const updateData = () => {
      // Get stock item element
      const item = document.querySelector(`.${itemClass}`);

      const openPrice = Number.parseFloat(timeSeries[index][TIME_SERIES_INTRADAY.OPEN]);

      const closePrice = Number.parseFloat(timeSeries[index][TIME_SERIES_INTRADAY.CLOSE]);

      const changePrice = closePrice - openPrice;

      const changePercent = (changePrice / openPrice) * 100;
      const volume = Number.parseInt(timeSeries[index][TIME_SERIES_INTRADAY.VOLUME], 10);

      if (changePrice > 0) {
        // Price went up
        item && item.classList.add('priceUp');
        item && item.classList.remove('priceDown');
      } else if (changePrice < 0) {
        // Price went down
        item && item.classList.remove('priceUp');
        item && item.classList.add('priceDown');
      } else {
        // Price stayed the same
        item && item.classList.remove('priceUp');
        item && item.classList.remove('priceDown');
      }

      // Update price
      setPrice(closePrice);

      // Update price change: close - open
      setChangePrice(changePrice);

      // Update price percentage: (close - open) / open * 100
      setChangePercent(changePercent);

      // Update volume
      setVolume((vol) => vol + volume);
    };

    let timeoutId = null;

    // Use setTimeout instead of setInterval to call function recursively
    // It guarantees the same amount of delay time
    const runRecursively = () => {
      // When maximum data is reached, stop
      if (index === timeSeries.length) {
        return;
      }

      updateData();
      index += 1;

      // Call recursively to update data
      timeoutId = setTimeout(runRecursively, 5000);
    };

    if (timeSeries) {
      runRecursively();
    }

    // Clean up effects
    return (() => {
      timeSeries = null;
      index = 0;
      clearTimeout(timeoutId);
    });
  }, [data, itemClass]);

  // Convert string to float and format
  const formatFloat = (value = '0.00') => {
    const num = Number.isNaN(Number.parseFloat(value)) ? 0 : Number.parseFloat(value);

    return num.toFixed(2);
  };

  // If data is empty and no error, return null
  if (!data && !error) {
    return null;
  }

  return (
    error ? (
      <tr ref={errorRef} data-symbol={symbol} data-error={error}>
        <td>--</td>
        <td>--</td>
        <td>--</td>
        <td>--</td>
        <td>--</td>
      </tr>
    ) : (
        <tr className={`StockWatchListItem ${itemClass}`}>
          <td data-th="Symbol">{symbol}</td>
          <td data-th="Price $">{formatFloat(price)}</td>
          <td data-th="Change $">{formatFloat(changePrice)}</td>
          <td data-th="Change %">{formatFloat(changePercent)}%</td>
          <td data-th="Volume">{volume}</td>
        </tr>
      )
  );
};

StockWatchListItem.propTypes = {
  symbol: PropTypes.string.isRequired,
  errorRef: PropTypes.func.isRequired,
};

export default StockWatchListItem;
