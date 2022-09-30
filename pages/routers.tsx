/*
 * @LastEditTime: 2022-09-30 15:06:16
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
        path: '/create-o2-col',
        component: () => import('Pages/CreateO2Col')
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
