/*
 * @Author: shuyan.yin@hand-china.com
 * @Date: 2023-05-31 17:57:20
 * @LastEditTime: 2023-06-01 10:06:36
 * @LastEditors: shuyan.yin@hand-china.com
 * @Description: file content
 * @FilePath: \o2-dev-tools\pages\Console\VersionCompare\DiffInfo.tsx
 */
import React from 'react';
import { Collapse, Field, Para, SubLine } from 'Components/Typo';
import { CompareResult } from './utils';
import styles from './index.mod.scss';
import { copy } from 'Utils/utils';

function Info(props: { text: string; className: string }) {
  const { text, className } = props;
  return (
    <div className={className}>
      <span>{text}</span>
      <span
        className={styles['pack-ver-item-btn']}
        onClick={() => {
          copy(text);
        }}
      >
        📋复制
      </span>
    </div>
  );
}

export function DiffInfo(props: { code: string; info: CompareResult }) {
  const { code, info } = props;
  return (
    <Para key={code}>
      <SubLine>{code}</SubLine>
      {Object.keys(info.add).length ? (
        <Collapse
          header={
            <>
              🍊以下依赖仅出现在<b>左</b>侧包信息中
            </>
          }
        >
          {Object.keys(info.remove).map((name) => (
            <Field className={styles['pack-ver-item']}>
              <Info className={styles['pack-ver-item-name']} text={name} />
              <Info className={styles['pack-ver-item-info']} text={info.remove[name]} />
            </Field>
          ))}
        </Collapse>
      ) : null}
      {Object.keys(info.remove).length ? (
        <Collapse
          header={
            <>
              🍉以下依赖仅出现在<b>右</b>侧包信息中
            </>
          }
        >
          {Object.keys(info.add).map((name) => (
            <Field className={styles['pack-ver-item']}>
              <Info className={styles['pack-ver-item-name']} text={name} />
              <Info className={styles['pack-ver-item-info']} text={info.add[name]} />
            </Field>
          ))}
        </Collapse>
      ) : null}
      {Object.keys(info.change).length ? (
        <Collapse header={<>以下依赖在两个包信息中版本不一致</>}>
          {Object.keys(info.change).map((name) => (
            <Field className={styles['pack-ver-item']}>
              <Info className={styles['pack-ver-item-name']} text={name} />
              <Info className={styles['pack-ver-item-info']} text={info.change[name][0]} />
              <Info className={styles['pack-ver-item-info']} text={info.change[name][1]} />
            </Field>
          ))}
        </Collapse>
      ) : null}
      {!Object.keys(info.add).length &&
        !Object.keys(info.remove).length &&
        !Object.keys(info.change).length && <>没有变化</>}
    </Para>
  );
}
