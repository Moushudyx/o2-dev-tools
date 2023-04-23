import { download } from 'Utils/utils';
import JSZip from 'jszip';

/*
 * @Author: shuyan.yin@hand-china.com
 * @Date: 2023-04-23 10:43:39
 * @LastEditTime: 2023-04-23 11:19:35
 * @LastEditors: shuyan.yin@hand-china.com
 * @Description: file content
 * @FilePath: \o2-dev-tools\pages\Console\PlatformApi\fileUtils.ts
 */
export type FileData = {
  fullPath: string;
  raw: string;
  convert: string;
  needConvert: boolean;
  problem: boolean;
};
export type FileTree = {
  children?: { [path: string]: FileTree };
  data?: FileData;
  needConvert: boolean;
  problem: boolean;
};

export function convertFileTree(data: { [path: string]: FileData }): FileTree {
  const tree: FileTree = { children: {}, needConvert: false, problem: false };
  const findPath = (path: string, needConvert: boolean, problem: boolean): FileTree => {
    const paths = path.split('/');
    let t = tree;
    for (const p of paths) {
      if (needConvert) t.needConvert = needConvert;
      if (problem) t.problem = problem;
      if (!t.children) t.children = { [p]: { needConvert, problem } };
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      else if (!t.children[p]) t.children[p] = { needConvert, problem };
      t = t.children[p];
    }
    return t;
  };
  Object.keys(data).forEach((p) => {
    findPath(p, data[p].needConvert, data[p].problem).data = data[p];
  });
  return tree;
}
export type ConvertZipFileOptions = { includeNoChangeFiles?: boolean };
export function convertZipFile(tree: FileTree, options?: ConvertZipFileOptions) {
  const zip = new JSZip();
  _convertZipFile(tree, zip, options || {});
  return zip;
}
function _convertZipFile(tree: FileTree, zip: JSZip, options: ConvertZipFileOptions) {
  if (!tree.needConvert && !options.includeNoChangeFiles) return;
  if (tree.data) {
    const data = tree.needConvert ? tree.data.convert : tree.data.raw;
    zip.file(tree.data.fullPath, data, { createFolders: true });
  } else if (tree.children) {
    Object.keys(tree.children).forEach((path) => {
      _convertZipFile(tree.children![path], zip, options);
    })
  }
}

export async function saveZip(zip: JSZip){
  const blobs = await zip.generateAsync({type:"blob"})
  const fileName = `BBC改造-代码转换${Date.now().toString(32)}.zip`
  const file = new File([blobs], fileName)
  download(file)
}
