/*
 * @Author: shuyan.yin@hand-china.com
 * @Date: 2023-06-04 16:10:03
 * @LastEditTime: 2023-06-21 10:26:54
 * @LastEditors: shuyan.yin@hand-china.com
 * @Description: file content
 * @FilePath: \o2-dev-tools\src\polyfill.ts
 */
import { Buffer } from 'buffer';
import * as XLSX from 'xlsx';

(
  [
    ['process', { env: {} }],
    ['Buffer', Buffer],
    ['XLSX', XLSX],
  ] as [string, unknown][]
).forEach(([key, obj]) => {
  if (!(key in window)) Object.assign(window, { [key]: obj });
});
