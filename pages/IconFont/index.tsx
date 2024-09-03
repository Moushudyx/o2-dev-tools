/*
 * @Author: moushu
 * @Date: 2023-03-30 16:59:03
 * @LastEditTime: 2024-09-03 15:16:05
 * @Description: file content
 * @FilePath: \o2-dev-tools\pages\IconFont\index.tsx
 */
import { Collapse, Container, Field, Para, SubTitle } from 'Components/Typo';
import React, { useMemo, useReducer, useState } from 'react';
import { defer, read, write } from 'salt-lib';
import { loadAsync } from 'jszip';
import { copy } from 'Utils/utils';

const storageKey = 'IconFont';
/** 截取 CSS 中配置部分 */
const cutCss = (css: string) => css.slice(Math.max(0, css.indexOf('.iconfont')));

const cutBase = (base: string) => {
  const sliceIndex = base.indexOf('base64,');
  if (sliceIndex > -1) {
    return `data:font/ttf;charset=utf-8;${base.slice(sliceIndex)}`;
  } else return `data:font/ttf;charset=utf-8;base64,${base}`;
};

const readAsBase64 = (file: File) => {
  const dfd = defer<string>();
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    dfd.resolve(reader.result as string);
  };
  reader.onerror = function () {
    dfd.reject();
  };
  return dfd.promise;
};

const readAsTxt = (file: File) => {
  const dfd = defer<string>();
  const reader = new FileReader();
  reader.readAsText(file);
  reader.onload = function () {
    dfd.resolve(reader.result as string);
  };
  reader.onerror = function () {
    dfd.reject();
  };
  return dfd.promise;
};

const readZip = async (file: File) => {
  const res = { css: '', base: '' };
  const zip = await loadAsync(file);
  const fileList = Object.keys(zip.files);
  for (const fileName of fileList) {
    if (/(^|[\/\\])iconfont\.css/i.test(fileName)) {
      res.css = await zip.files[fileName].async('string');
    } else if (/(^|[\/\\])iconfont\.ttf/i.test(fileName)) {
      res.base = await zip.files[fileName].async('base64');
    }
  }
  return res;
};

const defaultValue = {
  css: '',
  base: '',
  out: '',
};
const presetFontName = 'iconfont';
const defaultFontName = read(`${storageKey}-fontName`, presetFontName);
const presetClassName = 'iconfont';
const defaultClassName = read(`${storageKey}-className`, presetClassName);

/** 合并 CSS 和 BASE64 为最终 CSS */
const getFinalCss = (
  ttfBase64: string,
  css: string,
  fontName: string,
  className: string
) => `@font-face {
  font-family: '${fontName}';
  src: url('${ttfBase64}') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

${css
  .replace(new RegExp(`:\\s?["']${presetFontName}["']`), `: "${fontName}"`)
  .replace(new RegExp(`\\.${presetClassName}\\s?{`), `.${className} {`)}`;

const IconFont = () => {
  const [fontName, setFontName] = useState(defaultFontName);
  const [className, setClassName] = useState(defaultClassName);
  const [state, dispatch] = useReducer(
    (preState: typeof defaultValue, action: Partial<typeof defaultValue>) => {
      const res = { ...preState, ...action };
      if (res.css && res.base) res.out = getFinalCss(res.base, res.css, fontName, className);
      return res;
    },
    { ...defaultValue }
  );
  const handleChange = useMemo(
    () => async (list: File[]) => {
      const map: Partial<typeof defaultValue> = {};
      for (const file of list) {
        if (/\.css$/i.test(file.name)) {
          map.css = cutCss(await readAsTxt(file));
        } else if (/\.ttf2?$/i.test(file.name)) {
          map.base = cutBase(await readAsBase64(file));
        } else if (/\.zip$/i.test(file.name)) {
          const { css, base } = await readZip(file);
          if (css) map.css = cutCss(css);
          if (base) map.base = cutBase(base);
        }
      }
      dispatch(map);
    },
    []
  );
  return (
    <>
      <Container>
        <SubTitle>IconFont 转换工具</SubTitle>
        <Collapse header={<b>使用说明（点击右侧按钮展开详细说明）：</b>} defaultCollapse>
          <Para>在 IconFont 的项目页面点击“下载至本地”按钮下载压缩包</Para>
          <Para>
            <del>
              将压缩包中的<code>iconfont.css</code>和<code>iconfont.ttf</code>解压并上传到这里
            </del>
          </Para>
          <Para>
            将下载的压缩包<code>download.zip</code>直接上传到这里
          </Para>
          <Para>最下面的文本框中的内容就是拼接后的样式表</Para>
        </Collapse>
        <hr />
        <Para style={{ display: 'flex', flexWrap: 'wrap' }}>
          <Field style={{ width: '50%', display: 'flex' }}>
            <label>字体名</label>
            <input
              onInput={(ev) => {
                const s = (ev.target as HTMLInputElement).value || '';
                setFontName(s);
                write(`${storageKey}-fontName`, s);
              }}
              value={fontName}
            />
          </Field>
          <Field style={{ width: '50%', display: 'flex' }}>
            <label>类名</label>
            <input
              onInput={(ev) => {
                const s = (ev.target as HTMLInputElement).value || '';
                setClassName(s);
                write(`${storageKey}-className`, s);
              }}
              value={className}
            />
          </Field>
          <Field style={{ width: '50%', display: 'flex' }}>
            <label>上传 download.zip</label>
            <input
              type="file"
              name="css + ttf + zip"
              accept=".css, .ttf, .ttf2, .zip"
              multiple
              onChange={(ev) => {
                const list = Array.from((ev.target as HTMLInputElement).files || []);
                void handleChange(list);
              }}
            />
          </Field>
        </Para>
        <Para>
          <Field>
            <label>IconFont 的 CSS</label>
            <textarea value={state.css}></textarea>
          </Field>
          <Field>
            <label>转换为 BASE64 的字体文件</label>
            <textarea value={state.base}></textarea>
          </Field>
          <Field>
            <label>
              合成后的 CSS
              <span className="span-btn" onClick={() => copy(state.out)} title="复制">
                📋复制
              </span>
            </label>
            <textarea value={state.out}></textarea>
          </Field>
        </Para>
      </Container>
    </>
  );
};

export default IconFont;
