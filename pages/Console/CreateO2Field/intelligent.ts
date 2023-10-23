/*
 * @Author: shuyan.yin@hand-china.com
 * @Date: 2023-06-07 16:57:01
 * @LastEditTime: 2023-10-23 14:47:24
 * @LastEditors: shuyan.yin@hand-china.com
 * @Description: file content
 * @FilePath: \o2-dev-tools\pages\Console\CreateO2Field\intelligent.ts
 */

import { deepClone } from 'salt-lib';

export function intelligentHeadRead(head: string) {
  const cols = head.split('\t');
  const map = {
    textColumnIndex: Array(cols.length).fill(0) as number[],
    codeColumnIndex: Array(cols.length).fill(0) as number[],
    typeColumnIndex: Array(cols.length).fill(0) as number[],
    lovColumnIndex: Array(cols.length).fill(0) as number[],
    requireColumnIndex: Array(cols.length).fill(0) as number[],
    disableColumnIndex: Array(cols.length).fill(0) as number[],
  };
  // let getFieldName = false;
  cols.forEach((col, index) => {
    if (/业务字段名称?/.test(col)) {
      map.textColumnIndex[index] += 5;
      // getFieldName = true;
    } else if (/Da?t?a?\s?Ba?s?e?字段名称?/i.test(col)) {
      map.codeColumnIndex[index] += 2;
    } else if (/字段名称?/.test(col)) {
      map.textColumnIndex[index] += 5;
      // map.codeColumnIndex[index] += getFieldName ? 2 : 4;
    }
    if (/字段编[号码]?/.test(col)) {
      map.codeColumnIndex[index] += 3;
    }
    if (/字段类型|界面类型/.test(col)) {
      map.typeColumnIndex[index] += 5;
    }
    if (/必[填须需要]/.test(col)) {
      map.requireColumnIndex[index] += 5;
    }
    if (/禁用|可编辑?/.test(col)) {
      map.disableColumnIndex[index] += 5;
    }
    if (/值列表/i.test(col)) {
      map.lovColumnIndex[index] += 2;
    }
    if (/值列表类?型?|(?:lov|值集)编?码?/i.test(col)) {
      map.lovColumnIndex[index] += 5;
    }
  });
  // console.log('Map', {...map});
  return getMapMax(map);
}

function getMapMax<T extends string>(map: { [name in T]: number[] }): { [name in T]?: number } {
  const _map = deepClone(map);
  const res = {} as { [name in T]?: number };
  const readMax = () => {
    Object.keys(_map).forEach((key) => {
      const maxIndex = findMaxIndex(_map[key as T]);
      const max = _map[key as T][maxIndex];
      let isMax = true;
      // console.log(key, maxIndex, max);
      Object.keys(_map).forEach((k) => {
        // console.log(key, maxIndex, max, k, _map[k as T][maxIndex]);
        if (key !== k && _map[k as T][maxIndex] > max) isMax = false;
      });
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (isMax) {
        res[key as T] = maxIndex;
        Object.keys(_map).forEach((k) => {
          if (key !== k) _map[k as T][maxIndex] = 0;
        });
        delete _map[key as T];
      }
    });
    // console.log('readMax', {...res});
  };
  readMax();
  readMax();
  readMax();
  return res;
}

function findMaxIndex(arr: number[]): number {
  return arr.indexOf(Math.max(...arr));
}
