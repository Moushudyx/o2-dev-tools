/*
 * @Author: shuyan.yin@hand-china.com
 * @Date: 2023-06-07 15:30:34
 * @LastEditTime: 2023-10-27 11:19:17
 * @LastEditors: shuyan.yin@hand-china.com
 * @Description: file content
 * @FilePath: \o2-dev-tools\pages\Console\CreateO2Field\column.ts
 */
import { caseConvert, splitVar } from 'Pages/General/CodeCase/utils';
import { LinkFieldProp, indent, padLeft } from './utils';

const columnType: { [type: string]: string } = {
  text: 'O2ColumnInput',
  number: 'O2ColumnInputNumber',
  lovView: 'O2ColumnLovView',
  lov: 'O2ColumnLov',
  switch: 'O2ColumnSwitch',
  select: 'O2ColumnSelect',
  datetime: 'O2ColumnDatePicker',
  time: 'O2ColumnDatePicker',
  address: 'O2ColumnAddress',
  image: 'O2ColumnImage',
  none: 'O2Column',
};
function getExtraData(option: LinkFieldProp): string {
  const { type, code } = option;
  switch (type) {
    case 'lovView':
      return ` showKey="${code || '填写值集视图的展示字段'}" map={填写值集视图的字段Map}`;
    case 'address':
      return ` region city district valueField="${
        code || 'FIXME缺少字段编码'
      }" parentValue="父级字段编码"`;
    default:
      return '';
  }
}
/** 生成单个列组件的代码 */
export function renderLinkColumn(
  option: LinkFieldProp,
  pageInfo: {
    pageCode: string;
    pageService: string;
    pageName: string;
    pageDesc: string;
    userName: string;
  }
) {
  const {pageCode, pageService} = pageInfo;
  const pageCodeCamel = caseConvert(splitVar(pageCode), 'camel');
  const langCode = `o2.${pageService.toLowerCase().replace('o2', '')}.${pageCodeCamel}.model.`;
  const { type, code, name, lov, require, disable } = option;
  const compName = columnType[type] || columnType.none;
  const basicData = ` title={intl.get('${langCode}${code || ''}').d('${name}')} field="${code || 'FIXME缺少字段编码'}"`;
  // const autoFillData = ` auto-fill="${getAutoFillData(option)}"`;
  const lovData = ['lovView', 'lov'].includes(type)
    ? ` lovCode="${lov || 'FIXME缺少值集编码'}"`
    : '';
  const extraData = getExtraData(option);
  const editData = `${require ? ' required' : ''}${disable ? ' editable={false}' : ''}`;
  return `<${compName}${basicData}${lovData}${editData}${extraData} />`;
}

export function renderLinkListPage(
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
  const pageCodeKebab = caseConvert(splitVar(pageCode), 'kebab');
  const serverCode = `${pageService.toUpperCase()}_M`;
  const langCode = `o2.${pageService.toLowerCase().replace('o2', '')}.${pageCodeCamel}`;
  return `/*
 * @Author: ${userName}
 * @Date: ${ymd} ${hms}
 * @LastEditTime: ${ymd} ${hms}
 * @LastEditors: ${userName}
 * @Description: ${pageName || ''} - ${pageDesc || '列表页'}
 * @FilePath: \\o2-console-front\\packages\\
 */
import React, { Component } from 'react';
import {
  createRenderHook,
  designO2Page,
  O2Table,
  useHttp,
  usePageOperator,
  usePageTitle,
  usePersistState,
  useTableOption,
} from 'o2-design';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import O2ButtonCollapse from 'o2Components/O2ButtonCollapse';
import { ${serverCode} } from 'o2Utils/config'; // TODO 请检查这里的服务编码
// import codeConfig from 'o2Utils/codeConfig/o2-xxx'; // TODO 请检查这里的值集/值集视图编码

// TODO 请检查这里的服务编码
const prefix = \`\${${serverCode}}\`;
const organizationId = getCurrentOrganizationId();
// TODO 请检查这里的值集/值集视图编码
// const { ${pageCodeCamel}: { CODE = 'CODE' } = {} } = codeConfig;

const Page = designO2Page(({ history }) => {
  // TODO 这里的多语言前缀由脚本自动生成，请检查
  usePageTitle(() => intl.get('${langCode}.view.title.list').d('${
    pageName || ''
  }列表'));

  usePageOperator((prev) => (
    <>
      {prev}
      <O2ButtonCollapse reverse>{getButtonRender()}</O2ButtonCollapse>
    </>
  ));

  const http = useHttp();
  const state = usePersistState(() => {
    const option = useTableOption({
      // TODO 这里的权限编码由脚本自动生成，请检查
      permission: 'o2.${pageService.toLowerCase()}.${pageCodeKebab}.ps.button',
      // TODO 这里的 URL 由脚本自动生成，请检查
      url: \`\${prefix}/v1/\${organizationId}/${pageCodeCamel}\`,
      // keyField: '${pageCodeCamel}Id', // TODO 这里的 keyField 由脚本自动生成，请检查
      // hideButton: {
      //   insert: true, // 默认新建按钮
      //   update: true, // 默认编辑按钮
      //   delete: true, // 默认删除按钮
      // },
      // buttons: [
      //   // 页面顶部的新建按钮
      //   {
      //     type: 'other',
      //     code: 'create',
      //     position: 'out',
      //     icon: 'add',
      //     color: 'primary', // default: 默认颜色; primary: 主要按钮颜色
      //     label: '新建',
      //     handler: () => {
      //       methods.handleCreate();
      //     },
      //     // disabled: () => {},
      //   },
      //   // 行上的详情按钮
      //   {
      //     type: 'other',
      //     code: 'detail',
      //     position: 'in',
      //     label: '详情',
      //     handler: (record) => {
      //       methods.handleDetail(record);
      //     },
      //     // disabled: () => {},
      //   },
      // ],
    });
    return { option };
  });

  const methods = {
    /** 跳转到新建页面 */
    handleCreate: () => {
      // TODO 这里的路由由脚本自动生成，请检查
      history.push(\`/${pageService}/${pageCodeKebab}/detail/create\`);
    },
    /** 跳转到详情页面 */
    handleDetail: (record) => {
      // TODO 这里的路由由脚本自动生成，请检查
      // TODO 这里的 keyField 由脚本自动生成，请检查
      history.push(\`/${pageService}/${pageCodeKebab}/detail/\${record.${pageCodeCamel}Id}\`);
    },
  };

  const { render: getButtonRender, use: usePageButton } = createRenderHook();
  // useXXXButton({ usePageButton, state, methods });

  return () => (
    <>
      <O2Table option={state.option}>
${indent(options.map((option) => renderLinkColumn(option, pageInfo)).join('\n'), 8)}
      </O2Table>
    </>
  );
});
// TODO 这里的多语言前缀由脚本自动生成，请检查
@formatterCollections({ code: ['${langCode}'] })
export default class extends Component {
  render() {
    return <Page {...this.props} />;
  }
}
`;
}
