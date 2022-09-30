/*
 * @LastEditTime: 2022-09-30 14:56:15
 * @Description: 打包到 dist
 */
const outFile = 'dist/bundle.js';
const outMinFile = 'dist/bundle.min.js';

const commonBuild = {
  props: {
    outfile: outFile,
    minify: false,
  },
  define: {
    __DEV__: 'false',
    'process.env.NODE_ENV': '"production"',
  },
};
const minifyBuild = {
  props: {
    ...commonBuild.props,
    minify: true,
  },
  define: {
    ...commonBuild.define,
  },
};

const core = require('./tools/core');
const $P = require('./tools/format-print');
const $T = require('./tools/format-time');

((argus) => {
  argus.forEach((argv) => {
    if (argv === '--hash') {
      commonBuild.define['process.env.HISTORY'] = '"hash"';
      console.log($P('以哈希路由模式打包', 'grey'));
    }
  });
})(process.argv.slice(2));

console.log($P("MouShu's scaffold - bundle " + $T(), 'grey'));

(async () => {
  let start, end;
  console.log($P(' BUNDLE ', 'b', 'white', 'cyanbg'), '正在打包');
  start = Date.now();
  await core(commonBuild);
  end = Date.now();
  console.log(
    $P(' SUCCED ', 'b', 'white', 'greenbg'),
    '完成打包: ',
    $P(outFile, 'b'),
    $P(` ${end - start}ms`, 'grey')
  );
  // ------------------------------------------------------------------------------
  console.log($P(' BUNDLE ', 'b', 'white', 'cyanbg'), '正在打包（代码压缩）');
  start = Date.now();
  await core(minifyBuild);
  end = Date.now();
  console.log(
    $P(' SUCCED ', 'b', 'white', 'greenbg'),
    '完成打包（代码压缩）: ',
    $P(outMinFile, 'b'),
    $P(` ${end - start}ms`, 'grey')
  );
})();
