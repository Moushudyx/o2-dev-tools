/*
 * @Author: shuyan.yin@hand-china.com
 * @Date: 2023-06-07 15:30:34
 * @LastEditTime: 2023-06-08 14:17:23
 * @LastEditors: shuyan.yin@hand-china.com
 * @Description: file content
 * @FilePath: \o2-dev-tools\pages\Link\CreateLinkField\column.ts
 */
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
      return ` :option="填写PickList的Option" showKey="填写PickList的展示字段" :map="填写PickList的字段 Map"`;
    case 'address':
      return ` :types="['这里填写层级']" :map="{province:'province',city:'city',district:'district'}"`;
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
  const basicData = ` title="${name}" field="${code}"`;
  const autoFillData = ` auto-fill="${getAutoFillData(option)}"`
  const lovData = type === 'lov' ? ` lov-type="${lov || 'FIXME缺少值集编码'}"` : '';
  const editData = `${require ? ' required' : ''}${disable ? ' disabled' : ''}`;
  const extraData = getExtraData(option);
  return `<${compName}${basicData}${autoFillData}${lovData}${editData}${extraData} />`;
}

export function renderLinkListPage(options: LinkFieldProp[], pageInfo: { name: string }) {
  const { name } = pageInfo;
  const time = new Date();
  const pad2 = (str: number | string) => padLeft(`${str}`, 2, '0');
  const ymd = `${time.getFullYear()}-${pad2(time.getMonth() + 1)}-${pad2(time.getDate())}`;
  const hms = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
  return `<!--
简短的页面说明
@author 建立页面的人
@date ${ymd} ${hms}
-->
<template>
    <div class="${name}-list">
        <link-auto-table :option="autoOption">
${indent(options.map((option) => renderLinkColumn(option)).join('\n'), 12)}
        </link-auto-table>
    </div>
</template>
<script>
    export default {
        name: '${name}-list',
        data(){
            const autoOption = new AutoOption({
                context: this,
                module: '/link/${name}',

            });
            return {
                autoOption
            }
        },
        methods: {
            gotoDetail() {
                this.$nav.push('/modules/页面路径/${name}-form',params);
            }
        }
    };
</script>
<style lang="scss" scoped>
    .${name}-list {
    }
</style>`;
}
