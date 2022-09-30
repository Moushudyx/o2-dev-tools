/*
 * @LastEditTime: 2022-03-16 16:28:38
 * @Description: 入口文件
 */
import React from 'react';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { render } from 'react-dom';
import App from './App';
import './scss/index.scss';

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
