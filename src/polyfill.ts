/*
 * @Author: shuyan.yin@hand-china.com
 * @Date: 2023-06-04 16:10:03
 * @LastEditTime: 2023-06-05 17:57:39
 * @LastEditors: shuyan.yin@hand-china.com
 * @Description: file content
 * @FilePath: \o2-dev-tools\src\polyfill.ts
 */
import { Buffer } from 'buffer';

export function polyfill() {
  if (!('process' in window)) {
    Object.assign(window, { process: { env: {} } });
  }
  if (!('Buffer' in window)) {
    Object.assign(window, { Buffer });
  }
}