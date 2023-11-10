/*
 * @Author: Moushu
 * @Date: 2023-06-12 11:41:05
 * @LastEditTime: 2023-11-10 09:33:58
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
