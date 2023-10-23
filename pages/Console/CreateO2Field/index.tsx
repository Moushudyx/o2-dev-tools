/*
 * @Author: shuyan.yin@hand-china.com
 * @Date: 2022-09-30 15:05:27
 * @LastEditTime: 2023-10-23 11:47:59
 * @LastEditors: shuyan.yin@hand-china.com
 * @Description: file content
 * @FilePath: \o2-dev-tools\pages\Console\CreateO2Field\index.tsx
 */
import React, { useReducer, useState } from 'react';
import { Collapse, Container, Field, Para, SubLine, SubTitle } from 'Components/Typo';
import { read, write } from 'Utils/localStorage';
import { defaultValue, isValidSetting, readFieldProp, storageKey } from './utils';
import { intelligentHeadRead } from './intelligent';
import { isNumber } from 'salt-lib';
import { Output } from './Output';
import Switch from 'Components/Switch';
import { readLines, readXlsx } from './xlsx';
import './index.scss';

export default () => {
  const [state, dispatch] = useReducer(
    (preState: typeof defaultValue, action: Partial<typeof defaultValue>) => {
      for (const key of Object.keys(action)) {
        write(`${storageKey}-${key}`, action[key as keyof typeof defaultValue]);
      }
      return { ...preState, ...action };
    },
    { ...defaultValue }
  );
  const [isEditable, setIsEditable] = useState(read(`${storageKey}-isEditable`, true));
  const bindValue: <T extends keyof typeof defaultValue>(
    key: T
  ) => { value: (typeof defaultValue)[T] } = (key) => {
    const _type = typeof state[key] as 'boolean' | 'string';
    const defaultValue = ((type) => {
      if (type === 'boolean') return false;
      else return '';
    })(_type);
    return {
      value: state[key],
      onInput: (ev: { target: EventTarget | null }) => {
        const { target } = ev;
        if (!target || !('value' in target)) return;
        dispatch({ [key]: target.value || defaultValue });
      },
    };
  };
  const validSetting = isValidSetting(state, { isEditable });
  const computedProps = validSetting ? readFieldProp(validSetting) : [];
  // console.log(computedProps);
  /** 使用`intelligentHeadRead`读取后`dispatch`到头数据里 */
  const dispatchHead = (a: Partial<ReturnType<typeof intelligentHeadRead>>) => {
    const readRes = {} as { [key: string]: string };
    (Object.keys(a) as Array<keyof typeof a>).forEach((key) => {
      if (isNumber(a[key])) readRes[key] = String(a[key]);
    });
    dispatch(readRes as unknown as typeof defaultValue);
  };
  /** 读取 excel */
  const readFile = async (file: File) => {
    const wb = await readXlsx(file);
    if (!wb.SheetNames[0]) return;
    const { head, body } = await readLines(wb, wb.SheetNames[0]);
    const tableHead = head.join('\t');
    dispatchHead(intelligentHeadRead(tableHead));
    dispatch({ tableHead, descTable: body.map((l) => l.join('\t')).join('\n') });
  };
  return (
    <>
      <Container className="link-create-field">
        <SubTitle>生成 O2 页面代码</SubTitle>
        <Collapse header={<b>使用说明（点击右侧按钮展开详细说明）：</b>} defaultCollapse>
          <Para>
            手动操作：
            <ol>
              <li>
                在大输入框中粘贴从 Excel 表格中复制而来的内容
                <ul>
                  <li>
                    根据制表符<code>\t</code>区分列，因此必须是从 Excel
                    之类的软件里复制出来的；否则你需要手动处理格式
                  </li>
                </ul>
              </li>
              <li>
                在上面的输入框里输入对应的数据在哪一列
                <ul>
                  <li>按行分析，因此一个字段的所有数据必须写在一行里</li>
                </ul>
              </li>
              <li>如果实在分不清哪一列是哪一列，可以试试🕒智能读取</li>
              <li>生成的代码会放在页面最下方</li>
            </ol>
          </Para>
          <Para>
            自动操作：
            <ol>
              <li>
                将导出的<code>csx</code>或<code>xlsx</code>拖拽到上传框处
              </li>
              <li>检查大输入框中读取的数据是否正确</li>
              <li>生成的代码会放在页面最下方</li>
            </ol>
          </Para>
        </Collapse>
        <hr />
        <SubLine>自动操作</SubLine>
        <hr />
        <Para>
          <Field>
            <label>将 Excel 文件上传到这里</label>
            <input
              type="file"
              name="Excel Upload"
              accept=".csv, .xls, .xlsx, .xlsm, .xlsb"
              onChange={(ev) => {
                const list = Array.from((ev.target as HTMLInputElement).files || []);
                if (!list[0]) return;
                void readFile(list[0]);
              }}
            />
          </Field>
        </Para>
        <hr />
        <SubLine>手动操作</SubLine>
        <hr />
        <Para>
          <Field>
            <label>
              将 Excel 的表头粘贴在这里
              <span
                className="span-btn"
                onClick={() => {
                  dispatchHead(intelligentHeadRead(state.tableHead));
                }}
                title="复制"
              >
                🕒智能读取
              </span>
            </label>
            <input {...bindValue('tableHead')} style={{ width: '100%', padding: '4px 4px' }} />
          </Field>
        </Para>
        <hr />
        <Para>
          <Field>
            <label>
              在下面的表单中填写应该从第几列读取指定数据（或者点击上面的“智能读取”按钮自动填写）
            </label>
          </Field>
          <Field className="half-field">
            <label>字段名称</label>
            <input {...bindValue('textColumnIndex')}></input>
          </Field>
          <Field className="half-field">
            <label>
              字段编码
              <span title="会自动转换为驼峰格式" style={{ textDecoration: 'underline dashed' }}>
                ?
              </span>
            </label>
            <input {...bindValue('codeColumnIndex')}></input>
          </Field>
          <Field className="half-field">
            <label>
              字段类型
              <span
                title="可以识别“日期”“address”“数字”“pickList”等文字"
                style={{ textDecoration: 'underline dashed' }}
              >
                ?
              </span>
            </label>
            <input {...bindValue('typeColumnIndex')}></input>
          </Field>
          <Field className="half-field">
            <label>
              值集编码
              <span title="也叫 Lov 编码，包括值集视图编码" style={{ textDecoration: 'underline dashed' }}>
                ?
              </span>
            </label>
            <input {...bindValue('lovColumnIndex')}></input>
          </Field>
          <Field className="half-field">
            <label>是否必填</label>
            <input {...bindValue('requireColumnIndex')}></input>
          </Field>
          <Field className="half-field">
            <label>
              是否{isEditable ? '可编辑' : '禁用'}
              <button
                title="有的文档写的是“是否可编辑”，有的文档写的是“是否禁用”"
                style={{ padding: 0, margin: 0 }}
                onClick={() => {
                  setIsEditable((v) => {
                    write(`${storageKey}-isEditable`, !v);
                    return !v;
                  });
                }}
              >
                🔄
              </button>
            </label>
            <input {...bindValue('disableColumnIndex')}></input>
          </Field>
        </Para>
        <hr />
        <Para>
          <Field>
            <label>复制文档中描述字段的表格（以制表符分割的模式）</label>
            <textarea {...bindValue('descTable')} style={{ whiteSpace: 'pre' }}></textarea>
          </Field>
        </Para>
        <hr />
        <Para>
          <Field className="half-field">
            <label>页面编码</label>
            <input {...bindValue('pageCode')}></input>
          </Field>
          <Field className="half-field">
            <label>页面服务</label>
            <input {...bindValue('pageService')}></input>
          </Field>
          <Field className="half-field">
            <label>页面名称</label>
            <input {...bindValue('pageName')}></input>
          </Field>
          <Field className="half-field">
            <label>页面说明</label>
            <input {...bindValue('pageDesc')}></input>
          </Field>
          <Field className="half-field">
            <label>开发人员邮箱</label>
            <input {...bindValue('userName')}></input>
          </Field>
          <Field className="half-field">
            <label>忽略没有获取到编码的字段</label>
            <Switch {...bindValue('ignoreNoCode')}></Switch>
          </Field>
          <Output pageProps={state} FieldProps={computedProps} ignoreNoCode={state.ignoreNoCode} />
        </Para>
      </Container>
    </>
  );
};
