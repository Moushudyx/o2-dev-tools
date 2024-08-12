/*
 * @Author: moushu
 * @Date: 2023-06-02 17:47:03
 * @LastEditTime: 2023-06-06 20:28:23
 * @Description: file content
 * @FilePath: \o2-dev-tools\pages\Console\TemplateCode\index.tsx
 */
import React, { useMemo, useReducer, useState } from 'react';
import { Container, Field, Para, Collapse, SubTitle } from 'Components/Typo';
import { readTemplate } from './utils';
import { TemplateConvert } from './TemplateConvert';

export default function TemplateCode() {
  const [temp, setTemp] = useState('1233${{awa:qwq:ewqeqweqwe}}21312');
  const { props: tempProps, code: tempCode } = readTemplate(temp);
  console.log({tempProps, tempCode})
  return (
    <>
      <Container>
        <SubTitle>代码模板工具</SubTitle>
        <Collapse header="模板预设：">
          <Para>
            你可以用形如<code>{`\$\{{ 参数编码 : 参数名称 : 参数默认值 }}`}</code>或
            <code>{`\$\{{ 参数编码 : 参数名称 }}`}</code>的格式定义一个参数；
          </Para>
          <Para>
            其中
            <code>参数编码</code>不能含有空字符（包括换行）和半角冒号，<code>参数名称</code>
            不能含有半角冒号或换行，<code>参数默认值</code>不能换行；
          </Para>
          <Para>
            参数只需要定义一次即可，再次使用此参数时只需要这么写：
            <code>{`\$\{{ 参数编码 }}`}</code>
          </Para>
        </Collapse>
        <Para>
          <Field>
            <label>模板内容</label>
            <textarea
              value={temp}
              onChange={(ev) => {
                setTemp(ev.target.value);
              }}
            />
          </Field>
        </Para>
        <TemplateConvert tempList={tempProps} code={tempCode} />
      </Container>
    </>
  );
}
