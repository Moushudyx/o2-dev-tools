/*
 * @Author: shuyan.yin@hand-china.com
 * @Date: 2023-06-04 20:47:06
 * @LastEditTime: 2023-06-04 20:58:06
 * @LastEditors: shuyan.yin@hand-china.com
 * @Description: file content
 * @FilePath: \o2-dev-tools\pages\Console\CodeTools\settings\visitor.ts
 */

import { NodePath } from '@babel/traverse';
import {
  VariableDeclarator,
  isBooleanLiteral,
  isIdentifier,
  isNumericLiteral,
  isStringLiteral,
  isTemplateLiteral,
} from '@babel/types';
import { combineTemplateString } from './utils';

export function getConstString(state: Record<string, boolean | number | string>) {
  return function visitVariableDeclarator(options: NodePath<VariableDeclarator>) {
    const { node } = options;
    const { id, init } = node;
    if (!isIdentifier(id) || !init) return;
    const { name } = id;
    if (isStringLiteral(init) || isNumericLiteral(init) || isBooleanLiteral(init)) {
      state[name] = init.value;
    } else if (isTemplateLiteral(init)) {
      state[name] = combineTemplateString(init, 0, state);
    }
  };
}
