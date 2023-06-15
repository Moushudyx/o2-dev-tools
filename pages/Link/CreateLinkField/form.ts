/*
 * @Author: shuyan.yin@hand-china.com
 * @Date: 2023-06-07 15:48:26
 * @LastEditTime: 2023-06-15 10:30:49
 * @LastEditors: shuyan.yin@hand-china.com
 * @Description: file content
 * @FilePath: \o2-dev-tools\pages\Link\CreateLinkField\form.ts
 */
import { LinkFieldProp, indent, padLeft } from './utils';

const formItemType: { [type: string]: string } = {
  text: 'link-input',
  number: 'link-input-number',
  lovView: 'link-object-input',
  lov: 'link-lov-select',
  select: 'link-select',
  datetime: 'link-datepicker',
  time: 'link-timepicker',
  address: 'link-address-input',
  none: 'link-',
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
/** 生成单个列组件的代码 */
export function renderLinkFormItem(option: LinkFieldProp) {
  const { type, code, name, lov, require, disable } = option;
  const compName = formItemType[type] || formItemType.none;
  const basicData = ` label="${name}" prop="${code || 'FIXME缺少字段编码'}"`;
  const vModel = ` v-model="formOption.data.${code || 'FIXME缺少字段编码'}"`;
  const lovData = type === 'lov' ? ` lov-type="${lov || 'FIXME缺少值集编码'}"` : '';
  const editData = `${require ? ' required' : ''}${disable ? ' disabled' : ''}`;
  const extraData = getExtraData(option);
  return `<link-form-item${basicData}>
  <${compName}${vModel}${lovData}${editData}${extraData} />
</link-form-item>`;
}

export function renderLinkFormPage(options: LinkFieldProp[], pageInfo: { name: string }) {
  const { name } = pageInfo;
  const time = new Date();
  const pad2 = (str: number | string) => padLeft(`${str}`, 2, '0');
  const ymd = `${time.getFullYear()}-${pad2(time.getMonth() + 1)}-${pad2(time.getDate())}`;
  const hms = `${pad2(time.getHours())}:${pad2(time.getMinutes())}:${pad2(time.getSeconds())}`;
  return `<!--
简短的页面说明
@author 建立页面的人
@date ${ymd} ${hms}
-->
<template>
    <div class="${name}-form">
        <link-form-panel :option="formOption">
            <template slot="header-right-readonly">
                <!-- 只读状态下的右上角按钮 -->
                <link-button label="新建" @click="formOption.doInsert" v-if="pageSecurity.addFlag === 'Y'"/>
                <link-button label="复制" @click="formOption.doCopy" v-if="pageSecurity.addFlag === 'Y'" :disabled="!formOption.data.id"/>
                <link-button label="编辑" @click="formOption.doUpdate" v-if="pageSecurity.editFlag === 'Y'" :disabled="!formOption.data.id"/>
                <link-button label="返回" type="line" @click="$nav.back()"/>
            </template>
            <template slot="header-right-editing">
                <!-- 编辑状态下的右上角按钮 -->
                <link-button label="取消" type="line" @click="formOption.closeEdit"/>
                <link-button label="保存" @click="formOption.save"/>
            </template>
            <link-form-grid>
                <lnk-panelfolder title="基础信息">
${indent(options.map((option) => renderLinkFormItem(option)).join('\n'), 20)}
                </lnk-panelfolder>
                <lnk-panelfolder title="XX信息">
                </lnk-panelfolder>
            </link-form-grid>
        </link-form-panel>

        <lnk-form-card>
            <link-tabs>
                <!-- 标签页，有的详情页不需要这个 -->
                <link-tab title="标签页1"><!-- 标签页1内容 --></link-tab>
                <link-tab title="标签页2"><!-- 标签页2内容 --></link-tab>
            </link-tabs>
        </lnk-form-card>
    </div>
</template>
<script>
    export default {
        name: '${name}-form',
        data(){
            const formOption = new LinkFormPanelOption({
                context: this,
                id: this.pageParam.id,
                title: '表单模板',
                module: '/link/${name}',
                data: {}
            });

            return {formOption};
        },
        methods: {},
        mounted() {
            // 根据列表传参 做对应的状态切换
            const {mode, id} = this.pageParam;
            if (mode === 'new') {
                this.formOption.doInsert();
            } else if (mode === 'copy') {
                this.formOption.doCopy(id);
            } else if (mode ==='update') {
                this.formOption.doUpdate(id);
            } else {
                this.formOption.id = id;
            }
        }
    };
</script>
<style lang="scss">
    // .${name}-form {
    // }
</style>\n`;
}
