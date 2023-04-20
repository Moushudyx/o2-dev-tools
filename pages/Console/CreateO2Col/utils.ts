/*
 * @Author: shuyan.yin@hand-china.com
 * @Date: 2022-09-30 15:14:33
 * @LastEditTime: 2023-04-20 14:49:49
 * @LastEditors: shuyan.yin@hand-china.com
 * @Description: file content
 * @FilePath: \o2-dev-tools\pages\Console\CreateO2Col\utils.ts
 */
import { isString, isNumber, isBoolean, isNull } from 'salt-lib';

interface CreateO2ColProp {
  /** 需以制表符`\t`分割 */
  descTable: string;
  /** 指示列字段名称的索引位置 */
  textColumnIndex: number;
  /** 指示列字段编码的索引位置 */
  codeColumnIndex: number;
  /** 指示列类型的索引位置 */
  typeColumnIndex: number;
  /** 多语言前缀`o2.xxx.xxx.model.` */
  intlPrefix: string;
}

const InputColumn: { [type: string]: string } = {
  text: 'O2ColumnInput',
  number: 'O2ColumnInputNumber',
  lov: 'O2ColumnLov',
  select: 'O2ColumnSelect',
  lovView: 'O2ColumnLovView',
  datetime: 'O2ColumnDatePicker',
};

const InputTypeRegExp: { [type: string]: RegExp } = {
  text: /varchar|文本框?/i,
  number: /number|数字输?入?框?/i,
  lovView: /lovView|l?o?v?值?集?(?:视图|弹出?框)/i,
  lov: /lov|值集|下拉框?/i,
  // lov: /lov|值集/i,
  select: /select|下拉框?/i,
  datetime: /DateTime|(?:日[期历]|时间)选?择?组?件?/i,
};
/** 根据描述确定使用何种组件 */
const getType = (typeDesc: string) => {
  if (typeof typeDesc === 'string') {
    for (const type in InputTypeRegExp) {
      if (InputTypeRegExp[type].test(typeDesc)) return type;
    }
  }
  return 'text';
};
/** 解析自然语言为布尔值 */
const getBoolean = (desc: string) => {
  if (/Y|yes|是|√/i.test(desc)) return true;
  else return false;
};

const defaultMap: { [prop: string]: unknown } = {
  editable: true,
  required: false,
};
/** 判断一个属性是否为默认值 */
const isDefaultValue = (prop: string, value: unknown) => defaultMap[prop] === value;
/** 生成单个列组件的代码 */
const renderColumnCode = (options: { type: string; props: { [prop: string]: unknown } }) => {
  const { type, props } = options;
  const renderPropCodeList: string[] = [];
  for (const prop in props) {
    const v = props[prop];
    if (v === undefined) continue;
    if (isDefaultValue(prop, v)) continue;
    if (isString(v)) {
      if (/^["'\{].*[\}"']$/.test(v)) renderPropCodeList.push(`${prop}=${v}`);
      else if (/^[^"'\{].*\..*[^\}"']$/.test(v)) renderPropCodeList.push(`${prop}={${v}}`);
      else renderPropCodeList.push(`${prop}="${v}"`);
    } else if (isNumber(v)) {
      renderPropCodeList.push(`${prop}={${v}}`);
    } else if (isBoolean(v)) {
      if (v) renderPropCodeList.push(`${prop}`);
      else renderPropCodeList.push(`${prop}={false}`);
    } else if (isNull(v)) {
      renderPropCodeList.push(`${prop}={${v}}`);
    }
  }
  return `<${InputColumn[type]}
  ${renderPropCodeList.map((s) => `${s}`).join('\n  ')}
/>
`;
};

/** 根据输入的信息描述，生成`O2Table`的列代码 */
export const o2ColGen = (props: CreateO2ColProp) => {
  const { descTable, textColumnIndex, codeColumnIndex, typeColumnIndex, intlPrefix } = props;
  // 按行拆分
  const lines = descTable
    .split('\n')
    .filter((l) => !!l.trim())
    .map((l) => l.replace(/[\t]+/g, '\t').split('\t'));
  // 转换为驼峰命名
  const camel = (txt = '') => {
    let res = '';
    txt.split('_').forEach((s, i) => (res += i ? s.slice(0, 1).toUpperCase() + s.slice(1) : s));
    return res;
  };
  return lines
    .map((line) => {
      const type = getType(line[typeColumnIndex]);
      const field = camel(line[codeColumnIndex]);
      const name = line[textColumnIndex];
      const i18n = intlPrefix.endsWith('.') ? intlPrefix : `${intlPrefix}.`;
      return renderColumnCode({
        type,
        props: { title: `intl.get(\`${i18n}${field}\`).d('${name}')`, field },
      });
    })
    .join('');
};
