/*
 * @LastEditTime: 2023-11-06 10:11:38
 * @Description: 路由配置文件
 */

import React from 'react';
import { type NavigateOptions } from 'react-router-dom';
import { Outlet } from 'react-router';

export type MenuItemSetting = {
  name: string;
  link?: string;
  options?: NavigateOptions;
  children?: MenuItemSetting[];
};

export const menus: MenuItemSetting[] = [
  { name: '主页', link: '/' },
  // { name: '主页', link: '/', children: [
  //   {name: '关于', link: '/about'}
  // ] },
  {
    name: '通用',
    children: [
      { name: '比对 package.json', link: '/version-compare' },
      { name: '变量名格式转换', link: '/code-case' },
      { name: '模板生成代码(开发中)', link: '/template-code' },
    ],
  },
  {
    name: '中台',
    children: [
      { name: '页面字段生成工具', link: '/create-o2-field' },
      { name: 'BBC 改造工具', link: '/platform-api' },
      // { name: '代码处理工具(开发中)', link: '/code-tools' },
    ],
  },
  {
    name: '商城',
    children: [{ name: 'IconFont 转换工具', link: '/icon-font-tool' }],
  },
  {
    name: 'Link 电脑端',
    children: [{ name: '页面字段生成工具', link: '/link-create-field' }],
  },
  {
    name: 'Link 移动端(开发中)',
    children: [
      // { name: '页面字段生成工具', link: '/link-create-field' }
    ],
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
        path: '/about',
        component: () => import('Pages/About'),
      },
      // 通用
      {
        path: '/version-compare',
        component: () => import('Pages/General/VersionCompare'),
      },
      {
        path: '/code-case',
        component: () => import('Pages/General/CodeCase'),
      },
      {
        path: '/template-code',
        component: () => import('Pages/Console/TemplateCode'),
      },
      // 中台
      {
        path: '/create-o2-field',
        component: () => import('Pages/Console/CreateO2Field'),
      },
      // {
      //   path: '/create-o2-col',
      //   component: () => import('Pages/Console/CreateO2Col'),
      // },
      {
        path: '/platform-api',
        component: () => import('Pages/Console/PlatformApi'),
      },
      {
        path: '/code-tools',
        component: () => import('Pages/Console/CodeTools'),
      },
      // 商城
      {
        path: '/icon-font-tool',
        component: () => import('Pages/IconFont'),
      },
      // link
      {
        path: '/link-create-field',
        component: () => import('Pages/Link/CreateLinkField'),
      },
    ],
  },
];

export const fallback = {
  loading: <>...</>,
  component: (() => <Outlet />) as React.FC,
};
