/// <reference path="./globalPolyfill.d.ts" />
/*
 * @LastEditTime: 2023-06-16 11:32:32
 * @Description: file content
 */
declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
declare module '*.mod.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
declare module '*.m.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
declare module '*.text.scss' {
  const classes: string;
  export default classes;
}
declare module '*.txt.scss' {
  const classes: string;
  export default classes;
}
declare module '*.t.scss' {
  const classes: string;
  export default classes;
}
declare module '*.scss';

// declare module '*.module.css' {
//   const classes: { readonly [key: string]: string };
//   export default classes;
// }

declare module '*.css';

interface MsRouteObject {
  /** 大小写敏感 */
  caseSensitive?: boolean;
  /** 子页面 */
  children?: MsRouteObject[];
  /** 请使用 `() => import('路径');` 的方式引入，脚手架会自动添加懒加载功能 */
  component?: () => Promise<{ default: React.ComponentType }>;
  /** 默认页面 */
  index?: boolean;
  /** 路径 */
  path?: string;
}
