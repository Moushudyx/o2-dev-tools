/*
 * @Author: shuyan.yin@hand-china.com
 * @Date: 2022-09-30 15:05:27
 * @LastEditTime: 2023-06-08 18:11:31
 * @LastEditors: shuyan.yin@hand-china.com
 * @Description: file content
 * @FilePath: \o2-dev-tools\pages\Link\CreateLinkField\index.tsx
 */
import React, { useReducer, useState } from 'react';
import { Collapse, Container, Field, Para, SubLine, SubTitle } from 'Components/Typo';
import { read, write } from 'Utils/localStorage';
import { readFieldProp } from './utils';
import { intelligentHeadRead } from './intelligent';
import { isNumber } from 'salt-lib';
import './index.scss';
import { Output } from './Output';
import Switch from 'Components/Switch';

const storageKey = 'CreateLinkField';
const defaultDescTable = read(
  `${storageKey}-descTable`,
  `创建时间	日期		自动生成	是	否	系统标准字段				lnk_clue	created_by
创建人	文本		自动生成	是	否	系统标准字段				lnk_clue	created
姓名	文本		手工录入	是	否					lnk_clue	acct_name
手机号码	文本		手工录入	条件判断	否					lnk_clue	mobile_phone
微信号	文本		手工录入	条件判断	否					lnk_clue	wx_num
家庭成员	lov		手工选择	否	是		FAMILY_MEMBERS	单身：single ，二人世界：twoPersons，三口之家：threePersons ，二孩家庭：twoChild ，三代同堂：threeGenerations ，其他：other		lnk_clue	family_members
有无宠物	lov		手工选择	否	是		IS_FLAG	有：Y、无：N		lnk_clue	pet_flag
来源渠道	lov		手工选择	是	条件判断		SOURCE_CHANNEL	商场活动、异业联盟（上下游品牌）、自然客流、门店签约设计公司、老客户复购、老客户转介绍、关系户（内部+外部）、渠道部-独立渠道、渠道部-战略渠道、小区团购	自然客流	lnk_clue	source_channel
空间需求	lov		手工选择	否	否		SPACING_REQUIREMENT	厨房、客厅、餐厅、卫浴、卧室、书房、影音室、衣帽间、茶室、休闲娱乐空间、其他		lnk_clue	space_requirement
空间需求数量	数值		手工录入	否	否					lnk_clue	space_require_num
预计出图时间	日期		自动生成	否	否					lnk_clue	scheduled_time
`
);
const defaultValue = {
  descTable: defaultDescTable,
  textColumnIndex: read(`${storageKey}-textColumnIndex`, '0'),
  codeColumnIndex: read(`${storageKey}-codeColumnIndex`, '11'),
  typeColumnIndex: read(`${storageKey}-typeColumnIndex`, '1'),
  lovColumnIndex: read(`${storageKey}-lovColumnIndex`, '7'),
  requireColumnIndex: read(`${storageKey}-requireColumnIndex`, '4'),
  disableColumnIndex: read(`${storageKey}-disableColumnIndex`, '5'),

  tableHead: read(
    `${storageKey}-tableHead`,
    '业务字段名	字段类型	字段长度	录入方式	是否必需	是否可编辑	业务含义／规则	值列表类型	值列表可选值	默认值	DB表名	DB字段名称'
  ),
  pageCode: read(`${storageKey}-pageCode`, 'clue'),
  ignoreNoCode: read(`${storageKey}-ignoreNoCode`, true),
};

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
    console.log(key, state[key]);
    return {
      value: state[key],
      onInput: (ev: { target: EventTarget | null }) => {
        const { target } = ev;
        console.log(target, target?.value);
        if (!target || !('value' in target)) return;
        dispatch({ [key]: target.value || defaultValue });
      },
    };
  };
  const computedProps =
    state.descTable &&
    isFinite(+state.textColumnIndex) &&
    isFinite(+state.codeColumnIndex) &&
    isFinite(+state.typeColumnIndex) &&
    isFinite(+state.lovColumnIndex) &&
    isFinite(+state.requireColumnIndex) &&
    isFinite(+state.disableColumnIndex)
      ? readFieldProp({
          descTable: state.descTable,
          textColumnIndex: +state.textColumnIndex,
          codeColumnIndex: +state.codeColumnIndex,
          typeColumnIndex: +state.typeColumnIndex,
          lovColumnIndex: +state.lovColumnIndex,
          requireColumnIndex: +state.requireColumnIndex,
          disableColumnIndex: +state.disableColumnIndex,
          isEditable,
        })
      : [];
  // console.log(computedProps);
  return (
    <>
      <Container className="link-create-field">
        <SubTitle>生成 Link 字段代码</SubTitle>
        <Collapse header={<SubLine>点击右侧按钮展开详细说明</SubLine>} defaultCollapse>
          <Para>
            具体操作：
            <ol>
              <li>在大输入框中粘贴从 Excel 表格中复制而来的内容</li>
              <li>在上面的输入框里输入对应的数据在哪一列</li>
              <li>如果实在分不清哪一列是哪一列，可以试试🕒智能读取</li>
              <li>生成的代码会放在页面最下方</li>
            </ol>
          </Para>
          <Para>
            本工具原理：
            <ol>
              <li>
                根据制表符<code>\t</code>区分列，因此必须是从 Excel
                之类的软件里复制出来的；否则你需要手动处理格式
              </li>
              <li>按行分析，因此一个字段的所有数据必须写在一行里</li>
            </ol>
          </Para>
        </Collapse>
        <hr />
        <Para>
          <Field>
            <label>
              将 Excel 的表头粘贴在这里
              <span
                className="span-btn"
                onClick={() => {
                  const readI = intelligentHeadRead(state.tableHead);
                  // console.log(readI);
                  const readRes = {} as Partial<typeof defaultValue>;
                  Object.keys(readI).forEach((key) => {
                    if (isNumber(readI[key as keyof typeof readI])) {
                      readRes[key as keyof typeof readI] = String(readI[key as keyof typeof readI]);
                    }
                  });
                  dispatch(readRes);
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
              值列表类型
              <span title="也叫 Lov 编码" style={{ textDecoration: 'underline dashed' }}>
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
            <label>忽略没有获取到编码的字段</label>
            <Switch {...bindValue('ignoreNoCode')}></Switch>
          </Field>
          <Output
            pageCode={state.pageCode}
            FieldProps={computedProps}
            ignoreNoCode={state.ignoreNoCode}
          />
        </Para>
      </Container>
    </>
  );
};
