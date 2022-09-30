/*
 * @Author: shuyan.yin@hand-china.com
 * @Date: 2022-09-30 15:14:33
 * @LastEditTime: 2022-09-30 15:45:14
 * @LastEditors: shuyan.yin@hand-china.com
 * @Description: file content
 * @FilePath: \o2-dev-tools\pages\CreateO2Col\utils.ts
 */
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
  lovView: 'O2ColumnLovView',
  datetime: 'O2ColumnDatePicker',
};

const InputTypeRegExp: { [type: string]: RegExp } = {
  text: /varchar|文本框?/i,
  number: /number|数字输?入?框?/i,
  lov: /lov|值?集?下拉框?/i,
  lovView: /lovView|l?o?v?值?集?视图/i,
  datetime: /DateTime|(?:日[期历]|时间)选?择?组件/,
};

const getType = (typeDesc: string) => {
  if (typeof typeDesc === 'string') {
    for (const type in InputTypeRegExp) {
      if (InputTypeRegExp[type].test(typeDesc)) return type;
    }
  }
  return 'text';
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
      return `
<${InputColumn[type]}
  title={intl.get(\`${i18n}${field}\`).d('${name}')}
  field="${field}"
/>`;
    })
    .join('');
};
