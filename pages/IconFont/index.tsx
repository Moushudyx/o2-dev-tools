/*
 * @Author: moushu
 * @Date: 2023-03-30 16:59:03
 * @LastEditTime: 2024-09-10 15:07:52
 * @Description: file content
 * @FilePath: \o2-dev-tools\pages\IconFont\index.tsx
 */
import { Collapse, Container, Field, Para, SubTitle } from 'Components/Typo';
import React, { useMemo, useReducer, useState } from 'react';
import { read, write } from 'salt-lib';
import { copy } from 'Utils/utils';
import { cutCss, font2Base64, getFinalCss, getFontType, readAsTxt, readZip } from './utils';
import './index.scss';

const storageKey = 'IconFont';

const defaultValue = {
  css: '',
  base: '',
  out: '',
  type: '',
};
const presetFontName = 'iconfont';
const defaultFontName = read(`${storageKey}-fontName`, presetFontName);
const presetClassName = 'iconfont';
const defaultClassName = read(`${storageKey}-className`, presetClassName);

const defaultType = read(`${storageKey}-fontType`, 'ttf');

const IconFont = () => {
  const [fontName, setFontName] = useState(defaultFontName);
  const [className, setClassName] = useState(defaultClassName);
  const [fileType, setFileType] = useState(defaultType);
  const [state, dispatch] = useReducer(
    (preState: typeof defaultValue, action: Partial<typeof defaultValue>) => {
      const res = { ...preState, ...action };
      if (res.css && res.base)
        res.out = getFinalCss({ ...res, fontName, className, presetFontName, presetClassName });
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
        } else if (/\.ttf2?$/i.test(file.name) || /\.woff2?$/i.test(file.name)) {
          map.base = await font2Base64(file);
          map.type = getFontType(file.name);
        } else if (/\.zip$/i.test(file.name)) {
          const { css, base, type } = await readZip(file, fileType);
          if (css) map.css = css;
          if (base) {
            map.base = base;
            map.type = type;
          }
        }
      }
      dispatch(map);
    },
    []
  );
  return (
    <>
      <Container className="icon-font-tool">
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
        <Para>本工具不会像其他工具一样缓存数据，关闭页面前请手动转移数据</Para>
        <Para style={{ display: 'flex', flexWrap: 'wrap' }}>
          <Field style={{ width: '50%', display: 'flex' }}>
            <label>字体名(修改后需重新上传文件)</label>
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
            <label>类名(修改后需重新上传文件)</label>
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
          <Field style={{ width: '50%', display: 'flex' }}>
            优先匹配:&nbsp;
            {['ttf', 'otf', 'woff', 'woff2'].map((type) => (
              <span
                className={`type-btn ${fileType === type ? 'active' : ''}`}
                role="button"
                onClick={() => {
                  write(`${storageKey}-fontType`, type);
                  setFileType(type);
                }}
              >
                <span className="type-btn-icon">{fileType === type ? '📖' : '📘'}</span>
                {type.toUpperCase()}
              </span>
            ))}
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
