// Contains Alpha Vantage-related objects and classes

// JSON data retrieved from Time Series Intraday API
export const TIME_SERIES_INTRADAY = {
  OPEN: '1. open',
  HIGH: '2. high',
  LOW: '3. low',
  CLOSE: '4. close',
  VOLUME: '5. volume',
};

// JSON data retrieved from Search Endpoint API
export const SEARCH_ENDPOINT = {
  SYMBOL: '1. symbol',
  NAME: '2. name',
  TYPE: '3. type',
  REGION: '4. region',
  MARKET_OPEN: '5. marketOpen',
  MARKET_CLOSE: '6. marketClose',
  TIME_ZONE: '7. timezone',
  CURRENCY: '8. currency',
  MATCH_SCORE: '9. matchScore',
};

// Contains properties and methods used to fetch data from Alpha Vantage using their API
export default class AlphaVantage {
  // Private field variable for Alpha Vantage API key
  #apiKey = 'JYV2BSCA3IQVJLOA';

  // Get url to retrieve intraday time series data of an equity
  getTimeSeriesUrl(symbol='', interval=1) {
    const intervalSet = new Set([1, 5, 15, 30, 60]);

    // The symbol has to be a non-empty string
    if (typeof symbol !== 'string' || !symbol) {
      console.error('getTimeSeriesUrl: The parameter <symbol> is invalid');

      return '';
    }

    // The interval has to be a valid number
    if (typeof interval !== 'number' || !intervalSet.has(interval)) {
      console.error('getTimeSeriesUrl: The parameter <interval> is invalid');

      return '';
    }

    return `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${interval}min&apikey=${this.#apiKey}`;
  }

  // Get url to retrieve the best-matching symbols based on keyword
  getSearchEndpointUrl(keyword = '') {
    // The keyword has to be a string
    if (typeof keyword !== 'string') {
      console.error('getSearchEndpointUrl: The parameter <keyword> is invalid');

      return '';
    }

    return keyword ? `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keyword}&apikey=${this.#apiKey}` : '';
  }
}
