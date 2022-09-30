/*
 * @Author: shuyan.yin@hand-china.com
 * @Date: 2022-09-30 15:05:27
 * @LastEditTime: 2022-09-30 16:37:30
 * @LastEditors: shuyan.yin@hand-china.com
 * @Description: file content
 * @FilePath: \o2-dev-tools\pages\CreateO2Col\index.tsx
 */
import { Container, Para, SubTitle } from 'Components/Typo';
import React, { useReducer } from 'react';
import { read } from 'Utils/localStorage';
import { o2ColGen } from './utils';

const key = 'CreateO2Col';
const defaultDescTable = read(
  `${key}-descTable`,
  `supplement_code	补足单号	Varchar	文本框
online_shop_code	网店编码	Varchar	LOV
start_time	生效时间（起止）	DateTime	日历组件选择
end_time	失效时间（起止）	DateTime	日历组件选择
valid_status	生效状态	Varchar	下拉框
supplement_status	补足单状态	Varchar	下拉框`
);
const defaultTextColumnIndex = read(`${key}-textColumnIndex`, '0');
const defaultCodeColumnIndex = read(`${key}-codeColumnIndex`, '1');
const defaultTypeColumnIndex = read(`${key}-typeColumnIndex`, '3');
const defaultIntlPrefix = read(`${key}-intlPrefix`, 'o2.xxx.xxx.model');
const defaultValue = {
  descTable: defaultDescTable,
  textColumnIndex: defaultTextColumnIndex,
  codeColumnIndex: defaultCodeColumnIndex,
  typeColumnIndex: defaultTypeColumnIndex,
  intlPrefix: defaultIntlPrefix,
};

export default () => {
  const [state, dispatch] = useReducer(
    (preState: typeof defaultValue, action: Partial<typeof defaultValue>) => ({
      ...preState,
      ...action,
    }),
    { ...defaultValue }
  );
  const bindValue = (key: keyof typeof defaultValue) => ({
    value: state[key],
    onInput: (ev: { target: EventTarget | null }) => {
      const { target } = ev;
      if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return;
      dispatch({ [key]: target.value || '' });
    },
  });
  const output =
    state.descTable &&
    isFinite(+state.textColumnIndex) &&
    isFinite(+state.codeColumnIndex) &&
    isFinite(+state.typeColumnIndex) &&
    state.intlPrefix
      ? o2ColGen({
          descTable: state.descTable,
          textColumnIndex: +state.textColumnIndex,
          codeColumnIndex: +state.codeColumnIndex,
          typeColumnIndex: +state.typeColumnIndex,
          intlPrefix: state.intlPrefix,
        })
      : '';
  return (
    <>
      <Container>
        <SubTitle>生成O2Table的列代码</SubTitle>
        <Para>
          <div>
            字段名称索引
            <input {...bindValue('textColumnIndex')}></input>
          </div>
          <div>
            字段编码索引
            <input {...bindValue('codeColumnIndex')}></input>
          </div>
          <div>
            字段类型索引
            <input {...bindValue('typeColumnIndex')}></input>
          </div>
          <div>
            多语言前缀
            <input {...bindValue('intlPrefix')}></input>
          </div>
          <div>
            <textarea {...bindValue('descTable')}></textarea>
          </div>
          <div>
            <textarea value={output}></textarea>
          </div>
        </Para>
      </Container>
    </>
  );
};
