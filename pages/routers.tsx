/*
 * @LastEditTime: 2023-05-31 18:19:49
 * @Description: 路由配置文件
 */

import React from 'react';
import { type NavigateOptions } from 'react-router-dom';
import { Outlet } from 'react-router';

export type MenuItemSetting =
  | { name: string; isGroup: true; children: MenuItemSetting[] }
  | { name: string; link: string; options?: NavigateOptions; isGroup?: false };

export const menus: MenuItemSetting[] = [
  { name: '主页', link: '/' },
  {
    name: '中台',
    isGroup: true,
    children: [
      { name: '表格列代码生成器', link: '/create-o2-col' },
      { name: 'BBC 改造工具', link: '/platform-api' },
      { name: '比对依赖版本', link: '/version-compare' },
      { name: '代码编辑工具(开发中)', link: '/intl-tools' },
    ],
  },
  {
    name: '商城',
    isGroup: true,
    children: [{ name: 'IconFont 转换工具', link: '/icon-font-tool' }],
  },
  { name: '关于', link: '/about' },
];

export const routers: MsRouteObject[] = [
  {
    path: '/',
    children: [
      {
        index: true,
        component: () => import('Pages/Index'),
      },
      {
        path: '/create-o2-col',
        component: () => import('Pages/Console/CreateO2Col'),
      },
      {
        path: '/platform-api',
        component: () => import('Pages/Console/PlatformApi'),
      },
      {
        path: '/intl-tools',
        component: () => import('Pages/Console/IntlTools'),
      },
      {
        path: '/version-compare',
        component: () => import('Pages/Console/VersionCompare'),
      },
      {
        path: '/icon-font-tool',
        component: () => import('Pages/IconFont'),
      },
      {
        path: '/about',
        component: () => import('Pages/About'),
      },
    ],
  },
];

export const fallback = {
  loading: <>...</>,
  component: (() => <Outlet />) as React.FC,
};
