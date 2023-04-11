/*
 * @Author: shuyan.yin@hand-china.com
 * @Date: 2023-04-10 18:12:06
 * @LastEditTime: 2023-04-11 11:15:43
 * @LastEditors: shuyan.yin@hand-china.com
 * @Description: file content
 * @FilePath: \o2-dev-tools\pages\Console\PlatformApi\BatchConvert.tsx
 */
import React, { useState } from 'react';
import { Para, Field } from 'Components/Typo';
import { defer } from 'salt-lib';
import { codeConvert, needConvert } from './codeConvert';
import { copy } from 'Utils/utils';
import styles from './index.mod.scss';

type FileData = { fullPath: string; raw: string; convert: string; needConvert: boolean };
type FileTree = { children?: { [path: string]: FileTree }; data?: FileData; needConvert: boolean };

const validFileReg = /\.([tj]sx?|m[tj]s)$/i;

const convertFileTree = (data: { [path: string]: FileData }): FileTree => {
  const tree: FileTree = { children: {}, needConvert: false };
  const findPath = (path: string, needConvert: boolean): FileTree => {
    const paths = path.split('/');
    let t = tree;
    for (const p of paths) {
      if (needConvert) t.needConvert = needConvert;
      if (!t.children) t.children = { [p]: { needConvert } };
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      else if (!t.children[p]) t.children[p] = { needConvert };
      t = t.children[p];
    }
    return t;
  };
  Object.keys(data).forEach((p) => {
    findPath(p, data[p].needConvert).data = data[p];
  });
  return tree;
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

const FileTreeNode = (props: {
  fileTree: FileTree;
  name: string;
  depth: number;
  handleClick: (data: FileData) => unknown;
}) => {
  const { fileTree, name, depth, handleClick } = props;
  const { children = {}, data, needConvert: treeNeedConvert } = fileTree;
  const [collapse, setCollapse] = useState(depth > 1);
  if (data) {
    return (
      <Field className={styles['file-tree-file']} onClick={() => handleClick(data)}>
        <label>
          {name}
          {data.needConvert && '🍉'}
        </label>
      </Field>
    );
  } else {
    const childrenList = Object.keys(children).map((n) => (
      <FileTreeNode
        key={n}
        fileTree={children[n]}
        name={n}
        depth={depth + 1}
        handleClick={handleClick}
      />
    ));
    return (
      <Field
        className={`${styles['file-tree-dir']} ${collapse ? styles['file-tree-dir-collapse'] : ''}`}
      >
        <label title={collapse ? '点击展开' : '点击收起'} onClick={() => setCollapse(!collapse)}>
          {name}
          {collapse && `(${childrenList.length})`}
          {treeNeedConvert && '🍊'}
        </label>
        {childrenList}
      </Field>
    );
  }
};

const BatchConvert = () => {
  const [txt, setTxt] = useState('');
  const [name, setName] = useState('');
  const [hide, setHide] = useState(false);
  const [fileList, setFileList] = useState({} as FileTree);
  const handleChange = async (list: File[]) => {
    const map = {} as { [path: string]: FileData };
    for (const file of list) {
      const { webkitRelativePath: fullPath } = file;
      if (!validFileReg.test(fullPath)) continue;
      const raw = await readAsTxt(file);
      const nc = needConvert(raw);
      const convert = nc ? codeConvert(raw)[0] : raw;
      map[fullPath] = { fullPath, raw, convert, needConvert: nc };
    }
    setFileList(convertFileTree(map));
    if (name in map) {
      setTxt(map[name].convert);
    } else {
      setTxt('');
      setName('');
    }
  };
  const renderFileList = ((fileList: FileTree) => {
    const handleClick = ({ fullPath, convert, needConvert }: FileData) => {
      if (hide && !needConvert) return;
      setName(fullPath);
      setTxt(convert);
    };
    return (
      <Para className={`${styles['file-tree']} ${hide ? styles['file-tree-hide'] : ''}`}>
        <FileTreeNode fileTree={fileList} name={'..'} depth={0} handleClick={handleClick} />
      </Para>
    );
  })(fileList);
  return (
    <>
      <Para>
        上传文件夹，此工具将自动辨认哪些文件需要处理（仅处理<code>.js</code>、<code>.ts</code>、
        <code>.jsx</code>、<code>.tsx</code>等代码文件）
      </Para>
      <Para>注：🍊，此文件夹有需要处理的文件；🍉，此文件需要处理</Para>
      <Para>
        <Field>
          <label>上传文件夹</label>
          <input
            type="file"
            name="dir"
            multiple
            // @ts-ignore
            webkitdirectory="" // 必须这么写，很奇怪.jpg
            onChange={(ev) => {
              const list = Array.from((ev.target as HTMLInputElement).files || []);
              void handleChange(list);
            }}
          />
        </Field>
      </Para>
      {renderFileList}
      <Para>
        <Field>
          <label>
            {name}
            <span className={styles['span-btn']} onClick={() => copy(txt)} title="复制">
              📋复制
            </span>
          </label>
          <textarea value={txt} />
        </Field>
      </Para>
    </>
  );
};

export default BatchConvert;
