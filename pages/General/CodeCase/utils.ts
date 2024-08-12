/*
 * @Author: moushu
 * @Date: 2023-06-13 09:57:45
 * @LastEditTime: 2023-06-28 10:34:46
 * @Description: 变量名转换相关方法
 * @FilePath: \o2-dev-tools\pages\General\CodeCase\utils.ts
 */
type VarCase = {
  code: string;
  /** 是否为全大写 */
  upperCase?: boolean;
  /** 是否为数字串 */
  number?: boolean;
};

export type validCaseType =
  | 'camel'
  | 'kebab-camel'
  | 'kebab-pascal'
  | 'kebab-upper'
  | 'kebab'
  | 'pascal'
  | 'snake-camel'
  | 'snake-pascal'
  | 'snake-upper'
  | 'snake';

const isUpperCase = RegExp.prototype.test.bind(/[A-Z]/);
const isLowerCase = RegExp.prototype.test.bind(/[a-z]/);
const isNumberCase = RegExp.prototype.test.bind(/[0-9]/);
const isSymbolCase = RegExp.prototype.test.bind(/[^a-z0-9A-Z]/);
/** 使用后可以用`caseConvert`组合为适合的格式 */
export function splitVar(c: string) {
  const res = [] as VarCase[];
  // 拆分逻辑：
  // a 基本拆分：
  //     1 空字符串 - 前后拆分
  //     2 特殊字符 - 前后拆分
  //     3 数字     - 连续数字归为一个，前后拆分
  // b 驼峰拆分：
  //     1 连续大写 - 归为一个
  //     2 连续小写 - 与这一串的前一个大写（若有）归为一串
  let temp: VarCase = { code: '' };
  let i: number;
  for (i = 0; i < c.length; i++) {
    const char = c[i];
    if (isSymbolCase(char)) {
      // a-1 a-2
      if (temp.code) {
        // 前后拆分
        res.push(temp);
        temp = { code: '' };
      }
    } else if (isNumberCase(char)) {
      // a-3
      if (!temp.code) temp.number = true;
      if (temp.number) {
        // 连续数字归为一个
        temp.code += char;
      } else {
        // 前后拆分
        res.push(temp);
        temp = { code: char, number: true };
      }
    } else if (isLowerCase(char)) {
      // b-2
      if (!temp.code) {
        // 归为一串
        temp.code += char;
      } else if (temp.upperCase) {
        // 与这一串的前一个大写（若有）归为一串
        if (temp.code.length === 1) {
          temp.upperCase = false;
          temp.code += char;
        } else {
          const lastUpperCase = temp.code[temp.code.length - 1];
          temp.code = temp.code.slice(0, -1);
          res.push(temp);
          temp = { code: lastUpperCase + char };
        }
      } else if (temp.number) {
        res.push(temp);
        temp = { code: char };
      } else {
        // 归为一串
        temp.code += char;
      }
    } else if (isUpperCase(char)) {
      // b-1
      //归为一个
      if (!temp.code) temp.upperCase = true;
      if (temp.upperCase) {
        // 归为一串
        temp.code += char;
      } else {
        // 前后拆分
        res.push(temp);
        temp = { code: char, upperCase: true };
      }
    }
  }
  res.push(temp);
  return res;
}

function camelCase(code: string, index: boolean | number) {
  if (index) return code.slice(0, 1).toUpperCase() + code.slice(1);
  else return code;
}
function pascalCase(code: string) {
  return code.slice(0, 1).toUpperCase() + code.slice(1);
}
function kebabCase(code: string, index: boolean | number) {
  if (index) return `-${code}`;
  else return code;
}
function snakeCase(code: string, index: boolean | number) {
  if (index) return `_${code}`;
  else return code;
}
/** 使用前需要用`splitVar`分割字符串 */
export function caseConvert(
  caseToken: VarCase[],
  type: validCaseType | string,
  options?: { keepUpperCase?: boolean; ignoreNumber?: boolean }
) {
  const { keepUpperCase = false, ignoreNumber = false } = options || {};
  let res = '';
  caseToken.forEach((token, index) => {
    let { code } = token;
    if (token.number && ignoreNumber) return;
    if (!keepUpperCase && !token.number) code = code.toLowerCase();
    // 驼峰 / 大驼峰 / 全大写
    if (type.includes('camel')) code = camelCase(code, index);
    else if (type.includes('pascal')) code = pascalCase(code);
    else if (type.includes('upper')) code = code.toUpperCase();
    // 串行 / 蛇形
    if (type.includes('kebab')) code = kebabCase(code, index);
    else if (type.includes('snake')) code = snakeCase(code, index);
    res += code;
  });
  return res;
}
