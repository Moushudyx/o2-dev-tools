/*
 * @LastEditTime: 2022-03-10 15:31:03
 * @Description: file content
 */
export {
  read,
  unsafeRead,
  write,
  remove,
  unsafeClear,
  listen,
  readAndListen,
} from './localStorage';
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
} from './typeGuard';
export { toggleNightMode, isNightMode, useNightMode } from './nightMode';
