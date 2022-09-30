/*
 * @LastEditTime: 2022-01-15 15:02:38
 * @Description: ESLint 推荐代码实践
 */
const 报错 = 'error';
const 警告 = 'warn';
// const 总是 = 'always';
const 智能 = 'smart';
const 按需 = 'as-needed';

module.exports = {
  // 报错问题
  'block-scoped-var': 报错, // 强制把变量的使用限制在其定义的作用域范围内
  'eqeqeq': [报错, 智能], // 要求使用 === 和 !==
  'max-nested-callbacks': [报错, 8], // 回调函数最大套娃深度
  'no-caller': 报错, // 禁用 arguments.caller 或 arguments.callee
  'no-case-declarations': 报错, // 禁止在 case 中声明变量
  'no-confusing-arrow': 报错, // 禁止在可能与比较操作符相混淆的地方使用箭头函数
  'no-delete-var': 报错, // 禁止删除变量
  'no-div-regex': 报错, // 禁止使用看起来像除法的正则表达式
  'no-global-assign': 报错, // 禁止对原生对象或只读的全局对象进行赋值
  'no-label-var': 报错, // 禁止标签和变量同名
  'no-nonoctal-decimal-escape': 报错, // 禁用 `\8` 和 `\9` 之类无意义转义序列
  'no-octal': 报错, // 禁用八进制字面量
  'no-redeclare': 报错, // 禁止多次声明同一变量
  'no-regex-spaces': 报错, // 禁止正则表达式中出现连续空格
  'no-shadow-restricted-names': 报错, // 禁止占用关键字
  'no-throw-literal': 报错, // 禁止把字面量当异常抛出
  'no-undef-init': 报错, // 禁止把 undefined 当变量初始值
  'no-useless-catch': 报错, // 禁用无用的 catch 块
  'no-var': 报错, // 禁用 var
  'no-with': 报错, // 禁用 with
  // 'yoda': 报错, // 禁用 Yoda 条件表达式 (字面量 === 变量) 参考星球大战里尤达大师的说话方式
  // 警告内容
  'arrow-body-style': [警告, 按需], // 尽量使用没有 return 关键字的箭头函数
  'complexity': [警告, 16], // 指定程序中允许的最大环路复杂度，10 以上便有出错风险，建议设置在 20 以下
  'grouped-accessor-pairs': 警告, // 对象和类中的 getter、setter 等成对出现时，需要写在一起
  'max-depth': [警告, 10], // 语句块的最大套娃深度
  'max-lines': [警告, 256], // 单个代码文件最大行数
  'max-params': [警告, 4], // 函数定义中最多有几个参数
  'no-alert': 警告, // 别用 alert、confirm 和 prompt
  'no-console': 警告, // 记得删 console
  'no-eval': 警告, // 别用 eval()
  'no-extra-bind': 警告, // 注意不必要的 .bind() 调用
  'no-extra-label': 警告, // 注意不必要的标签
  'no-extra-semi': 警告, // 注意不必要的分号
  'no-implied-eval': 警告, // 别用隐式 eval()
  'no-lonely-if': 警告, // 别让 if 语句作为唯一语句出现在 else 语句块中
  'no-multi-str': 警告, // 尽量要用斜杠换行的字符串字面量
  'no-return-await': 警告, // 去掉不必要的 return await
  'no-unneeded-ternary': 警告, // 尽量简化三元表达式
  'no-unused-labels': 警告, // 尽量删除用不到的标签
  'prefer-const': 警告, // 常量尽量用 const 声明
  'prefer-destructuring': 警告, // 从数组和对象中获取数据时尽量用解构赋值
  'prefer-rest-params': 警告, // 使用剩余参数而非 arguments
  'prefer-template': 报错, // 使用模板字符串合成字符串
};
