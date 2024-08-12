/*
 * @Author: moushu
 * @Date: 2022-09-30 15:14:33
 * @LastEditTime: 2023-11-10 11:07:26
 * @Description: file content
 * @FilePath: \o2-dev-tools\pages\Console\CreateO2Field\utils.ts
 */
import { caseConvert, splitVar } from 'Pages/General/CodeCase/utils';
import { isBoolean, read } from 'salt-lib';

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

export const storageKey = 'CreateO2Field';
export const defaultDescTable = read(
  `${storageKey}-descTable`,
  `网店商品编码	platformProductCode	文本	是	否
网店商品名称	title	文本	是	否
网店	catalogVersionName	值集视图	是	否	O2MD.ALL_ONLINE_SHOP
MDM编码	mdmCode	文本	是	否
网店商品状态	activeFlag	开关	是	否
原价	price	数字	是	否
发布状态	postStatusCode	值集	是	否	O2PCM.SHELF_STATUS
上下架状态	shelfStatusCode	值集	是	否	O2PCM.ATTRIBUTE_SALE
定时上架时间	autoOnlineDate	时间	是	否
定时下架时间	autoOfflineDate	时间	是	否
`
);

export function getDefaultValue() {
  return {
    descTable: defaultDescTable,
    textColumnIndex: read(`${storageKey}-textColumnIndex`, '0'),
    codeColumnIndex: read(`${storageKey}-codeColumnIndex`, '1'),
    typeColumnIndex: read(`${storageKey}-typeColumnIndex`, '2'),
    lovColumnIndex: read(`${storageKey}-lovColumnIndex`, '5'),
    requireColumnIndex: read(`${storageKey}-requireColumnIndex`, '4'),
    disableColumnIndex: read(`${storageKey}-disableColumnIndex`, '3'),

    tableHead: read(
      `${storageKey}-tableHead`,
      '字段名称	字段编码	字段类型	是否可编辑	是否必填	值集编码	字段逻辑'
    ),
    pageCode: read(`${storageKey}-pageCode`, 'platform product'),
    pageService: read(`${storageKey}-pageService`, 'o2pcm'),
    pageName: read(`${storageKey}-pageName`, '网店商品管理'),
    pageDesc: read(`${storageKey}-pageDesc`, '网店商品管理列表页'),
    userName: read(`${storageKey}-userName`, 'xxx.xxx@hand-china.com'),
    ignoreNoCode: read(`${storageKey}-ignoreNoCode`, false),
  };
}

const InputTypeRegExp = {
  text: /varchar|文本框?/i,
  number: /number|数[字值]输?入?框?/i,
  lovView: /lovView|pick\s?List|object|l?o?v?值?集?(?:视图|弹出?框)/i,
  lov: /lov|值集?/i,
  select: /select|下拉选?择?框?/i,
  switch: /switch|开关|是否选?择?框?/i,
  datetime: /Date(?:Time|Pick?e?r?)?|(?:日[期历])选?择?组?件?/i,
  time: /time(?:Pick?e?r?)?|(?:时间)选?择?组?件?/i,
  address: /address|地址/,
  image: /ima?ge?|图/,
  upload: /upload?e?r?|上传|文件/,
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ReturnType<T> = T extends (...args: any[]) => infer P ? P: never;

export function isValidSetting<T extends ReturnType<typeof getDefaultValue>>(
  state: T,
  others: { isEditable: boolean }
): CreateLinkFieldProp | null {
  if (
    state.descTable &&
    isFinite(+state.textColumnIndex) &&
    isFinite(+state.codeColumnIndex) &&
    isFinite(+state.typeColumnIndex) &&
    isFinite(+state.lovColumnIndex) &&
    isFinite(+state.requireColumnIndex) &&
    isFinite(+state.disableColumnIndex)
  )
    return {
      descTable: state.descTable,
      textColumnIndex: +state.textColumnIndex,
      codeColumnIndex: +state.codeColumnIndex,
      typeColumnIndex: +state.typeColumnIndex,
      lovColumnIndex: +state.lovColumnIndex,
      requireColumnIndex: +state.requireColumnIndex,
      disableColumnIndex: +state.disableColumnIndex,
      ...others,
    };
  else return null;
}

/** 根据输入的信息描述，字段信息列表 */
export function readFieldProp(props: CreateLinkFieldProp): LinkFieldProp[] {
  const { descTable } = props;
  // 按行拆分
  const lines = descTable
    .split('\n')
    .filter((l) => {
      const s = l.trim();
      return !!s && !s.startsWith('//');
    })
    .map((l) => l.split('\t').map((s) => s.trim()));
  return genProps(lines, props);
}
/** `readFieldProp`的核心部分，拆出来方便操作 */
export function genProps(lines: string[][], props: Omit<CreateLinkFieldProp, 'descTable'>) {
  const {
    textColumnIndex,
    codeColumnIndex,
    typeColumnIndex,
    lovColumnIndex,
    requireColumnIndex,
    disableColumnIndex,
    isEditable,
  } = props;
  // 转换为驼峰命名
  const camel = (txt = '') => caseConvert(splitVar(txt), 'camel');
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
}

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
