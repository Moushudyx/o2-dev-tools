/*
 * @Author: shuyan.yin@hand-china.com
 * @Date: 2022-09-30 15:14:33
 * @LastEditTime: 2023-06-08 15:44:03
 * @LastEditors: shuyan.yin@hand-china.com
 * @Description: file content
 * @FilePath: \o2-dev-tools\pages\Link\CreateLinkField\utils.ts
 */
import { isBoolean } from 'salt-lib';

interface CreateLinkFieldProp {
  /** 需以制表符`\t`分割 */
  descTable: string;
  /** 指示字段名称的索引位置 */
  textColumnIndex: number;
  /** 指示字段编码的索引位置 */
  codeColumnIndex: number;
  /** 指示类型的索引位置 */
  typeColumnIndex: number;
  /** 指示值列表类型位置 */
  lovColumnIndex: number;
  /** 指示值列表类型位置 */
  requireColumnIndex: number;
  /** 指示值列表类型位置 */
  disableColumnIndex: number;
  /** 多语言前缀`o2.xxx.xxx.model.` */
  // intlPrefix: string;
  /** “可编辑” 还是 “禁用” */
  isEditable: boolean;
}

export interface LinkFieldProp {
  name: string;
  code: string;
  type: keyof typeof InputTypeRegExp; // 'checkbox' | 'datetime' | 'lov' | 'lovView' | 'number' | 'select' | 'text';
  lov: string;
  require?: boolean | undefined;
  disable?: boolean | undefined;
}

const InputTypeRegExp = {
  text: /varchar|文本框?/i,
  number: /number|数[字值]输?入?框?/i,
  lovView: /lovView|pick\s?List|object|l?o?v?值?集?(?:视图|弹出?框)/i,
  lov: /lov|值集?/i,
  select: /select|下拉选?择?框?/i,
  datetime: /Date(?:Time|Pick?e?r?)?|(?:日[期历])选?择?组?件?/i,
  time: /time(?:Pick?e?r?)?|(?:时间)选?择?组?件?/i,
  address: /address|地址/,
  none: /^(?:无|none)?$/i,
} as const;
/** 根据描述确定使用何种组件 */
const getType = (typeDesc: string): keyof typeof InputTypeRegExp => {
  if (typeof typeDesc === 'string') {
    for (const type in InputTypeRegExp) {
      if (InputTypeRegExp[type as keyof typeof InputTypeRegExp].test(typeDesc))
        return type as keyof typeof InputTypeRegExp;
    }
  }
  return 'none';
};
/** 解析自然语言为布尔值 */
const getBoolean = (desc: string): boolean | undefined => {
  if (/t|true|Y|yes|是|√|对|有/i.test(desc)) return true;
  if (/f|false|N|no|否|×|错|无/i.test(desc)) return false;
  else return undefined;
};

// const defaultMap: { [prop: string]: unknown } = {
//   editable: true,
//   required: false,
//   disabled: false,
// };
/** 判断一个属性是否为默认值 */
// const isDefaultValue = (prop: string, value: unknown) => defaultMap[prop] === value;
// const renderColumnCode = (options: { type: string; props: { [prop: string]: unknown } }) => {
//   const { type, props } = options;
//   const renderPropCodeList: string[] = [];
//   for (const prop in props) {
//     const v = props[prop];
//     if (v === undefined) continue;
//     if (isDefaultValue(prop, v)) continue;
//     if (isString(v)) {
//       if (/^["'\{].*[\}"']$/.test(v)) renderPropCodeList.push(`${prop}=${v}`);
//       else if (/^[^"'\{].*\..*[^\}"']$/.test(v)) renderPropCodeList.push(`${prop}={${v}}`);
//       else renderPropCodeList.push(`${prop}="${v}"`);
//     } else if (isNumber(v)) {
//       renderPropCodeList.push(`${prop}={${v}}`);
//     } else if (isBoolean(v)) {
//       if (v) renderPropCodeList.push(`${prop}`);
//       else renderPropCodeList.push(`${prop}={false}`);
//     } else if (isNull(v)) {
//       renderPropCodeList.push(`${prop}={${v}}`);
//     }
//   }
//   return `<${InputColumn[type]}
//   ${renderPropCodeList.map((s) => `${s}`).join('\n  ')}
// />
// `;
// };

/** 根据输入的信息描述，字段信息列表 */
export const readFieldProp = (props: CreateLinkFieldProp): LinkFieldProp[] => {
  const {
    descTable,
    textColumnIndex,
    codeColumnIndex,
    typeColumnIndex,
    lovColumnIndex,
    requireColumnIndex,
    disableColumnIndex,
    isEditable,
  } = props;
  // 按行拆分
  const lines = descTable
    .split('\n')
    .filter((l) => !!l.trim())
    .map((l) => l.split('\t').map((s) => s.trim()));
  // 转换为驼峰命名
  const camel = (txt = '') => {
    let res = '';
    txt.split('_').forEach((s, i) => (res += i ? s.slice(0, 1).toUpperCase() + s.slice(1) : s));
    return res;
  };
  return lines.map((line) => {
    const disableValue = getBoolean(line[disableColumnIndex]);
    return {
      code: camel(line[codeColumnIndex]),
      name: line[textColumnIndex],
      type: getType(line[typeColumnIndex]),
      lov: line[lovColumnIndex],
      require: getBoolean(line[requireColumnIndex]),
      disable: isEditable && isBoolean(disableValue) ? !disableValue : disableValue,
    };
  });
};

export function padLeft(str: string, length: number, padString: string) {
  const padTimes = Math.ceil((length - str.length) / padString.length);
  if (padTimes > 0 && isFinite(padTimes)) {
    return padString.repeat(padTimes) + str;
  } else return str;
}

export function indent(str: string, number = 2, indentStr = ' ') {
  return str
    .split('\n')
    .map((s) => `${indentStr.repeat(number)}${s}`)
    .join('\n');
}
