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

// 创建 textarea 元素
const textarea = document.createElement('textarea');
// 用样式表隐藏元素
textarea.setAttribute(
  'style',
  'position:fixed;top:0;opacity:0;pointer-events:none;'
);

function checkTextarea(txt: string) {
  // 输入校验
  if (typeof txt !== 'string') txt = `${txt}`;
  textarea.value = txt;
  document.body.appendChild(textarea);
  textarea.select();
}

export function copy(txt: string) {
  checkTextarea(txt);
  const success = document.execCommand('copy');
  // 移除 textarea 不影响 DOM 结构
  textarea.remove();
  return success;
}
