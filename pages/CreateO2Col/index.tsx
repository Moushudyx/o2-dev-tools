/*
 * @Author: shuyan.yin@hand-china.com
 * @Date: 2022-09-30 15:05:27
 * @LastEditTime: 2023-03-20 15:31:55
 * @LastEditors: shuyan.yin@hand-china.com
 * @Description: file content
 * @FilePath: \o2-dev-tools\pages\CreateO2Col\index.tsx
 */
import { Container, Para, SubTitle } from 'Components/Typo';
import React, { useReducer } from 'react';
import { read, write } from 'Utils/localStorage';
import { o2ColGen } from './utils';
import styles from './index.mod.scss';
import { copy } from 'Utils/utils';

const storageKey = 'CreateO2Col';
const defaultDescTable = read(
  `${storageKey}-descTable`,
  `supplement_code	补足单号	Varchar	文本框
online_shop_code	网店编码	Varchar	LOV
start_time	生效时间（起止）	DateTime	日历组件选择
end_time	失效时间（起止）	DateTime	日历组件选择
valid_status	生效状态	Varchar	下拉框
supplement_status	补足单状态	Varchar	下拉框`
);
const defaultValue = {
  descTable: defaultDescTable,
  textColumnIndex: read(`${storageKey}-textColumnIndex`, '0'),
  codeColumnIndex: read(`${storageKey}-codeColumnIndex`, '1'),
  typeColumnIndex: read(`${storageKey}-typeColumnIndex`, '3'),
  intlPrefix: read(`${storageKey}-intlPrefix`, 'o2.xxx.xxx.model'),
};

export default () => {
  const [state, dispatch] = useReducer(
    (preState: typeof defaultValue, action: Partial<typeof defaultValue>) => {
      for (const key of Object.keys(action)) {
        write(`${storageKey}-${key}`, action[key as keyof typeof defaultValue]);
      }
      return {
        ...preState,
        ...action,
      };
    },
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
          <div className={styles.field} style={{ width: '50%', display: 'inline-block' }}>
            <label>字段名称索引</label>
            <input {...bindValue('textColumnIndex')}></input>
          </div>
          <div className={styles.field} style={{ width: '50%', display: 'inline-block' }}>
            <label>字段编码索引</label>
            <input {...bindValue('codeColumnIndex')}></input>
          </div>
          <div className={styles.field} style={{ width: '50%', display: 'inline-block' }}>
            <label>字段类型索引</label>
            <input {...bindValue('typeColumnIndex')}></input>
          </div>
          <div className={styles.field} style={{ width: '50%', display: 'inline-block' }}>
            <label>多语言前缀</label>
            <input {...bindValue('intlPrefix')}></input>
          </div>
          <div className={styles.field}>
            <label>复制文档中描述字段的表格（以制表符分割的模式）</label>
            <textarea {...bindValue('descTable')}></textarea>
          </div>
          <div className={styles.field}>
            <label>
              生成代码
              <span className={styles['span-btn']} onClick={() => copy(output)} title="复制">
                📋
              </span>
            </label>
            <textarea value={output}></textarea>
          </div>
        </Para>
      </Container>
    </>
  );
};
