/*
 * @Author: shuyan.yin@hand-china.com
 * @Date: 2023-06-01 13:58:11
 * @LastEditTime: 2023-06-04 22:08:35
 * @LastEditors: shuyan.yin@hand-china.com
 * @Description: file content
 * @FilePath: \o2-dev-tools\pages\Console\CodeTools\utils.ts
 */
import { useRef, useState } from 'react';
import { defer, isRegExp, isString } from 'salt-lib';

export function useForceUpdate() {
  const [, setState] = useState(0);
  const updateRef = useRef(() => {
    /* */
  });
  updateRef.current = () => setState(() => Date.now());
  return () => updateRef.current(); // 永远可以获取正确的刷新函数
}

export function isFileSystemAccess() {
  return 'showDirectoryPicker' in window && 'showOpenFilePicker' in window;
}

export async function getEntries(dirHandler: FileSystemDirectoryHandle) {
  const res: Array<FileSystemDirectoryHandle | FileSystemFileHandle> = [];
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  for await (const [, value] of dirHandler.entries()) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    res.push(value);
  }
  return res;
}

export interface ThroughDirOptions {
  excludeDir: Array<RegExp | string>;
  excludeFile: Array<RegExp | string>;
  fileRange: Array<RegExp | string>;
  readAsText: boolean;
  pathChain: string[];
}

/** 遍历文件夹，此过程不会导致界面卡死 */
export async function traverseDir(
  dirHandler: FileSystemDirectoryHandle,
  callback: (data: {
    file: File;
    handler: FileSystemHandle;
    text: string;
    fileName: string;
    path: string;
    pathChain: string[];
  }) => unknown,
  options: {
    excludeDir?: Array<RegExp | string>;
    excludeFile?: Array<RegExp | string>;
    fileRange?: Array<RegExp | string>;
    readAsText?: true;
  }
): Promise<void>;
export async function traverseDir(
  dirHandler: FileSystemDirectoryHandle,
  callback: (data: {
    file: File;
    handler: FileSystemHandle;
    text: string;
    fileName: string;
    path: string;
    pathChain: string[];
  }) => unknown,
  options: {
    excludeDir?: Array<RegExp | string>;
    excludeFile?: Array<RegExp | string>;
    fileRange?: Array<RegExp | string>;
    readAsText: false;
  }
): Promise<void>;
export async function traverseDir(
  dirHandler: FileSystemDirectoryHandle,
  callback: (data: {
    file: File;
    handler: FileSystemHandle;
    text: string;
    fileName: string;
    path: string;
    pathChain: string[];
  }) => unknown,
  options: Partial<ThroughDirOptions>
): Promise<void> {
  const { excludeDir = [], excludeFile = [], fileRange = [], readAsText = true } = options;
  return innerTraverseDir(dirHandler, callback, {
    excludeDir,
    excludeFile,
    fileRange,
    readAsText,
    pathChain: [] as string[],
  });
}

async function innerTraverseDir(
  dirHandler: FileSystemDirectoryHandle,
  callback: (data: {
    file: File;
    handler: FileSystemHandle;
    text: string;
    fileName: string;
    path: string;
    pathChain: string[];
  }) => unknown,
  options: ThroughDirOptions
) {
  const { pathChain, readAsText, excludeFile, excludeDir, fileRange } = options;
  pathChain.push(dirHandler.name);
  const _entries = await getEntries(dirHandler);
  const fileEntries = _entries.filter(
    (handler) => handler.kind === 'file'
  ) as FileSystemFileHandle[];
  const dirEntries = _entries.filter(
    (handler) => handler.kind === 'directory'
  ) as FileSystemDirectoryHandle[];
  for (const handler of fileEntries) {
    const { name } = handler;
    if (isExclude(name, excludeFile) || !isInFileRange(name, fileRange)) continue;
    const file = await handler.getFile();
    await callback({
      file,
      handler,
      text: readAsText ? await readAsTxt(file) : '',
      fileName: name,
      path: `${pathChain.join('/')}/${name}`,
      pathChain: [...pathChain],
    });
  }
  for (const handler of dirEntries) {
    const { name } = handler;
    if (isExclude(name, excludeDir)) continue;
    await innerTraverseDir(handler, callback, {
      ...options,
      pathChain: [...pathChain, handler.name],
    });
  }
}

function isExclude(name: string, rules: Array<RegExp | string>) {
  for (const rule of rules) {
    if (isString(rule)) {
      if (rule === name) return true;
    } else if (isRegExp(rule)) {
      if (rule.test(name)) return true;
    }
  }
  return false;
}

function isInFileRange(name: string, rules: Array<RegExp | string>) {
  for (const rule of rules) {
    if (isString(rule)) {
      if (name.toLowerCase().endsWith(rule.toLowerCase())) return true;
    } else if (isRegExp(rule)) {
      if (rule.test(name)) return true;
    }
  }
  return false;
}

function readAsTxt(file: File) {
  const dfd = defer<string>();
  const reader = new FileReader();
  reader.readAsText(file);
  reader.onload = function () {
    dfd.resolve(reader.result as string);
  };
  reader.onerror = function () {
    dfd.reject();
  };
  return dfd.promise;
}
// export interface
