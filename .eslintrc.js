/*
 * @LastEditTime: 2022-01-13 17:33:19
 * @Description: file content
 */
// 使用说明：
// 1、规则都放在 settings 文件夹里
// 2、尽量不要直接在这个文件加规则
// 常见问题检查
const commonLint = require('./settings/eslint-common');
// 推荐代码实践
const suggestLint = require('./settings/eslint-suggest');
// 代码格式检查
const formatLint = require('./settings/eslint-format');
// 代码格式检查
const tsLint = require('./settings/eslint-typescript');

module.exports = {
  parser: '@typescript-eslint/parser',
  overrides: [
    {
      files: ['*.ts', '*.tsx'], // Your TypeScript files extension
      parserOptions: {
        project: ['./tsconfig.json'], // Specify it only for TypeScript files
      },
      rules: {
        ...commonLint,
        ...suggestLint,
        ...formatLint,
        ...tsLint,
      },
    },
  ],
  plugins: ['@typescript-eslint'],
  rules: {
    ...commonLint,
    ...suggestLint,
    ...formatLint,
  },
  env: {
    browser: true,
    node: true,
  },
};
