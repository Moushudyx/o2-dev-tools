/*
 * @Author: MouShu
 * @Date: 2022-01-15 13:56:38
 * @LastEditTime: 2022-03-10 15:33:42
 * @Description: 简单的类型守卫
 */
/** 断言为字符串，这个方法不认 String 对象 */
const isString = (a: unknown): a is string => typeof a === 'string';
/** 断言为数字，这个方法不认 Number 对象 */
const isNumber = (a: unknown): a is number => typeof a === 'number';
/** 断言为布尔型，这个方法不认 Boolean 对象 */
const isBoolean = (a: unknown): a is boolean => typeof a === 'boolean';
/** 断言为大整数 */
const isBigint = (a: unknown): a is bigint => typeof a === 'bigint';
/** 断言为 symbol */
const isSymbol = (a: unknown): a is symbol => typeof a === 'symbol';
/** 断言为 null */
const isNull = (a: unknown): a is null => a === null;
/** 断言为 undefined，这个方法不会将`document.all`视为 undefined */
const isUndefined = (a: unknown): a is undefined => a === void 0;
/** 断言为空值，即 null、undefined */
const isNullish = (a: unknown): a is null | undefined => a === null || a === void 0;
/** 断言为对象，这个方法不会将`null`视为对象 */
const isObject = (a: unknown): a is object => !!a && typeof a === 'object';
/** 断言为数组 */
const { isArray } = Array;

export {
  isString,
  isNumber,
  isBoolean,
  isBigint,
  isNull,
  isUndefined,
  isNullish,
  isSymbol,
  isObject,
  isArray,
};
