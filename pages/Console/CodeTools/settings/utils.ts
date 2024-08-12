/*
 * @Author: moushu
 * @Date: 2023-06-04 20:55:17
 * @LastEditTime: 2023-06-04 20:57:01
 * @Description: file content
 * @FilePath: \o2-dev-tools\pages\Console\CodeTools\settings\utils.ts
 */

import {
  TemplateLiteral,
  isStringLiteral,
  isBooleanLiteral,
  isIdentifier,
  isNumericLiteral,
} from '@babel/types';

/**
 * 合并模板字符串
 * @param tStr 模板字符串的抽象语法树
 * @param type `0` 一般合并；`1` 用于`.d()`的模板字符串
 * @param state
 */
export function combineTemplateString(
  tStr: TemplateLiteral,
  type: 0 | 1 = 0,
  state: Record<string, boolean | number | string> = {}
) {
  const { expressions = [], quasis = [] } = tStr;
  const e = [...expressions],
    q = [...quasis];
  let res = '';
  // 看了半天类型提示只有双指针法能用
  while (e.length || q.length) {
    if (q.length && (!e.length || q[0].start! < e[0].start!)) {
      const qt = q.shift();
      if (!qt) continue;
      res += qt.value.raw;
    } else {
      const et = e.shift();
      if (!et) continue;
      if (isStringLiteral(et) || isNumericLiteral(et) || isBooleanLiteral(et)) res += `${et.value}`;
      else if (isIdentifier(et)) {
        const { name } = et;
        if (type === 1) {
          res += `{${name}}`;
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        } else if (type === 0) {
          if (name in state) res += state[name];
          else res += '';
        }
      }
    }
  }
  return res;
}
