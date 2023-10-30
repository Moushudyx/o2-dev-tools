import { caseConvert, splitVar } from "Pages/General/CodeCase/utils";
import { renderLinkFormItem } from "./form";
import { LinkFieldProp, indent, padLeft } from "./utils";

/*
 * @Author: shuyan.yin@hand-china.com
 * @Date: 2023-10-27 11:14:26
 * @LastEditTime: 2023-10-30 11:03:36
 * @LastEditors: shuyan.yin@hand-china.com
 * @Description: file content
 * @FilePath: \o2-dev-tools\pages\Console\CreateO2Field\collapse.ts
 */
export function renderFormCollapsePage(
  options: LinkFieldProp[],
  pageInfo: {
    pageCode: string;
    pageService: string;
    pageName: string;
    pageDesc: string;
    userName: string;
  }
) {
  const { pageCode, pageService, pageName, pageDesc, userName } = pageInfo;
  const time = new Date();
  const pad2 = (str: number | string) => padLeft(`${str}`, 2, '0');
  const ymd = `${time.getFullYear()}-${pad2(time.getMonth() + 1)}-${pad2(time.getDate())}`;
  const hms = `${pad2(time.getHours())}:${pad2(time.getMinutes())}:${pad2(time.getSeconds())}`;
  const pageCodeCamel = caseConvert(splitVar(pageCode), 'camel');
  // const pageCodePascal = caseConvert(splitVar(pageCode), 'pascal');
  // const pageCodeKebab = caseConvert(splitVar(pageCode), 'kebab');
  const serverCode = `${pageService.toUpperCase()}_M`;
  const langCode = `o2.${pageService.toLowerCase().replace('o2', '')}.${pageCodeCamel}`;
  return `/*
 * @Author: ${userName}
 * @Date: ${ymd} ${hms}
 * @LastEditTime: ${ymd} ${hms}
 * @LastEditors: ${userName}
 * @Description: ${pageName || ''} - ${pageDesc || '基本信息'}
 * @FilePath: \\o2-console-front\\packages\\
 */
import React from 'react';
import { O2Form, O2FormInput, O2FormLovView, O2FormSwitch } from 'o2-design';
import intl from 'utils/intl';
// import { getCurrentOrganizationId } from 'utils/utils';
// import { ${serverCode} } from 'o2Utils/config'; // TODO 请检查这里的服务编码
// import codeConfig from 'o2Utils/codeConfig/o2-xxx'; // TODO 请检查这里的值集/值集视图编码

// const prefix = \`\${${serverCode}}\`; // TODO 请检查这里的服务编码
// const organizationId = getCurrentOrganizationId();
// TODO 请检查这里的值集/值集视图编码
// const { ${pageCodeCamel}: { code = 'CODE' } = {} } = codeConfig;

export function useBaseInfo({ useCollapse, /* useAnchor, */ formOption /* , methods, state */ }) {
  // const http = useHttp();

  const key = 'baseInfo';
  // TODO 这里的多语言前缀由脚本自动生成，请检查
  const title = intl.get('${langCode}.panelTitle.baseInfo').d('基本信息');

  // useAnchor({ key, title }); // 这里可以实现页面右侧展示目录的需求
  useCollapse({
    key,
    title,
    render: () => (
      <O2Form option={formOption}>
${indent(options.map((option) => renderLinkFormItem(option, pageInfo)).join('\n'), 8)}
      </O2Form>
    ),
    // isShow: () => formOption.status !== 'insert', // 这里可以配置新建时是否展示
  });

  // return {}; // 如果想传什么东西回去就在这里写
}
`
}
