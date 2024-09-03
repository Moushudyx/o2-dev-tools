/*
 * @Author: shuyan.yin@hand-china.com
 * @Date: 2024-08-13 10:33:31
 * @LastEditTime: 2024-08-13 15:39:22
 * @Description: PNG 图片配置
 * @FilePath: \o2-dev-tools\pages\General\ImgCompress\components\PngOptions.tsx
 */
import React, { useEffect, useReducer } from 'react';
import { read, write } from 'salt-lib';
import { Field, Para } from 'Components/Typo';
import Switch from 'Components/Switch';
import { clamp } from 'Utils/utils';
import type { PngEncodeOptions } from 'src/workers/ImgCompress';

export default function PngOptions(props: {
  options: React.MutableRefObject<{ png: Partial<PngEncodeOptions> }>;
  storageKey: string;
  style?: React.CSSProperties;
}) {
  const [state, dispatch] = useReducer(
    (preState: PngEncodeOptions, action: Partial<PngEncodeOptions>) => {
      for (const key of Object.keys(action)) {
        write(`${props.storageKey}-png-${key}`, action[key as keyof PngEncodeOptions]);
      }
      const res = { ...preState, ...action };
      props.options.current.png = res;
      return { ...res };
    },
    {
      level: read(`${props.storageKey}-png-level`, 2),
      interlace: read(`${props.storageKey}-png-interlace`, false),
      optimiseAlpha: read(`${props.storageKey}-png-optimiseAlpha`, false),
    }
  );
  useEffect(() => {
    props.options.current.png = { ...state };
  }, []);
  const bindValue: <T extends keyof PngEncodeOptions>(key: T) => { value: PngEncodeOptions[T] } = (
    key
  ) => ({
    value: state[key],
    onInput: (ev: { target: EventTarget | null }) => {
      const { target } = ev;
      if (!target || !('value' in target)) return;
      dispatch({ [key]: validate(key, target.value as PngEncodeOptions[typeof key]) });
    },
  });

  const validate: <T extends keyof PngEncodeOptions>(
    key: T,
    value: PngEncodeOptions[T] | null
  ) => PngEncodeOptions[T] = (key, value) => {
    switch (key) {
      case 'level':
        return clamp(value, 1, 6) as PngEncodeOptions[typeof key];
      case 'interlace':
      case 'optimiseAlpha':
        return Boolean(value) as PngEncodeOptions[typeof key];
    }
    throw new Error(`未知类型: ${key}`);
  };

  return (
    <Para className="form col-3" style={{ ...props.style }}>
      <Field title="1~6 越高越能压缩(也越慢)，默认为 2，最好不要超过 4">
        <label>压缩等级</label>
        <input type="number" {...bindValue('level')}></input>
      </Field>
      <Field title="一般会导致体积增大，一般为否；效果是浏览器展示时先隔行下载一半展示出来，再下载另一半">
        <label>交错模式</label>
        <Switch {...bindValue('interlace')}></Switch>
      </Field>
      <Field title="优化透明通道的排布，一般为否">
        <label>压缩透明区域</label>
        <Switch {...bindValue('optimiseAlpha')}></Switch>
      </Field>
    </Para>
  );
}
