/*
 * @Author: shuyan.yin@hand-china.com
 * @Date: 2023-05-31 17:37:07
 * @LastEditTime: 2023-05-31 17:37:08
 * @LastEditors: shuyan.yin@hand-china.com
 * @Description: file content
 * @FilePath: \o2-dev-tools\src\utils\sessionStorage.ts
 */
function parse<T>(str: string | null): T | null {
  if (str) {
    try {
      return JSON.parse(str) as T | null;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(`解析失败！请检查 sessionStorage 中的这个值：
%c${str}`, 'color: #fff; background: #222; font-size: 16px;border: 1px solid #ccc; border-radius: 4px; padding: 2px 4px;')
    }
  }
  return null;
}

/**
 * 从 sessionStorage 读取数据，如果数据不存在，则返回默认值，并自动写入
 * @param key 储存数据的键
 * @param defaultValue 默认值（必填）
 */
function read<T>(key: string, defaultValue: T): T {
  // if (!sessionStorage) throw new Error('"sessionStorage" is required');
  const storage = sessionStorage.getItem(key);
  if (!storage) {
    write(key, defaultValue);
    return defaultValue;
  }
  return parse(storage)!;
}

/**
 * **不安全的读取方法**：用户或浏览器随时可能清除本地数据！
 *
 * 从 sessionStorage 读取数据，如果数据不存在，则返回 null
 * @param key 储存数据的键
 */
function unsafeRead<T>(key: string): T | null {
  // if (!sessionStorage) throw new Error('"sessionStorage" is required');
  const storage = sessionStorage.getItem(key);
  return parse(storage);
}

/**
 * 向 sessionStorage 保存数据
 * @param key 储存数据的键
 * @param value 要储存的值
 */
function write<T>(key: string, value: T): void {
  // if (!sessionStorage) throw new Error('"sessionStorage" is required');
  sessionStorage.setItem(key, JSON.stringify(value));
}

/**
 * 从 sessionStorage 删除数据
 * @param key 储存数据的键
 */
function remove(key: string): void {
  // if (!sessionStorage) throw new Error('"sessionStorage" is required');
  sessionStorage.removeItem(key);
}

/**
 * **危险操作**：清空 sessionStorage
 * @param confirm 请确认你是否真的要清空 sessionStorage，仅输入 true 时会执行操作
 */
function unsafeClear(confirm: unknown): void {
  if (confirm === true) sessionStorage.clear();
}

export { read, unsafeRead, write, remove, unsafeClear };
