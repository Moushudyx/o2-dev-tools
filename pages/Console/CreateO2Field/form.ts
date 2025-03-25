/*
 * @Author: moushu
 * @Date: 2023-06-07 15:48:26
 * @LastEditTime: 2025-03-25 15:38:12
 * @Description: file content
 * @FilePath: \o2-dev-tools\pages\Console\CreateO2Field\form.ts
 */
import { caseConvert, splitVar } from 'Pages/General/CodeCase/utils';
import { LinkFieldProp, padLeft } from './utils';

const formItemType: { [type: string]: string } = {
  text: 'O2FormInput',
  number: 'O2FormInputNumber',
  currency: 'O2FormCurrency',
  lovView: 'O2FormLovView',
  lov: 'O2FormLov',
  switch: 'O2FormSwitch',
  select: 'O2FormSelect',
  datetime: 'O2FormDatePicker',
  time: 'O2FormDatePicker',
  address: 'O2FormAddress',
  image: 'O2FormImageUpload',
  upload: 'O2FormUpload',
  none: 'O2FormInput',
};
function getAddressExtraData(option: LinkFieldProp): string {
  const { name, code } = option;
  const valueField = code || 'FIXME缺少字段编码';
  const nameField = code ? `${code.replace(/code$/i, '')}Name` : 'FIXME缺少字段编码';
  const regionType = (() => {
    if (/country/i.test(code) || name.includes('国')) return 'country';
    if (/province/i.test(code) || name.includes('省')) return 'region';
    if (/district/i.test(code) || name.includes('县')) return 'district'; // 先判断县
    if (/city/i.test(code) || name.includes('市')) return 'city';
    return 'region city district';
  })();
  return `
  parentValue={formOption.formData.父级字段编码}
  v-model-name={formOption.formData.${nameField}}
  v-model-value={formOption.formData.${valueField}}
  ${regionType}`;
}
function getExtraData(option: LinkFieldProp): string {
  const { type, code } = option;
  switch (type) {
    case 'currency':
      return `\n  precision={2}`;
    case 'lovView':
      return `\n  showKey="${code || '填写值集视图的展示字段'}"\n  map={填写值集视图的字段Map}`;
    case 'address':
      return getAddressExtraData(option);
    case 'image':
      return '\n  listType="picture-card"\n  // urlPrefix={ }\n  // directory="package"';
    case 'datetime':
    case 'time':
      return `
  datetime // 展示日期+时间
  // range // 范围模式，此时 field 要写成 field={[字段1, 字段2]}
  // v-model-start={} v-model-end={} // 范围模式下数据要绑定到这两个参数上`;
    default:
      return '';
  }
}
/** 生成单个表单组件的代码 */
export function renderLinkFormItem(
  option: LinkFieldProp,
  pageInfo: {
    pageCode: string;
    pageService: string;
    pageName: string;
    pageDesc: string;
    userName: string;
  }
) {
  const { pageCode, pageService } = pageInfo;
  const pageCodeCamel = caseConvert(splitVar(pageCode), 'camel');
  const langCode = `o2.${pageService.toLowerCase().replace('o2', '')}.${pageCodeCamel}.model.`;
  const { type, code, name, lov, require, disable, hide } = option;
  const compName = formItemType[type] || formItemType.none;
  const basicData = `\n  label={intl.get('${langCode}${code || ''}').d('${name}')}\n  field="${
    code || `FIXME${name}缺少字段编码`
  }"`;
  const vModel =
    type === 'lovView'
      ? '\n  row={formOption.formData}'
      : type === 'address'
      ? ``
      : `\n  v-model={formOption.formData.${code || `FIXME${name}缺少字段编码`}}`;
  const lovData = ['lovView', 'lov'].includes(type)
    ? `\n  lovCode="${lov || `FIXME${name}缺少值集编码`}"`
    : '';
  const requireData = require ? '\n  required' : '';
  const disableData = disable ? '\n  disabled' : '';
  const extraData = getExtraData(option);
  const res = `<${compName}${basicData}${vModel}${lovData}${extraData}${requireData}${disableData}
/>`.replace(/\n\s+\n/g, '\n');
  return hide ? `{/* ${res} */}` : res;
}
/** 获取所有需要的表单组件 */
export function getFormComponents(options: LinkFieldProp[]) {
  const comps = options.map((o) => formItemType[o.type] || formItemType.none);
  comps.sort();
  return Array.from(new Set(comps));
}
export function renderBaseFormPage(pageInfo: {
  pageCode: string;
  pageService: string;
  pageName: string;
  pageDesc: string;
  userName: string;
}) {
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
 * @Description: ${pageName || ''} - ${pageDesc || '详情页'}
 * @FilePath: \\o2-console-front\\packages\\
 */
import React from 'react';
// import { Anchor, Row, Col } from 'choerodon-ui'; // 部分页面会要求在详情页右侧展示目录
import {
  designO2Page,
  // onMounted,
  // reactive,
  useFormOption,
  useHttp,
} from 'o2-design';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { ${serverCode} } from 'o2Utils/config'; // TODO 请检查这里的服务编码
import { useFormOptionSetup /* , useTabs */ } from 'o2Utils';
// import codeConfig from 'o2Utils/codeConfig/o2-xxx'; // TODO 请检查这里的值集/值集视图编码
// import { useBaseInfo } from './BaseInfo';

// TODO 请检查这里的服务编码
const prefix = \`\${${serverCode}}\`;
const organizationId = getCurrentOrganizationId();
// TODO 请检查这里的值集/值集视图编码
// const { ${pageCodeCamel}: { CODE = 'CODE' } = {} } = codeConfig;

const Page = designO2Page((props) => {
  // const searchParams = new URLSearchParams(props.location.search); // 页面路由的查询参数，一般页面用不上
  const http = useHttp();
  // useFormOptionSetup 是详情页的基本功能整合，包含这些常用功能
  // - 路由跳转：点击返回按钮跳回列表页、新建保存后跳转到对应的详情页
  // - 页面标题：详情页、新建页展示不同的页面标题
  // - 获取页面ID：自动从页面路由上读取页面ID
  // - 基本配置：将返回的 configs 直接展开给 useFormOption，完成一些繁琐的基本配置(主要是 state)
  // - 页面钩子：自动调用 useCollapses，返回的 useCollapse 和 renderCollapses 直接可以用
  const { configs, setup, useCollapse, renderCollapses } = useFormOptionSetup({
    props, // 页面参数，不懂则勿动
    // TODO 这里的路由由脚本自动生成，请检查
    listUrl: '/${pageService}/${pageCodeKebab}/list', // 列表页路由，点返回按钮跳转
    getDetailUrl: (id) => \`/${pageService}/${pageCodeKebab}/detail/\${id}\`, // 详情页路由，新建完毕后跳转
    // TODO 这里的 keyField 由脚本自动生成，请检查
    keyField: '${pageCodeCamel}Id', // 主键
    paramIdField: 'id', // 页面路由参数上的 id，根据这个设置 configs.state.status
    // TODO 这里的多语言前缀由脚本自动生成，请检查
    title: intl.get('${langCode}.title.detail').d('${pageName || ''}详情'), // 页面标题
    insertTitle: intl.get('${langCode}.title.insert').d('新建${
    pageName || ''
  }'), // 新建时的页面标题
    // defaultNewRow: {}, // 推荐写在这里，会自动带入 configs.defaultNewRow 和 configs.state.formData 中
  });

  const formOption = useFormOption({
    // defaultNewRow 和 state 推荐写在 useFormOptionSetup 中, 然后由这个 configs 带入
    ...configs,
    // TODO 这里的 keyField 由脚本自动生成，请检查
    keyField: '${pageCodeCamel}Id', // 注意 configs 不会带上 keyField
    // TODO 这里的权限编码由脚本自动生成，请检查
    permission: 'o2.${pageService.toLowerCase()}.${pageCodeKebab}.ps.detail.button',
    url: {
      // TODO 这里的 URL 由脚本自动生成，请检查
      base: \`\${prefix}/v1/\${organizationId}/${pageCodeCamel}\`,
      detail: () =>
        // TODO 这里的 URL 由脚本自动生成，请检查
        // TODO 这里的 keyField 由脚本自动生成，请检查
        \`\${prefix}/v1/\${organizationId}/${pageCodeCamel}/\${formOption.formData.${pageCodeCamel}Id}\`,
    },
    // queryParams: {},
    // deepField: true, // 如果数据结构并非单层平铺，需启用 deep 模式
    // enable: false,
    // hideButton: {},
    // buttons: [
    //   // 按钮会展示在页面顶部
    //   {
    //     type: 'other',
    //     code: 'publish',
    //     icon: 'send-o',
    //     label: intl.get('hzero.common.button.publish').d('发布'),
    //     show: () => xxx,
    //     handler: methods.handleRelease,
    //     disabled: () => formOption.editing,
    //   },
    // ],
    // hooks: {
    // },
  });
  setup(formOption);

  const methods = {
    // handleRelease() {
    //   //
    // },
  };

  // const state = reactive({});

  // 部分页面会要求在详情页右侧展示目录
  // const { use: _useAnchor, render: renderAnchor } = createHookForRender();
  // const useAnchor = ({ title, key }) =>
  //   _useAnchor(() => <Anchor.Link key={key} href={\`#\${key}\`} title={title} />);

  // useBaseInfo({ useCollapse, /* useAnchor, */ formOption, methods /* , state */ });

  // const { useTabPane, renderTabs } = useTabs();

  // useLineTab({ useTabPane, formOption, methods /* , state */ })

  return () => <>{renderCollapses()}{/* renderTabs() */}</>;
  // 部分页面会要求在详情页右侧展示目录
  // return () => (
  //   <div className="${pageCodeKebab}-detail">
  //     <Row>
  //       <Col span={21}>{renderCollapses()}{/* renderTabs() */}</Col>
  //       <Col span={2} offset={1} style={{ position: 'fixed', right: 32 }}>
  //         <Anchor
  //           getContainer={() => document.querySelector('.${pageCodeKebab}-detail').parentElement}
  //         >
  //           {renderAnchor()}
  //         </Anchor>
  //       </Col>
  //     </Row>
  //   </div>
  // );
});
// TODO 这里的多语言前缀由脚本自动生成，请检查
export default formatterCollections({ code: ['${langCode}'] })(Page);
`;
}
