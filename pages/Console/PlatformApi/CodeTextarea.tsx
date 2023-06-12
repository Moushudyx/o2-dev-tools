/*
 * @Author: shuyan.yin@hand-china.com
 * @Date: 2023-04-10 15:58:41
 * @LastEditTime: 2023-06-12 10:01:46
 * @LastEditors: shuyan.yin@hand-china.com
 * @Description: file content
 * @FilePath: \o2-dev-tools\pages\Console\PlatformApi\CodeTextarea.tsx
 */
import React, { useState } from 'react';
import { read, write } from 'salt-lib';
import { Para, Field } from 'Components/Typo';
import { copy } from 'Utils/utils';
import { codeConvert } from './codeConvert';

const storageKey = 'PlatformApi';
const CodeTextarea = () => {
  const [code, setCode] = useState(read(`${storageKey}-CodeTextarea`, ''));
  const [convert, setConvert] = useState(codeConvert(code)[0]);
  const [log, setLog] = useState([] as string[]);
  return (
    <Para>
      <Field>
        <label>单文件更改（复制文件内容到这里）</label>
        {/* <button>自动修改</button> */}
        <textarea
          onInput={(ev) => {
            const _code = (ev.target as HTMLTextAreaElement).value || '';
            const [_convert, _log] = codeConvert(_code);
            write(`${storageKey}-CodeTextarea`, _code);
            setCode(_code);
            setConvert(_convert);
            setLog(_log);
            // eslint-disable-next-line no-console
            console.log(log);
          }}
          value={code}
        />
        <label>
          执行结果（控制台可以看到执行记录）
          <span className="span-btn" onClick={() => copy(convert)} title="复制">
            📋复制
          </span>
        </label>
        <textarea value={convert} />
      </Field>
    </Para>
  );
};
export default CodeTextarea;
