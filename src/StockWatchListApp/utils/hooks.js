// Custom React hooks
import { useState, useEffect, useRef } from 'react';
import { isValidValue, isValidSet } from 'Utils/utils';

/*
  Hook that fetch data and returns data and an error (if any)

  Params:
    {
      url: <string> url to fetch data from
      type: <string> Fetch frequency: 'timeout'/'interval'/'off'
      delay: <number> timeout delay in millisecond
    }
*/
export const useFetch = ({ url = '', type = 'off', delay = 1000 }) => {

  // state variables to track fetched data and error
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // Create ref to keep track of first fetch
  const isFirst = useRef(true);

  // Fetch and retrieve data
  useEffect(() => {
    // Flag to let data fetching know about the state (mounted/unmounted) of the component.
    let didCancel = false;

    // Fetch data asynchronously
    const fetchData = async () => {

      try {
        if (!url) {
          return;
        }

        const response = await fetch(url);

        // Response status is not ok
        if (!response.ok) {
          throw `Failed to retrieve data! Code: ${response.status} Message: ${response.statusText}`;
        }

        // Convert json to plain object and return promise
        const obj = await response.json();

        // Response object contains error
        if (obj['Error Message']) {
          throw obj['Error Message'];
        }

        let timeoutId = null;

        // Response object has 'note'
        if (obj && obj.Note) {
          console.warn('Alpha Vantage returned note...');
          console.warn(`obj.Note: ${obj.Note}`);

          // For interval and off, pause 60 second and try again...
          if (type !== 'timeout') {
            timeoutId = setTimeout(fetchData, 60000);
          }
        }

        // Valid data
        if (!didCancel && obj && !obj.Note && !obj['Error Message']) {
          clearTimeout(timeoutId);
          setData(obj);
        }

      } catch (error) {
        console.error(error);

        if (!didCancel) {
          setError(error);
        }
      }
    };

    let recursiveId = null;

    // Use setTimeout instead of setInterval to call fetchData recursively
    // It guarantees the same amount of delay time
    const runRecursively = () => {
      fetchData();
      recursiveId = setTimeout(runRecursively, delay);
    };

    // Validate parameters
    const isValid = () => {
      if (
        !isValidValue(url) ||
        !isValidSet(type, new Set(['timeout', 'interval', 'off'])) ||
        !isValidValue(delay, 'number')
      ) {
        const msg = 'useFetch: Invalid parameters';

        console.error(msg);
        setError(msg);

        return false;
      }

      return true;
    };

    let timeoutId = null;

    if (isValid()) {
      // For interval, show the first data instantly
      if (type === 'interval' && isFirst.current) {
        fetchData();
        isFirst.current = false;
      }

      // Set appropriate callback function based on type
      const fn = type === 'interval' ? runRecursively : fetchData;

      // Add some delay to reduce the number of requests
      timeoutId = setTimeout(fn, delay);
    }

    // Clean up timeouts and cancel flag on each render
    return (() => {
      didCancel = true;
      clearTimeout(timeoutId);
      clearTimeout(recursiveId);
    });
  }, [url, type, delay]);

  // Return an object with data and error properties
  return { data, error };
};

// Return previous state
export const usePrevious = (value) => {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
};
