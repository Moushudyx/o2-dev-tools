/*
 * @Author: shuyan.yin@hand-china.com
 * @Date: 2023-06-08 15:48:10
 * @LastEditTime: 2023-06-08 17:58:02
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

export function Output(props: {
  pageCode: string;
  FieldProps: LinkFieldProp[];
  ignoreNoCode: boolean;
}) {
  const { FieldProps, pageCode, ignoreNoCode } = props;
  const [output, setOutput] = useState('');
  // eslint-disable-next-line no-confusing-arrow
  const getProps = () =>
    ignoreNoCode ? FieldProps.filter(({ code }) => !!code) : FieldProps.slice();
  return (
    <>
      <Field>
        <label>
          <span
            className="span-btn"
            onClick={() => {
              setOutput(
                getProps()
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
                getProps()
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
              setOutput(renderLinkListPage(getProps(), { name: pageCode }));
            }}
          >
            📝生成列表页模板代码
          </span>
          <span
            className="span-btn"
            onClick={() => {
              setOutput(renderLinkFormPage(getProps(), { name: pageCode }));
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
