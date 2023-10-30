/*
 * @Author: shuyan.yin@hand-china.com
 * @Date: 2023-06-08 15:48:10
 * @LastEditTime: 2023-10-30 10:44:22
 * @LastEditors: shuyan.yin@hand-china.com
 * @Description: file content
 * @FilePath: \o2-dev-tools\pages\Console\CreateO2Field\Output.tsx
 */
import React, { useState } from 'react';
import { Field } from 'Components/Typo';
import { LinkFieldProp } from './utils';
import { renderLinkColumn, renderLinkListPage } from './column';
import { renderBaseFormPage, renderLinkFormItem } from './form';
import { copy } from 'Utils/utils';
import { renderRouters } from './router';
import { renderFormCollapsePage } from './collapse';

export function Output(props: {
  pageProps: {
    pageCode: string;
    pageService: string;
    pageName: string;
    pageDesc: string;
    userName: string;
  };
  FieldProps: LinkFieldProp[];
  ignoreNoCode: boolean;
}) {
  const { FieldProps, pageProps, ignoreNoCode } = props;
  const { pageCode, pageService, pageName, pageDesc, userName } = pageProps;
  const [output, setOutput] = useState('');
  // eslint-disable-next-line no-confusing-arrow
  const getProps = () =>
    ignoreNoCode ? FieldProps.filter(({ code }) => !!code) : FieldProps.slice();
  const getPageConfig = () => ({
    pageCode,
    pageService,
    pageName,
    pageDesc,
    userName,
  });
  return (
    <>
      <Field>
        <label>
          <span
            className="span-btn"
            onClick={() => {
              setOutput(renderRouters(getPageConfig()));
            }}
          >
            🚚生成路由代码
          </span>
          <span
            className="span-btn"
            onClick={() => {
              setOutput(
                getProps()
                  .map((prop) => renderLinkColumn(prop, getPageConfig()))
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
                  .map((prop) => renderLinkFormItem(prop, getPageConfig()))
                  .join('\n')
              );
            }}
          >
            📌生成表单字段
          </span>
          <span
            className="span-btn"
            onClick={() => {
              setOutput(renderLinkListPage(getProps(), getPageConfig()));
            }}
          >
            📝生成列表页模板代码
          </span>
          <span
            className="span-btn"
            onClick={() => {
              setOutput(renderBaseFormPage(getPageConfig()));
            }}
          >
            🚚生成详情页主页
          </span>
          <span
            className="span-btn"
            onClick={() => {
              setOutput(renderFormCollapsePage(getProps(), getPageConfig()));
            }}
          >
            📝生成折叠表单代码
          </span>
          <span className="span-btn" onClick={() => copy(output)} title="复制">
            📋复制
          </span>
        </label>
        <textarea className="long-textarea" value={output} style={{ whiteSpace: 'pre' }}></textarea>
      </Field>
    </>
  );
}
