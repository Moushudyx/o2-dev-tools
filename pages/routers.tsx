/*
 * @LastEditTime: 2023-06-08 15:47:01
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
      // { name: '表格列代码生成器', link: '/create-o2-col' },
      { name: 'BBC 改造工具', link: '/platform-api' },
      { name: '比对 package.json', link: '/version-compare' },
      { name: '模板生成代码(开发中)', link: '/template-code' },
      { name: '代码处理工具(开发中)', link: '/code-tools' },
    ],
  },
  {
    name: '商城',
    isGroup: true,
    children: [{ name: 'IconFont 转换工具', link: '/icon-font-tool' }],
  },
  {
    name: 'Link 中台(开发中)',
    isGroup: true,
    children: [{ name: '页面字段生成工具', link: '/link-create-field' }],
  },
  // { name: '关于', link: '/about' },
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
        path: '/template-code',
        component: () => import('Pages/Console/TemplateCode'),
      },
      {
        path: '/platform-api',
        component: () => import('Pages/Console/PlatformApi'),
      },
      {
        path: '/code-tools',
        component: () => import('Pages/Console/CodeTools'),
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
        path: '/link-create-field',
        component: () => import('Pages/Link/CreateLinkField'),
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
