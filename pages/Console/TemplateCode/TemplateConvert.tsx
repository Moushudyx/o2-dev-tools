/*
 * @Author: shuyan.yin@hand-china.com
 * @Date: 2023-06-02 17:49:37
 * @LastEditTime: 2023-06-06 20:30:54
 * @LastEditors: shuyan.yin@hand-china.com
 * @Description: file content
 * @FilePath: \o2-dev-tools\pages\Console\TemplateCode\TemplateConvert.tsx
 */
import React, { useMemo, useReducer, useState } from 'react';
import { Container, Field, Para, Collapse, SubTitle } from 'Components/Typo';
import { PropsList, TempProp, useForceUpdate } from './utils';
import { isString } from 'salt-lib';

type TemplateConvertState = { [key: string]: TemplateConvertState[] | string };

function TempField(props: { prop: TempProp; state: TemplateConvertState; update: () => void }) {
  const { prop, state, update } = props;
  const { type, name, code } = prop;
  console.log({ type, name, code });
  switch (type) {
    case 'loop':
      if (!Array.isArray(state[code])) state[code] = [];
      return (
        <Field className="temp-field temp-field-loop">
          <label>{name}</label>
          <div>
            <button
              onClick={() => {
                (state[code] as TemplateConvertState[]).push({});
                update();
              }}
            >
              添加
            </button>
          </div>
          <div>
            {(state[code] as TemplateConvertState[]).map((ts, index) => {
              const { template } = prop;
              return (
                <div>
                  <div>
                    <button
                      onClick={() => {
                        if (!confirm('删除后数据无法恢复，确定吗')) return;
                        (state[code] as TemplateConvertState[]).splice(index, 1);
                        update();
                      }}
                    >
                      删除
                    </button>
                    {index > 0 && (
                      <button
                        onClick={() => {
                          const t = ts[index];
                          ts[index] = ts[index - 1];
                          ts[index - 1] = t;
                          update();
                        }}
                      >
                        上移
                      </button>
                    )}
                    {index < state[code].length - 1 && (
                      <button
                        onClick={() => {
                          const t = ts[index];
                          ts[index] = ts[index + 1];
                          ts[index + 1] = t;
                          update();
                        }}
                      >
                        下移
                      </button>
                    )}
                  </div>
                  {template.map((temp) => {
                    <TempField key={temp.code} prop={temp} state={ts} update={update} />;
                  })}
                </div>
              );
            })}
          </div>
        </Field>
      );
    case 'select':
      if (!isString(state[code])) state[code] = prop.defaultValue || '';
      return (
        <Field className="temp-field temp-field-select">
          <label>{name}</label>
          <select
            value={state[code] as string}
            onChange={(ev) => {
              state[code] = ev.target.value;
              update();
            }}
          >
            {prop.selectList.map((v, i) => (
              <option key={`${v}--${i}`} value={v}>
                {v || <i>空值</i>}
              </option>
            ))}
          </select>
        </Field>
      );
    case 'normal':
    default:
      if (!isString(state[code])) state[code] = prop.defaultValue || '';
      return (
        <Field className="temp-field temp-field-input">
          <label>{name}</label>
          <input
            value={state[code] as string}
            onChange={(ev) => {
              state[code] = ev.target.value;
              update();
            }}
          ></input>
        </Field>
      );
  }
}

export function TemplateConvert(props: { tempList: PropsList; code: string }) {
  const { tempList } = props;
  const [state] = useReducer((preState: TemplateConvertState, action: TemplateConvertState) => {
    const res = { ...preState, ...action };
    return res;
  }, {} as TemplateConvertState);
  const update = useForceUpdate();
  console.log({ tempList });
  return (
    <Para>
      {tempList.map((temp) => (
        <TempField key={temp.code} prop={temp} state={state} update={update} />
      ))}
    </Para>
  );
}
