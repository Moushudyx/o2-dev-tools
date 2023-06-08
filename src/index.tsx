/*
 * @LastEditTime: 2023-06-04 16:15:02
 * @Description: 入口文件
 */
import React from 'react';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { render } from 'react-dom';
import { polyfill } from './polyfill';
import App from './App';
import './scss/index.scss';

polyfill();

render(
  process.env.HISTORY === 'browser' ? (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  ) : (
    <HashRouter>
      <App />
    </HashRouter>
  ),
  document.getElementById('app')
);
