/*
 * @Author: shuyan.yin@hand-china.com
 * @Date: 2023-06-02 17:51:21
 * @LastEditTime: 2023-06-07 10:04:28
 * @LastEditors: shuyan.yin@hand-china.com
 * @Description: file content
 * @FilePath: \o2-dev-tools\pages\Console\TemplateCode\utils.ts
 */
import { useRef, useState } from 'react';

export function useForceUpdate() {
  const [, setState] = useState(0);
  const updateRef = useRef(() => {
    /* */
  });
  updateRef.current = () => setState(() => Date.now());
  return () => updateRef.current(); // 永远可以获取正确的刷新函数
}

export type TempProp =
  | {
      name: string;
      code: string;
      defaultValue: string;
      selectList: string[];
      type: 'select';
    }
  | {
      name: string;
      code: string;
      defaultValue: string;
      type?: 'normal';
    }
  | {
      name: string;
      code: string;
      template: TempProp[];
      templateCode: string;
      type: 'loop';
    };

export type PropsList = TempProp[];

export function readTemplate(template: string): { props: PropsList; code: string } {
  let c = template;
  let props = [] as PropsList;
  [readLoopTemplate, readNormalTemplate].forEach((fn) => {
    const res = fn(c);
    c = res.code;
    props = props.concat(res.props);
  });
  return { props, code: c };
}

const matchLoopReg = /\$(?:loop|l)\{\{\s*([^\s:]+)\s*:\s*([^:]+?)\s*(?::\s*(.+?)\s*)?\}\}/;
const matchLoopRegGlobal = new RegExp(matchLoopReg, 'g');

export function readLoopTemplate(template: string): { props: PropsList; code: string } {
  const matches = template.match(matchLoopRegGlobal) || [];
  const props: PropsList = matches.map((m) => {
    const [, code, name, defaultValue] = m.match(matchLoopReg)!;
    return { name, code, defaultValue: defaultValue || '' };
  });
  const code = template.replace(matchLoopRegGlobal, `\$\${{$1}}`);
  return { props, code };
}

const matchNormalReg = /\$\{\{\s*([^\s:]+)\s*:\s*([^:]+?)\s*(?::\s*(.+?)\s*)?\}\}/;
const matchNormalRegGlobal = new RegExp(matchNormalReg, 'g');

export function readNormalTemplate(template: string): { props: PropsList; code: string } {
  const matches = template.match(matchNormalRegGlobal) || [];
  const props: PropsList = matches.map((m) => {
    const [, code, name, defaultValue] = m.match(matchNormalReg)!;
    return { name, code, defaultValue: defaultValue || '' };
  });
  const code = template.replace(matchNormalRegGlobal, `\$\${{$1}}`);
  return { props, code };
}
