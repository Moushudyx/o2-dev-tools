/*
 * @Author: shuyan.yin@hand-china.com
 * @Date: 2023-10-25 17:57:00
 * @LastEditTime: 2023-10-25 18:07:15
 * @LastEditors: shuyan.yin@hand-china.com
 * @Description: file content
 * @FilePath: \o2-dev-tools\pages\Console\CreateO2Field\router.ts
 */
import { caseConvert, splitVar } from 'Pages/General/CodeCase/utils';

export function renderRouters(pageInfo: {
  pageCode: string;
  pageService: string;
  pageName: string;
  pageDesc: string;
  userName: string;
}) {
  const { pageCode, pageService, pageName } = pageInfo;
  const pageCodePascal = caseConvert(splitVar(pageCode), 'pascal');
  const pageCodeKebab = caseConvert(splitVar(pageCode), 'kebab');
  return `// ${pageName}
{
  path: "/${pageService}/${pageCodeKebab}",
  routes: [
    {
      path: "/${pageService}/${pageCodeKebab}/list",
      component: "@/routes/${pageCodePascal}/List",
    },
    {
      path: "/${pageService}/${pageCodeKebab}/detail/:id",
      component: "@/routes/${pageCodePascal}/Detail",
    },
    {
      path: "/${pageService}/${pageCodeKebab}/create",
      component: "@/routes/${pageCodePascal}/Detail",
    },
  ],
},`;
}
