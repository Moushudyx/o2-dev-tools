/*
 * @LastEditTime: 2023-06-12 11:59:28
 * @Description: 打包到 dist
 */
const outFile = 'dist/bundle.js';
const outMinFile = 'dist/bundle.min.js';

const { packs } = require('./setting');

const commonBuild = (pack) => ({
  props: {
    outfile: outFile,
    minify: false,
    ...pack,
  },
  define: {
    __DEV__: 'false',
    'process.env.NODE_ENV': '"production"',
  },
});
const minifyBuild = (pack) => {
  const cp = commonBuild(pack);
  return {
    props: {
      ...cp.props,
      outfile: cp.props.outfile.replace(/\.(\S?js)$/i, '.min.$1'),
      minify: true,
    },
    define: {
      ...cp.define,
    },
  };
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
  for (const pack of packs) {
    console.log($P(' BUNDLE ', 'b', 'white', 'cyanbg'), '正在打包');
    start = Date.now();
    const props = commonBuild(pack);
    await core(props);
    end = Date.now();
    console.log(
      $P(' SUCCED ', 'b', 'white', 'greenbg'),
      '完成打包: ',
      $P(props.props.outfile, 'b'),
      $P(` ${end - start}ms`, 'grey')
    );
  }
  // ------------------------------------------------------------------------------
  for (const pack of packs) {
    console.log($P(' BUNDLE ', 'b', 'white', 'cyanbg'), '正在打包（代码压缩）');
    start = Date.now();
    const props = minifyBuild(pack);
    await core(props);
    end = Date.now();
    console.log(
      $P(' SUCCED ', 'b', 'white', 'greenbg'),
      '完成打包（代码压缩）: ',
      $P(props.props.outfile, 'b'),
      $P(` ${end - start}ms`, 'grey')
    );
  }
})();
