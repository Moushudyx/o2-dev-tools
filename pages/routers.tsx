/*
 * @LastEditTime: 2022-03-17 15:22:10
 * @Description: 路由配置文件
 */

import React from 'react';
import { Outlet } from 'react-router';

const routers: MsRouteObject[] = [
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
    ],
  },
];

const fallback = {
  loading: <>...</>,
  component: (() => <Outlet />) as React.FC,
};

export { routers, fallback };
