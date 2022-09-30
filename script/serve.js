/*
 * @LastEditTime: 2022-09-30 14:53:29
 * @Description: 本地热更新服务
 */
const port = 5000;

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
  await core({
    props: {
      outfile: 'doc/dist/index.js',
      sourcemap: true,
      watch: { onRebuild },
    },
    define: {
      'process.env.HISTORY': '"hash"',
    },
  });
  console.log($P(' SERVE ', 'b', 'white', 'cyanbg'), '编译完成, 开启服务中');
  createServer({
    port: _port,
    pubdir: path.resolve(__dirname, '../doc'),
    quiet: true,
  });
  open(url);
  console.log($P(' SERVE ', 'b', 'white', 'greenbg'), '服务开启, 见:', $P(url, 'b'));
})();
