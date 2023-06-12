/*
 * @Author: shuyan.yin@hand-china.com
 * @Date: 2023-06-12 11:41:05
 * @LastEditTime: 2023-06-12 11:46:33
 * @LastEditors: shuyan.yin@hand-china.com
 * @Description: file content
 * @FilePath: \o2-dev-tools\script\setting.js
 */
module.exports = {
  packs: [
    { outfile: 'docs/dist/index.js' },
    {
      entryPoints: ['src/polyfill.ts'],
      outfile: 'docs/dist/polyfill.js',
    },
  ],
};
