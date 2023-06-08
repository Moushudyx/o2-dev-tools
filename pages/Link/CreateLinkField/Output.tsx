/*
 * @Author: shuyan.yin@hand-china.com
 * @Date: 2023-06-08 15:48:10
 * @LastEditTime: 2023-06-08 15:53:19
 * @LastEditors: shuyan.yin@hand-china.com
 * @Description: file content
 * @FilePath: \o2-dev-tools\pages\Link\CreateLinkField\Output.tsx
 */
import React, { useState } from 'react';
import { Field } from 'Components/Typo';
import { LinkFieldProp } from './utils';
import { renderLinkColumn, renderLinkListPage } from './column';
import { renderLinkFormItem, renderLinkFormPage } from './form';
import { copy } from 'Utils/utils';

export function Output(props: { pageCode: string; FieldProps: LinkFieldProp[] }) {
  const { FieldProps, pageCode } = props;
  const [output, setOutput] = useState('');
  return (
    <>
      <Field>
        <label>
          <span
            className="span-btn"
            onClick={() => {
              setOutput(
                FieldProps.filter(({ code }) => !!code)
                  .map((prop) => renderLinkColumn(prop))
                  .join('\n')
              );
            }}
          >
            📌生成表格列
          </span>
          <span
            className="span-btn"
            onClick={() => {
              setOutput(
                FieldProps.filter(({ code }) => !!code)
                  .map((prop) => renderLinkFormItem(prop))
                  .join('\n')
              );
            }}
          >
            📌生成表单字段
          </span>
          <span
            className="span-btn"
            onClick={() => {
              setOutput(
                renderLinkListPage(
                  FieldProps.filter(({ code }) => !!code),
                  { name: pageCode }
                )
              );
            }}
          >
            📝生成列表页模板代码
          </span>
          <span
            className="span-btn"
            onClick={() => {
              setOutput(
                renderLinkFormPage(
                  FieldProps.filter(({ code }) => !!code),
                  { name: pageCode }
                )
              );
            }}
          >
            📝生成详情页模板代码
          </span>
          <span className="span-btn" onClick={() => copy(output)} title="复制">
            📋复制
          </span>
        </label>
        <textarea value={output} style={{ whiteSpace: 'pre' }}></textarea>
      </Field>
    </>
  );
}
