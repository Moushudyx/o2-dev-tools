/*
 * @Author: moushu
 * @Date: 2024-09-10 13:49:08
 * @LastEditTime: 2024-10-08 15:06:57
 * @Description: iconfont 相关方法
 * @FilePath: \o2-dev-tools\pages\IconFont\utils.ts
 */
import { defer } from 'salt-lib';
import { loadAsync } from 'jszip';

/** 获取文件扩展名在 CSS 中应该叫什么 */
export function getFormatString(fileType: string) {
  const map: { [type: string]: string } = {
    ttf: 'truetype',
  };
  return map[fileType] || fileType;
}
/** 截取 CSS 中配置部分 */
export function cutCss(css: string) {
  return css.slice(Math.max(0, css.indexOf('.iconfont')));
}
/** 文件转字符串 */
export function readAsTxt(file: File) {
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
}
/**
 * 根据字体文件名获取字体类型
 */
export function getFontType(fileName: string) {
  if (/\.ttf$/i.test(fileName)) return 'ttf';
  if (/\.otf$/i.test(fileName)) return 'otf';
  if (/\.woff2$/i.test(fileName)) return 'woff2';
  if (/\.woff$/i.test(fileName)) return 'woff';
  return 'ttf';
}
/**
 * 处理字体文件的 Base64 字符串
 */
export function cutFontBase(base: string, fontType: string) {
  const sliceIndex = base.indexOf('base64,');
  const prefix = `data:font/${fontType};charset=utf-8;`;
  if (sliceIndex > -1) {
    return `${prefix}${base.slice(sliceIndex)}`;
  } else return `${prefix}base64,${base}`;
}
/**
 * 文件转 Base64
 */
export function readAsBase64(file: File) {
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
}
/**
 * 字体文件转 Base64
 */
export async function font2Base64(file: File) {
  return cutFontBase(await readAsBase64(file), getFontType(file.name));
}
/** 从文件列表中找到 iconfont.css */
export function getIconFontCss(fileNameList: string[]) {
  for (const fileName of fileNameList) {
    if (/(^|[\/\\])iconfont\.css/i.test(fileName)) {
      return fileName;
    }
  }
  return '';
}
/** 从文件列表中找到 iconfont 的字体文件 */
export function getIconFontFile(fileNameList: string[], fileType = 'ttf') {
  const reg = new RegExp(`\\.${fileType}$`, 'i');
  for (const fileName of fileNameList) {
    if (reg.test(fileName)) {
      return fileName;
    }
  }
  for (const fileName of fileNameList) {
    if (/\.ttf$/.test(fileName)) {
      return fileName;
    }
  }
  return '';
}
/** 从 .zip 中找到 iconfont.css 和字体文件并读取为字符串和 Base64 字符串 */
export async function readZip(file: File, fileType = 'ttf') {
  const res = { css: '', base: '', type: '' };
  const zip = await loadAsync(file);
  const fileList = Object.keys(zip.files);
  const cssFile = getIconFontCss(fileList);
  // console.log('readZip cssFile', cssFile);
  if (cssFile) res.css = cutCss(await zip.files[cssFile].async('string'));
  const fontFile = getIconFontFile(fileList, fileType);
  fileType = getFontType(fontFile); // 可能获取到的不是目标格式的
  // console.log('readZip fontFile', fontFile);
  // console.log('readZip fileType', fileType);
  if (fontFile) {
    res.base = cutFontBase(await zip.files[fontFile].async('base64'), fileType);
    res.type = fileType;
  }
  return res;
}
/** 合并 CSS 和 BASE64 为最终 CSS */
export function getFinalCss(options: {
  base: string;
  css: string;
  type: string;
  fontName: string;
  className: string;
  presetFontName: string;
  presetClassName: string;
}) {
  const { base, css, type, fontName, className, presetFontName, presetClassName } = options;
  const format = getFormatString(type);
  let c = css;
  if (fontName && fontName !== presetFontName)
    c = c.replace(new RegExp(`:\\s?["']${presetFontName}["']`), `: '${fontName}'`);
  if (className && className !== presetClassName)
    c = c.replace(new RegExp(`\\.${presetClassName}\\s*\\{`), `.${className} {`);
  return `@font-face {
  font-family: '${fontName}';
  src: url('${base}') format('${format}');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}\n
${c}`;
}
