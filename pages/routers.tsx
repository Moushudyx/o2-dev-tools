/*
 * @LastEditTime: 2023-04-07 14:17:27
 * @Description: 路由配置文件
 */

import React from 'react';
import { type NavigateOptions } from 'react-router-dom';
import { Outlet } from 'react-router';

export type MenuItemSetting = { name: string; link: string; options?: NavigateOptions };

export const menus: MenuItemSetting[] = [
  { name: '主页', link: '/' },
  { name: '中台-表格列代码生成器', link: '/create-o2-col' },
  { name: '中台-平台层改造辅助工具', link: '/platform-api' },
  { name: '商城-IconFont 转换工具', link: '/icon-font-tool' },
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
        component: () => import('Pages/Console/CreateO2Col')
      },
      {
        path: '/platform-api',
        component: () => import('Pages/Console/PlatformApi')
      },
      {
        path: '/icon-font-tool',
        component: () => import('Pages/IconFont')
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
