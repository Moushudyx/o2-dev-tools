/*
 * @Author: moushu
 * @Date: 2023-05-24 11:26:38
 * @LastEditTime: 2023-06-04 16:05:37
 * @Description: file content
 * @FilePath: \o2-dev-tools\pages\Console\CodeTools\index.tsx
 */
import React, { useMemo, useReducer, useState } from 'react';
import { Container, Field, Para, SubLine, SubTitle } from 'Components/Typo';

import { getEntries, isFileSystemAccess, useForceUpdate } from './utils';
import './index.scss';
import { read, write } from 'salt-lib';
import { ast } from './astGen';
import { getTraverse } from './astTraverse';
import { getConsoleIntl } from './settings/consoleIntl';

const storageKey = 'CodeTools';
const defaultValue = {
  excludeDir: read(
    `${storageKey}-excludeDir`,
    'C7N, node_modules, dist, .smock, .umi, .umi-production, @types'
  ),
  excludeFile: read(
    `${storageKey}-excludeFile`,
    'config.ts, .babelrc.js, .eslintrc.js, .smockrc.js, .hzerorc.js'
  ),
  fileRange: read(`${storageKey}-fileRange`, '.js, .ts, .jsx, .tsx, .mjs, .cjs'),
};

export default function CodeTools() {
  console.log(getTraverse(ast, getConsoleIntl()));
  const [state, dispatch] = useReducer(
    (preState: typeof defaultValue, action: Partial<typeof defaultValue>) => {
      for (const key of Object.keys(action)) {
        write(`${storageKey}-${key}`, action[key as keyof typeof defaultValue]);
      }
      return { ...preState, ...action };
    },
    { ...defaultValue }
  );
  const bindValue = (key: keyof typeof defaultValue) => ({
    value: state[key],
    onInput: (ev: { target: EventTarget | null }) => {
      const { target } = ev;
      if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return;
      dispatch({ [key]: target.value || '' });
    },
  });
  const update = useForceUpdate();
  const openFiles = useMemo(
    () => async () => {
      if (isFileSystemAccess()) {
        const handler = await window.showDirectoryPicker();
        console.log(handler, await getEntries(handler));
      } else {
        // eslint-disable-next-line no-alert
        alert('您的浏览器不支持访问文件系统功能（File System Access）');
      }
    },
    []
  );
  return (
    <div className="code-tools" style={{ display: 'flex' }}>
      <Container>
        <SubTitle>中台代码处理工具</SubTitle>
        <SubLine>
          ⚠注意：本工具需要浏览器支持
          <a
            href="https://wicg.github.io/file-system-access/"
            target="_blank"
            title="File System Access"
          >
            访问文件系统功能
          </a>
          ⚠
        </SubLine>
        本工具不会像其他工具一样缓存数据，关闭页面前请手动转移数据；
        操作数据的过程中浏览器可能弹出提示要求权限，如文件夹访问权限、文件读取与写入权限等
        <Para>
          <button
            onClick={() => {
              void openFiles();
            }}
          >
            打开文件夹
          </button>
          <Field>
            <label></label>
          </Field>
          <Field style={{ width: '50%', display: 'inline-flex', padding: '0 4px' }}>
            <label>排除文件夹</label>
            <input style={{ width: '100%' }} {...bindValue('excludeDir')}></input>
          </Field>
          <Field style={{ width: '50%', display: 'inline-flex', padding: '0 4px' }}>
            <label>排除文件</label>
            <input style={{ width: '100%' }} {...bindValue('excludeFile')}></input>
          </Field>
          <Field style={{ width: '50%', display: 'inline-flex', padding: '0 4px' }}>
            <label>文件范围</label>
            <input style={{ width: '100%' }} {...bindValue('fileRange')}></input>
          </Field>
        </Para>
      </Container>
      <div className="file-list">
        <SubLine>文件夹</SubLine>
      </div>
    </div>
  );
}
