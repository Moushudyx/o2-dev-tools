/*
 * @Author: shuyan.yin@hand-china.com
 * @Date: 2023-04-10 15:02:13
 * @LastEditTime: 2023-04-11 09:34:25
 * @LastEditors: shuyan.yin@hand-china.com
 * @Description: file content
 * @FilePath: \o2-dev-tools\pages\Console\PlatformApi\CopyList.tsx
 */
import React from 'react';
import { Para } from 'Components/Typo';
import { copy } from 'Utils/utils';
import styles from './index.mod.scss';

const copyList = [
  {
    text: '引入 platformUrlFactory',
    title: '从 o2Utils/o2Utils 引入 platformUrlFactory',
    code: `import { platformUrlFactory } from 'o2Utils/o2Utils';`,
  },
  {
    text: '调用 platformUrlFactory 生成 getPlatformUrl',
    title: 'platformUrlFactory("") 生成一个 getPlatformUrl 方法在页面范围通用',
    code: `const getPlatformUrl = platformUrlFactory(/* 接口路径前缀 */)`,
  },
  {
    text: '调用 getPlatformUrl',
    title: 'getPlatformUrl("接口路径") 这个路径不需要以“/”开头',
    code: `getPlatformUrl(/* 接口路径中“租户ID/”后面的部分 */)`,
  },
  {
    text: '引入 isTenantRoleLevel',
    title: '从 o2Utils/o2Utils 引入 isTenantRoleLevel',
    code: `import { isTenantRoleLevel } from 'utils/utils';`,
  },
];
export const CopyList = copyList.map(({ text, title, code }) => (
  <Para key={code} className={styles['copy-list-item']} onClick={() => copy(code)} title={title}>
    📋复制代码：{text}
  </Para>
));
