/*
 * @LastEditTime: 2022-03-17 15:22:35
 * @Description: 根节点
 */
import React from 'react';
import { type RouteObject, useRoutes } from 'react-router-dom';
import { routers, fallback } from 'Pages/routers';
import { isUndefined } from 'Utils/typeGuard';
import Container from 'Pages/Container';
import './App.scss';

function convert2LazyElement(
  factory: () => Promise<{ default: React.ComponentType }>
): React.ReactNode {
  const El = React.lazy(factory);
  return (
    <React.Suspense fallback={fallback.loading}>
      <El />
    </React.Suspense>
  );
}

function convertRouteObject(routeObject: MsRouteObject): RouteObject {
  const res: RouteObject = {};
  if (!isUndefined(routeObject.caseSensitive)) res.caseSensitive = routeObject.caseSensitive;
  if (!isUndefined(routeObject.index)) res.index = routeObject.index;
  if (!isUndefined(routeObject.path)) res.path = routeObject.path;
  if (!isUndefined(routeObject.component)) res.element = convert2LazyElement(routeObject.component);
  else res.element = <fallback.component />;
  if (!isUndefined(routeObject.children))
    res.children = routeObject.children.map((obj) => convertRouteObject(obj));
  return res;
}

export default () => {
  const element = useRoutes(routers.map((obj) => convertRouteObject(obj)));
  return <Container>{element}</Container>;
};
