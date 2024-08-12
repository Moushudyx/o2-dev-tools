/*
 * @Author: moushu
 * @Date: 2023-06-07 15:30:34
 * @LastEditTime: 2023-09-14 11:37:46
 * @Description: file content
 * @FilePath: \o2-dev-tools\pages\Link\CreateLinkField\column.ts
 */
import { caseConvert, splitVar } from 'Pages/General/CodeCase/utils';
import { LinkFieldProp, indent, padLeft } from './utils';

const columnType: { [type: string]: string } = {
  text: 'link-table-column-input',
  number: 'link-table-column-input-number',
  lovView: 'link-table-column-object',
  lov: 'link-table-column-lov',
  select: 'link-table-column-select',
  datetime: 'link-table-column-datepicker',
  time: 'link-table-column-timepicker',
  address: 'link-table-column-address',
  none: 'link-table-column',
};
function getExtraData(option: LinkFieldProp): string {
  const { type } = option;
  switch (type) {
    case 'lovView':
      return ` :option="填写PickList的Option" showKey="填写PickList的展示字段" :map="填写PickList的字段Map"`;
    case 'address':
      return ` :types="['这里填写层级']" :map="{province: 'province', city: 'city', district: 'district'}"`;
    default:
      return '';
  }
}
const autoFillReg = {
  ID: /id$/i,
  CODE: /code$/i,
  PHONE: /[座手]机|电话/i,
  IDCARD: /idCard|身份证|营业执照|银行账[号户]|社会?信用?代?码/i,
  EMAIL: /Email|邮[箱件]/i,
  URL: /URL|网络?[站址]/i,
  NAME: /姓名|\S人/i,
  COMMENTS: /备注|说明|描述|意见/i,
  LONG_TEXT: /(?:产品|客户|公司|活动)名称|发票抬头|(?:详细|收货)地址/i,
};
function getAutoFillData(option: LinkFieldProp): string {
  const { type, name } = option;
  for (const key of Object.keys(autoFillReg)) {
    if (autoFillReg[key as keyof typeof autoFillReg].test(name)) return key;
  }
  switch (type) {
    case 'number':
      return 'NUMBER';
    case 'select':
    case 'lov':
      return 'TYPE'; // 值集和下拉框视为一类
    case 'lovView':
      return 'LONG_TEXT'; // 值集视图视为长文本
    case 'address':
      return 'ADDRESS';
    case 'datetime':
      return 'DATE';
    case 'time':
      return 'TIME';
    case 'text':
    case 'none':
    default:
      return 'TEXT'; // 其他文本
  }
}
/** 生成单个列组件的代码 */
export function renderLinkColumn(option: LinkFieldProp) {
  const { type, code, name, lov, require, disable } = option;
  const compName = columnType[type] || columnType.none;
  const basicData = ` title="${name}" field="${code || 'FIXME缺少字段编码'}"`;
  const autoFillData = ` auto-fill="${getAutoFillData(option)}"`;
  const lovData = type === 'lov' ? ` lov-type="${lov || 'FIXME缺少值集编码'}"` : '';
  const editData = `${require ? ' required' : ''}${disable ? ' disabled' : ''}`;
  const extraData = getExtraData(option);
  return `<${compName}${basicData}${autoFillData}${lovData}${editData}${extraData} />`;
}

export function renderLinkListPage(
  options: LinkFieldProp[],
  pageInfo: { pageCode: string; pageName: string; pageDesc: string; userName: string }
) {
  const { pageCode, pageName, pageDesc, userName } = pageInfo;
  const time = new Date();
  const pad2 = (str: number | string) => padLeft(`${str}`, 2, '0');
  const ymd = `${time.getFullYear()}-${pad2(time.getMonth() + 1)}-${pad2(time.getDate())}`;
  const hms = `${pad2(time.getHours())}:${pad2(time.getMinutes())}:${pad2(time.getSeconds())}`;
  const pageCodeCamel = caseConvert(splitVar(pageCode), 'camel');
  const pageCodeKebab = caseConvert(splitVar(pageCode), 'kebab');
  return `<!--
${pageDesc || '简短的页面说明'}
@author ${userName || '建立页面的人'}
@date ${ymd} ${hms}
-->
<template>
    <div class="${pageCodeKebab}-list">
        <link-auto-table :option="autoOption">
${indent(options.map((option) => renderLinkColumn(option)).join('\n'), 12)}

            <!-- 行内按钮 width: [汉字数量 / 2]-button -->
            <!-- <link-table-column-operate :buttons="buttons" width="3-button" /> -->

            <!-- 表头按钮 按钮组件文档 http://dev.linkcrm.cn/frontdoc/?id=link/button&app=doc -->
            <!-- <template slot="button">
                <link-button :disabled="..." @click="..." icon="link-icon-..." color="...">
                    按钮名称
                </link-button>
            </template> -->
        </link-auto-table>
    </div>
</template>
<script>
import {globalPublicMixin} from '@/modules/common/js/mixin';

export default {
    name: '${pageCodeKebab}-list',
    mixins: [globalPublicMixin],
    data() {
        const autoOption = new AutoOption({
            context: this,
            module: '/link/${pageCodeCamel}',
            // title: '${pageName || ''}', // 会影响导出文件的名称
            // param: {}, // 默认查询条件
            // insertable: false, // 新建 按钮
            // updateable: false, // 编辑 按钮
            // deleteable: false, // 删除 按钮
            // importable: false, // 导入 按钮
            // otherable: false, // 其他 按钮
            // showMoreRowsButton: false, // 更多行数 按钮
            // showCountsButton: false, // 记录计数 按钮
            // showMoreButton: false, // 更多 **下拉框**
            // buttons: [
            //     {
            //         label: '',
            //         handler: () => /* ... */,
            //         disabled: () => /* ... */,
            //         // order: 100,
            //         inner: false
            //     }
            // ]
        });
        // const buttons = [
        //     {
        //         label: '行内按钮',
        //         disabled: ({row}) => /* ... */,
        //         onClick: ({row}) => /* ... */
        //     }
        // ];
        return {
          /** 列表 option */
          autoOption,
          // /** 行内按钮配置 */
          // buttons
        };
    },
    methods: {
        /**
         * 跳转详情页
         * @author ${userName || '建立页面的人'}
         * @date ${ymd}
         */
        showDetail(row) {
            const params = {id: row.id, mode: 'detail'}; // 若详情页要展示编码的话可以在这里传
            this.$nav.push('/modules/页面路径/${pageCodeKebab}-form.vue', params);
        },
        // /**
        //  * 跳转新建页
        //  * @author ${userName || '建立页面的人'}
        //  * @date ${ymd}
        //  */
        // createRow() {
        //     const params = {mode: 'new'};
        //     this.$nav.push('/modules/页面路径/${pageCodeKebab}-form.vue', params);
        // },
        // /**
        //  * 跳转复制页，复制此行数据
        //  * @author ${userName || '建立页面的人'}
        //  * @date ${ymd}
        //  */
        // copyRow(row) {
        //     const params = {id: row.id, mode: 'copy'};
        //     this.$nav.push('/modules/页面路径/${pageCodeKebab}-form.vue', params);
        // }
        /**
         * 回到列表页时刷新数据
         * @author ${userName || '建立页面的人'}
         * @date ${ymd}
         */
        onBack() {
            this.autoOption.load();
        }
    }
};
</script>
<style lang="scss">
// .${pageCodeKebab}-list {
// }
</style>\n`;
}
