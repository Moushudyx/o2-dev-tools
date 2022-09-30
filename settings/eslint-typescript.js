/*
 * @LastEditTime: 2022-01-15 14:28:08
 * @Description: typescript 常见问题
 */
const 报错 = 'error';
const 警告 = 'warn';
const 关闭 = 'off';
/** 覆盖 */
const overrides = {
  'no-unused-vars': 关闭, // 禁止用不到的变量/常量
  '@typescript-eslint/no-unused-vars': 报错, // 禁止出现未使用的变量
  'no-redeclare': 关闭, // 禁止多次声明同一变量
  'no-undef': 关闭, // 注意未声明的变量
};

module.exports = {
  // 报错问题
  '@typescript-eslint/adjacent-overload-signatures': 报错, // 规范函数重载的写法
  '@typescript-eslint/ban-types': 报错, // 禁用 String、Number、Object、{} 之类特殊类型
  '@typescript-eslint/no-explicit-any': 报错, // 禁用 anyScript
  '@typescript-eslint/no-extra-non-null-assertion': 报错, // 非空断言之后不能套娃非空断言
  '@typescript-eslint/no-floating-promises': 报错, // 禁用浮动的 Promise
  '@typescript-eslint/no-for-in-array': 报错, // 禁止对数组使用 for in 遍历
  '@typescript-eslint/no-misused-new': 报错, // 规范构造函数接口声明
  '@typescript-eslint/no-misused-promises': 报错, // 禁止将 Promise 本身用作条件判断，应该先 await
  '@typescript-eslint/no-non-null-asserted-optional-chain': 报错, // 禁止在可选链上使用多余的非空断言
  // '@typescript-eslint/no-non-null-assertion': 报错, // 禁用非空断言
  '@typescript-eslint/no-this-alias': 报错, // 禁止使用变量存放 this
  '@typescript-eslint/no-unsafe-argument': 报错, // 禁止将 any 类型传入函数
  '@typescript-eslint/no-unsafe-assignment': 报错, // 禁止将 any 赋值给变量
  '@typescript-eslint/no-unsafe-call': 报错, // 禁止将 any 当作函数调用
  '@typescript-eslint/no-unsafe-member-access': 报错, // 禁止访问成员中类型为 any 的属性
  '@typescript-eslint/no-unsafe-return': 报错, // 禁止返回 any
  '@typescript-eslint/no-array-constructor': 报错, // 禁止用 new Array
  '@typescript-eslint/no-empty-function': 报错, // 禁止使用空函数
  // 警告内容
  '@typescript-eslint/await-thenable': 警告, // await 一个 Promise 而不是字面量
  '@typescript-eslint/no-confusing-non-null-assertion': 警告, // 把函数返回的 void 拿去用
  '@typescript-eslint/no-empty-interface': 警告, // 注意空的接口
  '@typescript-eslint/no-inferrable-types': 警告, // 清理不必要的类型声明
  '@typescript-eslint/no-unnecessary-boolean-literal-compare': 警告, // 不要用 XXX === true 这样的条件表达式
  '@typescript-eslint/no-unnecessary-condition': 警告, // 不要把不可能为非值的表达式当作条件表达式
  '@typescript-eslint/no-unnecessary-type-assertion': 警告, // 注意不必要的断言
  '@typescript-eslint/no-unnecessary-type-constraint': 警告, // 注意不必要的泛型扩展，比如 extends any
  '@typescript-eslint/non-nullable-type-assertion-style': 警告, // 推荐使用非空断言
  '@typescript-eslint/prefer-as-const': 警告, // 值即类型时，推荐使用 as const（例如let a: 'A' = 'A';）
  '@typescript-eslint/prefer-includes': 警告, // 推荐使用 includes 而不是 indexOf
  '@typescript-eslint/prefer-optional-chain': 警告, // 推荐使用可选链而不是成吨的条件判断
  // '@typescript-eslint/restrict-plus-operands': 警告, // 加号两边需要类型一致
  // '@typescript-eslint/restrict-template-expressions': 警告, // 模板字符串的表达式类型限制
  '@typescript-eslint/sort-type-union-intersection-members': 警告, // 类型/接口的参数名按字母排序
  ...overrides,
};