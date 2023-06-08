/*
 * @Author: shuyan.yin@hand-china.com
 * @Date: 2023-06-04 15:31:48
 * @LastEditTime: 2023-06-05 16:48:25
 * @LastEditors: shuyan.yin@hand-china.com
 * @Description: file content
 * @FilePath: \o2-dev-tools\pages\Console\CodeTools\settings\consoleIntl.ts
 */

import { Visitor } from '@babel/traverse';
import { isCallExpression, isIdentifier, isMemberExpression } from '@babel/types';
import {
  convertIntlInfo,
  isIntlCodeArg,
  isSingleStringArg,
  solveFormatterCollectionsArgs,
} from './consoleIntlUtils';
import { getConstString } from './visitor';
import { deepClonePlus } from 'salt-lib';
// 需要匹配的项
// formatterCollections({ code: '' })
// formatterCollections({ code: [''] })
// intl('').d('')
// intl('', {}).d('')
// intl.get('').d('')
// intl.get('', {}).d('')
const defaultData = {
  intlPrefix: [] as string[],
  intlData: [] as {
    code: string;
    d: string;
    template?: [string, string][];
    start: number;
    end: number;
  }[],
};

export function getConsoleIntl(data?: {
  intlPrefix?: string[];
  intlData?: {
    code: string;
    d: string;
    template?: [string, string][];
    start: number;
    end: number;
  }[];
}): Visitor {
  const d = { ...defaultData, ...data };
  const state = {} as Record<string, boolean | number | string>;
  const visitVariableDeclarator = getConstString(state);
  return {
    VariableDeclarator(options) {
      visitVariableDeclarator(options);
    },
    // @formatterCollections 格式的 目前合并入 CallExpression 中
    // Decorator(options) {
    //   const { node } = options;
    //   const { expression } = node;
    //   // console.log('发现装饰器，AST:', node);
    //   // 必须是带调用参数的装饰器 @XXX(XXX)
    //   if (!isCallExpression(expression)) return;
    //   const { callee, arguments: args } = expression;
    //   if (!isIdentifier(callee)) return;
    //   // 必须是 @formatterCollections(XXX)
    //   if (callee.name !== 'formatterCollections') return;
    //   solveFormatterCollectionsArgs(args);
    //   console.log([...d.intlPrefix]);
    // },
    CallExpression(options) {
      const { node } = options;
      const { callee, arguments: args } = node;
      if (isIdentifier(callee)) {
        if (callee.name === 'formatterCollections') {
          // 匹配形如 formatterCollections({ code: xxx }) 格式的
          solveFormatterCollectionsArgs(args, d, state);
          console.log(deepClonePlus({d,state}))
        }
      } else if (isMemberExpression(callee) && isSingleStringArg(args)) {
        // 最终目标：
        // 匹配 intl.get('').d('') 或 intl.get('', {}).d('')
        // 匹配 intl('').d('') 或 intl('', {}).d('')
        // ----------------------------------------------------------------------------------------------------
        // 匹配形如 XXX.XXX('') 格式的
        const { property, object } = callee;
        if (
          // 形如 XXX.d('')
          isIdentifier(property) &&
          property.name === 'd' &&
          // 形如 XXX().d('')
          isCallExpression(object) &&
          isMemberExpression(object.callee) &&
          // 形如 XXX.get().d('')
          isIdentifier(object.callee.property) &&
          object.callee.property.name === 'get'
        ) {
          const {
            arguments: getArg,
            callee: { object: getObject },
          } = object;
          // 形如 intl.get('').d('') 或 intl.get('', {}).d('')
          if (isIntlCodeArg(getArg) && isIdentifier(getObject) && getObject.name === 'intl') {
            console.log(getArg, args);
            const info = convertIntlInfo(getArg, args, state);
            console.log(info);
            d.intlData.push({ ...info, start: node.start || 0, end: node.end || 0 });
          }
          // console.log(object);
        }
        // ----------------------------------------------------------------------------------------------------
        // 匹配形如 intl('').d('') 或 intl('', {}).d('')
        // 不匹配了，hzero.common 开头的写法匹配它干嘛
        // if () {}
        console.log(deepClonePlus({d,state}))
      }
    },
  };
}
