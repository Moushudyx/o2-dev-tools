/*
 * @Author: moushu
 * @Date: 2023-05-31 16:53:49
 * @LastEditTime: 2023-05-31 18:21:47
 * @Description: file content
 * @FilePath: \o2-dev-tools\pages\Console\VersionCompare\utils.ts
 */

export type CompareResult = {
  add: Record<string, string>;
  remove: Record<string, string>;
  change: Record<string, [string, string]>;
};

// 比对依赖版本
export function depCompare(obj1: Record<string, string>, obj2: Record<string, string>) {
  const add: Record<string, string> = {},
    remove: Record<string, string> = {},
    change: Record<string, [string, string]> = {};
  for (const key in obj1) {
    if (!(key in obj2)) remove[key] = obj1[key];
    else if (obj1[key] !== obj2[key]) change[key] = [obj1[key], obj2[key]];
  }
  for (const key in obj2) {
    if (!(key in obj1)) add[key] = obj2[key];
  }
  // console.log({ add, remove, change })
  return { add, remove, change };
}
