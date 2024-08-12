/*
 * @Author: Moushu
 * @Date: 2023-06-12 11:41:05
 * @LastEditTime: 2024-08-12 15:30:41
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
    {
      entryPoints: ['src/workers/ImgCompress.worker.ts'],
      outfile: 'docs/module/ImgCompress.js',
      banner: { js: 'var $$ImportMetaUrl = (location.origin + location.pathname).replace(/\\/module\\/\\S+/, "") + "/module/";' }
    },
  ],
};
