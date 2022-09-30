/*
 * @Author: MouShu
 * @Date: 2022-01-04 15:45:29
 * @LastEditTime: 2022-03-29 10:43:42
 * @Description: 提供简单的 localStorage 封装
 */

import { isNull, isUndefined } from './typeGuard';

function parse<T>(str: string | null): T | null {
  if (str) {
    try {
      return JSON.parse(str) as T | null;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(`解析失败！请检查 localStorage 中的这个值：
%c${str}`, 'color: #fff; background: #222; font-size: 16px;border: 1px solid #ccc; border-radius: 4px; padding: 2px 4px;')
    }
  }
  return null;
}

/**
 * 从 LocalStorage 读取数据，如果数据不存在，则返回默认值，并自动写入
 * @param key 储存数据的键
 * @param defaultValue 默认值（必填）
 */
function read<T>(key: string, defaultValue: T): T {
  // if (!localStorage) throw new Error('"localStorage" is required');
  const storage = localStorage.getItem(key);
  if (!storage) {
    write(key, defaultValue);
    return defaultValue;
  }
  return parse(storage)!;
}

/**
 * **不安全的读取方法**：用户或浏览器随时可能清除本地数据！
 *
 * 从 LocalStorage 读取数据，如果数据不存在，则返回 null
 * @param key 储存数据的键
 */
function unsafeRead<T>(key: string): T | null {
  // if (!localStorage) throw new Error('"localStorage" is required');
  const storage = localStorage.getItem(key);
  return parse(storage);
}

/**
 * 向 LocalStorage 保存数据
 * @param key 储存数据的键
 * @param value 要储存的值
 */
function write<T>(key: string, value: T): void {
  // if (!localStorage) throw new Error('"localStorage" is required');
  localStorage.setItem(key, JSON.stringify(value));
}

/**
 * 从 LocalStorage 删除数据
 * @param key 储存数据的键
 */
function remove(key: string): void {
  // if (!localStorage) throw new Error('"localStorage" is required');
  localStorage.removeItem(key);
}

/**
 * **危险操作**：清空 LocalStorage
 * @param confirm 请确认你是否真的要清空 LocalStorage，仅输入 true 时会执行操作
 */
function unsafeClear(confirm: unknown): void {
  if (confirm === true) localStorage.clear();
}

/**
 * 监听 localStorage 更改事件，可以用于同一网站不同页面间通信
 * @param listener 回调函数
 * @returns 返回一个方法，调用后停止监听
 */
function listen(
  listener: (this: Window, ev: StorageEvent) => unknown,
  options: AddEventListenerOptions | boolean | undefined = { passive: true }
): () => void {
  window.addEventListener('storage', listener, options);
  return () => window.removeEventListener('storage', listener, options);
}

interface EncapsulatedStorageEvent<T> {
  /** 键名 */
  readonly key: string;
  /** 新值 */
  readonly newValue: T | null;
  /** 旧值 */
  readonly oldValue: T | null;
  /** 受影响的 Storage 对象 */
  readonly storageArea: Storage | null;
  /** 修改储存的页面的 URL */
  readonly url: string;
}
/**
 * 读取某个键值并监听
 * @param props 储存键和监听器必填，默认值不必填
 * - `key` 储存数据的键
 * - `defaultValue` 默认值（不必填）
 * - `listener` 回调函数
 * - `callOnChange` 仅在新旧值不同的时候执行回调（不必填，默认为 true）
 * @returns 返回一个元组`[value, off]`
 * - `value` 读取的值
 * - `off` 调用后停止监听
 */
function readAndListen<T>(props: {
  key: string;
  defaultValue: T;
  listener: (ev: EncapsulatedStorageEvent<T>) => unknown;
  callOnChange?: boolean | undefined;
  options?: AddEventListenerOptions | boolean | undefined;
}): [T, () => void];
function readAndListen<T>(props: {
  key: string;
  defaultValue?: undefined;
  listener: (ev: EncapsulatedStorageEvent<T>) => unknown;
  callOnChange?: boolean | undefined;
  options?: AddEventListenerOptions | boolean | undefined;
}): [T | null, () => void];
function readAndListen<T>(props: {
  key: string;
  defaultValue?: T | undefined;
  listener: (ev: EncapsulatedStorageEvent<T>) => unknown;
  callOnChange?: boolean | undefined;
  options?: AddEventListenerOptions | boolean | undefined;
}): [T | null, () => void] {
  const { key, defaultValue, listener, callOnChange = true, options = { passive: true } } = props;

  let v = unsafeRead<T>(key);
  if (!isUndefined(defaultValue) && isNull(v)) {
    write(key, defaultValue);
    v = defaultValue;
  }

  const fn = (ev: StorageEvent) => {
    if (ev.key !== key || ev.storageArea !== localStorage) return;
    const newValue = parse<T>(ev.newValue);
    const oldValue = parse<T>(ev.oldValue);
    if (callOnChange && newValue === oldValue) return;
    const encapsulatedEvent = {
      key,
      newValue,
      oldValue,
      storageArea: ev.storageArea,
      url: ev.url,
    };
    listener(encapsulatedEvent);
  };
  const off = listen(fn, options);
  return [v, off];
}

export { read, unsafeRead, write, remove, unsafeClear, listen, readAndListen };
