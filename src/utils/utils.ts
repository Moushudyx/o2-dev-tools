/*
 * @LastEditTime: 2024-08-13 11:14:07
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
textarea.setAttribute('style', 'position:fixed;top:0;opacity:0;pointer-events:none;');

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

export function download(file: File) {
  const anchor = document.createElement('a');
  const objectUrl = URL.createObjectURL(file);

  anchor.href = objectUrl;
  anchor.download = file.name;
  document.body.appendChild(anchor);
  anchor.click();

  document.body.removeChild(anchor);
  URL.revokeObjectURL(objectUrl);
}
/** 防抖 */
export function debounce(fn: () => unknown, delay?: number, immediate?: boolean): () => void;
export function debounce<T>(
  fn: (...args: T[]) => unknown,
  delay?: number,
  immediate?: boolean
): (...args: T[]) => void;
export function debounce<T>(
  fn: (...args: T[]) => unknown,
  delay = 120,
  immediate = false
): (...args: T[]) => void {
  if (immediate) {
    let last = 0;
    let timeout: number | undefined;
    return function (...args: T[]) {
      const now = Date.now();
      const timeDiff = now - last;
      if (timeDiff >= delay) {
        last = now;
        clearTimeout(timeout);
        fn(...args);
      } else {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          fn(...args);
        }, timeDiff);
      }
    };
  } else {
    let timer = 0;
    return (...args: T[]) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        fn(...args);
        timer = 0;
      }, delay);
    };
  }
}

export function clamp(value: unknown, min: number, max: number) {
  if (typeof value === 'string') value = Number(value);
  if (value == null || typeof value !== 'number' || isNaN(value)) return min;
  if (value < min) return min;
  if (value > max) return max;
  return value;
}
