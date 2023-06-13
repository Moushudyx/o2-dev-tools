/*
 * @Author: shuyan.yin@hand-china.com
 * @Date: 2023-06-13 09:44:15
 * @LastEditTime: 2023-06-13 10:57:43
 * @LastEditors: shuyan.yin@hand-china.com
 * @Description: file content
 * @FilePath: \o2-dev-tools\pages\General\CodeCase\index.tsx
 */
import React, { useMemo, useRef, useState } from 'react';
import { Container, SubTitle, Field, Para, Collapse } from 'Components/Typo';
import { read, write } from 'salt-lib';
import { debounce } from 'Utils/utils';
import { caseConvert, splitVar } from './utils';
import './index.scss';

const storageKey = 'CodeCase';

const types = [
  { name: '小驼峰命名', code: 'camel' },
  { name: '大驼峰命名', code: 'pascal' },
  { name: '串行命名法', code: 'kebab' },
  { name: '蛇形命名法', code: 'snake' },
] as const;

export default function CodeCase() {
  const [code1, setCode1] = useState(
    read(`${storageKey}-code1`, `camelCase\nPascalCase\nkebab-case\nsnake_case_123`)
  );
  const [type, setType] = useState(read(`${storageKey}-type`, 'camel'));
  const [keepUpperCase, setKeepUpperCase] = useState(read(`${storageKey}-keepUpperCase`, false));
  const [ignoreNumber, setIgnoreNumber] = useState(read(`${storageKey}-ignoreNumber`, false));
  const codeRef1 = useRef(null as HTMLTextAreaElement | null);
  const codeRef2 = useRef(null as HTMLTextAreaElement | null);
  const isMouseDown = useRef(0);
  const heightAlign = useMemo(
    () =>
      debounce(
        (source: HTMLElement, target: HTMLElement) => {
          if (target.offsetHeight !== source.offsetHeight) {
            target.style.height = `${source.offsetHeight}px`;
          }
        },
        16,
        true
      ),
    []
  );
  const res = useMemo(() => {
    const vars = code1
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    return vars
      .map((c) => caseConvert(splitVar(c), type, { keepUpperCase, ignoreNumber }))
      .join('\n');
  }, [code1, type, keepUpperCase, ignoreNumber]);
  return (
    <>
      <Container className="code-case">
        <SubTitle>变量名转换</SubTitle>
        <Collapse header={<b>使用说明（点击右侧按钮展开详细说明）：</b>} defaultCollapse>
          <Para>
            将需要转换的变量名放在左侧文本框中，按换行分割
            <br />
            选择你想要输出的变量格式，对应格式的变量会输出在右侧文本框中
          </Para>
        </Collapse>
        <Para>
          <Field>
            <span
              onClick={() => {
                setKeepUpperCase((k) => {
                  write(`${storageKey}-keepUpperCase`, !k);
                  return !k;
                });
              }}
              className="span-btn code-case-btn"
            >
              {keepUpperCase ? '✔' : '✘'} 是否保留大写
            </span>
            <span
              onClick={() => {
                setIgnoreNumber((k) => {
                  write(`${storageKey}-ignoreNumber`, !k);
                  return !k;
                });
              }}
              className="span-btn code-case-btn"
            >
              {ignoreNumber ? '✔' : '✘'} 是否忽略数字
            </span>
          </Field>
          <Field>
            {types.map(({ name, code }) => (
              <span
                key={code}
                onClick={() => {
                  setType(() => code);
                  write(`${storageKey}-type`, code);
                }}
                className="span-btn code-case-btn"
              >
                {type === code ? '📖' : '📘'} {name}
              </span>
            ))}
          </Field>
          <Field>
            <label>输入需要转换的变量名，按换行分割</label>
            <div style={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'stretch' }}>
              <textarea
                ref={codeRef1}
                onInput={(ev) => {
                  const _code = (ev.target as HTMLTextAreaElement).value || '';
                  setCode1(_code);
                  write(`${storageKey}-code1`, _code);
                }}
                value={code1}
                onMouseDown={() => {
                  isMouseDown.current = 1;
                }}
                onMouseMove={() => {
                  if (isMouseDown.current === 1 && codeRef1.current && codeRef2.current) {
                    heightAlign(codeRef1.current, codeRef2.current);
                  }
                }}
                onMouseUp={() => {
                  isMouseDown.current = 0;
                  if (isMouseDown.current === 1 && codeRef1.current && codeRef2.current) {
                    heightAlign(codeRef1.current, codeRef2.current);
                  }
                }}
              />
              <textarea
                ref={codeRef2}
                value={res}
                onMouseDown={() => {
                  isMouseDown.current = 2;
                }}
                onMouseMove={() => {
                  if (isMouseDown.current === 2 && codeRef1.current && codeRef2.current) {
                    heightAlign(codeRef2.current, codeRef1.current);
                  }
                }}
                onMouseUp={() => {
                  isMouseDown.current = 0;
                  if (isMouseDown.current === 2 && codeRef1.current && codeRef2.current) {
                    heightAlign(codeRef2.current, codeRef1.current);
                  }
                }}
              />
            </div>
          </Field>
        </Para>
      </Container>
    </>
  );
}
