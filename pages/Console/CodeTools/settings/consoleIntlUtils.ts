/*
 * @Author: moushu
 * @Date: 2023-06-04 16:58:58
 * @LastEditTime: 2023-06-06 09:37:16
 * @Description: 中台 intl 对象处理工具
 * @FilePath: \o2-dev-tools\pages\Console\CodeTools\settings\consoleIntlUtils.ts
 */
import {
  ArgumentPlaceholder,
  Expression,
  JSXNamespacedName,
  ObjectExpression,
  SpreadElement,
  StringLiteral,
  TemplateLiteral,
  isArrayExpression,
  isIdentifier,
  isObjectExpression,
  isObjectProperty,
  isStringLiteral,
  isTemplateLiteral,
} from '@babel/types';
import { combineTemplateString } from './utils';

/** 读取`formatterCollections`的参数 */
export function solveFormatterCollectionsArgs(
  args: (ArgumentPlaceholder | Expression | JSXNamespacedName | SpreadElement)[],
  d: { intlPrefix: string[] },
  state: Record<string, boolean | string | number>
) {
  args.forEach((arg) => {
    // 参数必须是对象，对应格式 @formatterCollections({XXX})
    if (!isObjectExpression(arg)) return;
    // 获取对象属性 @formatterCollections({ XXX: XXX })
    arg.properties.forEach((prop) => {
      if (!isObjectProperty(prop)) return;
      const { key, value } = prop;
      // { code: XXX }
      if (!isIdentifier(key) || key.name !== 'code') return;
      const record = function (v: typeof value) {
        if (isStringLiteral(v)) {
          // 单个多语言前缀 { code: 'XXX' }
          d.intlPrefix.push(v.value);
        } else if (isTemplateLiteral(v)) {
          d.intlPrefix.push(combineTemplateString(v, 0, state));
        } else {
          // eslint-disable-next-line no-console
          console.log('无法辨认的多语言前缀，AST:\n', v);
        }
      };
      if (isArrayExpression(value)) {
        // 数组格式的多语言前缀 { code: ['XXX'] }
        value.elements.forEach((el) => {
          record(el as typeof value);
        });
      } else {
        record(value);
      }
    });
  });
}
/** 匹配参数类型为 ('字符串') 或 (\`字符串\`) */
export function isSingleStringArg(
  args: (ArgumentPlaceholder | Expression | JSXNamespacedName | SpreadElement)[]
): args is [StringLiteral | TemplateLiteral] {
  return args.length === 1 && (isStringLiteral(args[0]) || isTemplateLiteral(args[0]));
}
/** 匹配参数类型为 ('字符串') 或 ('字符串', {}) */
export function isIntlCodeArg(
  args: (ArgumentPlaceholder | Expression | JSXNamespacedName | SpreadElement)[]
): args is [StringLiteral | TemplateLiteral, ObjectExpression] | [StringLiteral | TemplateLiteral] {
  return (
    (isStringLiteral(args[0]) || isTemplateLiteral(args[0])) &&
    (args.length === 1 || (args.length === 2 && isObjectExpression(args[1])))
  );
}
/** 根据 AST 获取多语言信息 */
export function convertIntlInfo(
  getArg: [StringLiteral | TemplateLiteral, ObjectExpression] | [StringLiteral | TemplateLiteral],
  dArg: [StringLiteral | TemplateLiteral],
  state: Record<string, boolean | number | string>
): { code: string; d: string; template?: [string, string][] } {
  const res = {} as { code: string; d: string; template?: [string, string][] };
  const [codeAst, objAst] = getArg;
  const [def] = dArg;
  // .get('')
  if (isStringLiteral(codeAst)) {
    res.code = codeAst.value;
  } else if (isTemplateLiteral(codeAst)) {
    res.code = combineTemplateString(codeAst, 0, state);
  }
  // .get('', {})
  if (objAst) {
    // TODO 没想好怎么处理
  }
  // .d('')
  if (isStringLiteral(def)) {
    res.d = def.value;
  } else if (isTemplateLiteral(def)) {
    res.d = combineTemplateString(def, 1, state);
  }

  return res;
}

/** 多语言编码是否可用 */
export function isValidIntlCode(code: string) {
  return /^[a-z0-9.\-_]+$/i.test(code);
}
