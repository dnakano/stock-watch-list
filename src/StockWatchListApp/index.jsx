import React from 'react';
import { render } from 'react-dom';
import App from './components/App';

// Sass
import 'Stylesheets/globals.scss';
import './stylesheets/styles.scss';

render(
  <App />,
  document.getElementById('StockWatchListApp')
);
