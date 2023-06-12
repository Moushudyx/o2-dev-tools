/*
 * @LastEditTime: 2023-06-12 11:49:58
 * @Description: 本地热更新服务
 */
const port = 5000;

const { packs } = require('./setting');
const path = require('path');
const core = require('./tools/core');
const $P = require('./tools/format-print');
const $T = require('./tools/format-time');
const { findPort } = require('./tools/port');
const { createServer } = require('serve-http');
const open = require('open');

console.log($P("MouShu's scaffold - serve " + $T(), 'grey'));

(async () => {
  const _port = await findPort(port);
  const url = `http://localhost:${_port}/`;
  const onRebuild = (error) => {
    if (error) {
      console.error($P(' ERROR ', 'b', 'white', 'redbg'), '出现错误', $P($T(), 'grey'));
    } else {
      console.log($P(' WATCH ', 'b', 'white', 'greenbg'), '代码变动, 自动更新', $P($T(), 'grey'));
    }
  };
  for (const pack of packs) {
    const context = await core({
      props: {
        ...pack,
        sourcemap: true,
        minify: true,
        watch: { onRebuild },
      },
      define: {
        __DEV__: 'false',
        'process.env.NODE_ENV': '"production"',
        'process.env.HISTORY': '"hash"',
      },
    });
    await context.watch();
  }
  console.log($P(' SERVE ', 'b', 'white', 'cyanbg'), '编译完成, 开启服务中');
  createServer({
    port: _port,
    pubdir: path.resolve(__dirname, '../docs'),
    quiet: false,
    livereload: true,
  });
  open(url);
  console.log($P(' SERVE ', 'b', 'white', 'greenbg'), '服务开启, 见:', $P(url, 'b'));
})();
