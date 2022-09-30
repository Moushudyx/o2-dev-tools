/*
 * @LastEditTime: 2021-12-09 14:29:53
 * @Description: ESLint 常见问题
 */
const 报错 = 'error';
const 警告 = 'warn';

module.exports = {
  // 报错问题
  'constructor-super': 报错, // 强制构造函数调用 super
  'getter-return': 报错, // 强制 getter 函数中使用 return
  'no-async-promise-executor': 报错, // 禁止往 Promise() 里面塞异步函数
  'no-cond-assign': 报错, // 禁止 if 等条件表达式里用 = 赋值
  'no-const-assign': 报错, // 禁止给常量重新赋值
  'no-constant-condition': 报错, // 禁止 if 等条件表达式里用字面量
  'no-control-regex': 报错, // 禁止在正则里面匹配 0-31 范围内的特殊、不可见字符)
  'no-dupe-args': 报错, // 禁止重名参数
  'no-dupe-class-members': 报错, // 禁止在类中使用重名属性
  'no-dupe-else-if': 报错, // 禁止在 else if 中使用重复表达式
  'no-dupe-keys': 报错, // 禁止对象字面量中重复属性
  'no-duplicate-case': 报错, // 禁止 case 中使用重复表达式
  'no-empty': 报错, // 禁止出现空语句块
  'no-empty-character-class': 报错, // 禁止在正则中使用空字符集
  'no-empty-pattern': 报错, // 禁止解构寂寞
  'no-ex-assign': 报错, // 禁止对 catch 子句的参数重新赋值
  'no-func-assign': 报错, // 禁止对 function 声明重新赋值
  'no-import-assign': 报错, // 禁止给引入赋值
  'no-inner-declarations': 报错, // 禁止在嵌套的块中出现 var 或 function 声明
  'no-invalid-regexp': 报错, // 禁止在 RegExp() 用无效的正则表达式字符串
  'no-new-symbol': 报错, // 禁止 new 操作符和 Symbol 一起使用
  'no-obj-calls': 报错, // 禁止把全局对象作为函数调用（比如 Math 这种看起来像是方法的全局对象）
  'no-this-before-super': 报错, // 在构造函数中禁止在调用 super() 之前使用 this 或 super
  'no-unexpected-multiline': 报错, // 禁止出现有歧义的多行表达式
  'no-unreachable': 报错, // 禁止在 return、throw、continue 和 break 语句之后出现不可达代码
  'no-unsafe-finally': 报错, // 禁止在 finally 语句块中出现控制流语句
  'no-unsafe-negation': 报错, // 禁止对关系运算符的左操作数使用否定操作符
  'no-unsafe-optional-chaining': 报错, // 禁止可选链直接用于不能有 undefined 的地方
  'no-unused-vars': 报错, // 禁止用不到的变量/常量
  'no-useless-backreference': 报错, // 禁止正则表达式中使用无效的反向引用
  'valid-typeof': 报错, // 强制 typeof 表达式与有效的字符串进行比较
  // 警告内容
  'no-debugger': 警告, // 记得删除 debugger
  'no-duplicate-imports': 警告, // 记得合并重复引入
  'no-fallthrough': 警告, // 注意 case 语句穿透，如果有意为之，请添加 `// fall through` 注释
  'no-irregular-whitespace': 警告, // 注意不规则的空白
  'no-loss-of-precision': 警告, // 注意精度过高的数字，代码运行时会丢失精度
  'no-misleading-character-class': 警告, // 注意字符类语法中出现由多个代码点组成的字符（比如 emoji）
  'no-prototype-builtins': 警告, // 注意 Object.prototypes 的内置属性可能受原型链覆盖
  'no-self-assign': 警告, // 注意不要给自己赋值
  'no-setter-return': 警告, // 注意不要在 setter 里返回值
  'no-sparse-arrays': 警告, // 注意稀疏数组
  'no-template-curly-in-string': 警告, // 注意常规字符串中出现模板字面量占位符语法
  'no-undef': 警告, // 注意未声明的变量
  'no-unmodified-loop-condition': 警告, // 注意不变化的循环条件
  'require-atomic-updates': 警告, // 注意由 await 或 yield 导致的竞态条件的赋值
  'use-isnan': 警告, // 要求使用 isNaN() 检查 NaN
};
