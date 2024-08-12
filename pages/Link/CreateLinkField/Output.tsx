/*
 * @Author: moushu
 * @Date: 2023-06-08 15:48:10
 * @LastEditTime: 2023-06-16 09:58:31
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
  pageProps: { pageCode: string; pageName: string; pageDesc: string; userName: string };
  FieldProps: LinkFieldProp[];
  ignoreNoCode: boolean;
}) {
  const { FieldProps, pageProps, ignoreNoCode } = props;
  const { pageCode, pageName, pageDesc, userName } = pageProps;
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
              setOutput(renderLinkListPage(getProps(), { pageCode, pageName, pageDesc, userName }));
            }}
          >
            📝生成列表页模板代码
          </span>
          <span
            className="span-btn"
            onClick={() => {
              setOutput(renderLinkFormPage(getProps(), { pageCode, pageName, pageDesc, userName }));
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
