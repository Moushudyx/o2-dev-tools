/*
 * @Author: shuyan.yin@hand-china.com
 * @Date: 2023-06-04 15:12:05
 * @LastEditTime: 2023-06-04 15:28:00
 * @LastEditors: shuyan.yin@hand-china.com
 * @Description: file content
 * @FilePath: \o2-dev-tools\pages\Console\CodeTools\astTraverse.ts
 */
import { ParseResult } from '@babel/parser';
import traverse, { NodePath, Scope, TraverseOptions } from '@babel/traverse';
import * as _babel_types from '@babel/types';

export function getTraverse(
  ast: ParseResult<_babel_types.File>,
  opts?: TraverseOptions,
  otherOptions?: {
    scope?: Scope;
    state?: unknown;
    parentPath?: NodePath;
  }
) {
  if (otherOptions) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const { scope, state, parentPath } = otherOptions || {};
    return traverse(ast, opts, scope, state, parentPath);
  } else {
    return traverse(ast, opts);
  }
}
