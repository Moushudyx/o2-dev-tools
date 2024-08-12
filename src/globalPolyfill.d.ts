/*
 * @Author: moushu
 * @Date: 2023-06-16 11:30:34
 * @LastEditTime: 2023-06-20 09:52:28
 * @Description: 预置功能相关类型声明
 * @FilePath: \o2-dev-tools\src\globalPolyfill.d.ts
 */
import { Buffer as BufferPolyfill } from 'buffer';
import * as XLSXPolyfill from 'xlsx';

declare global {
  declare const process: {
    env: {
      NODE_ENV: 'development' | 'production';
      HISTORY: 'browser' | 'hash';
    };
  };

  declare const Buffer: typeof BufferPolyfill;
  declare const XLSX: typeof XLSXPolyfill;
}
