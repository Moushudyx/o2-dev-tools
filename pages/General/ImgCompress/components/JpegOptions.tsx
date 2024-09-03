/*
 * @Author: moushu
 * @Date: 2024-08-13 15:45:02
 * @LastEditTime: 2024-08-13 16:38:30
 * @Description: JPEG 图片配置
 * @FilePath: \o2-dev-tools\pages\General\ImgCompress\components\JpegOptions.tsx
 */
import React, { useEffect, useReducer } from 'react';
import { read, write } from 'salt-lib';
import { Field, Para } from 'Components/Typo';
import Switch from 'Components/Switch';
import { clamp } from 'Utils/utils';
import type { JpegEncodeOptions } from 'src/workers/ImgCompress';

export default function JpegOptions(props: {
  options: React.MutableRefObject<{ jpeg: Partial<JpegEncodeOptions> }>;
  storageKey: string;
  style?: React.CSSProperties;
}) {
  const [state, dispatch] = useReducer(
    (preState: Partial<JpegEncodeOptions>, action: Partial<JpegEncodeOptions>) => {
      for (const key of Object.keys(action)) {
        write(`${props.storageKey}-jpeg-${key}`, action[key as keyof JpegEncodeOptions]);
      }
      const res = { ...preState, ...action } as Partial<JpegEncodeOptions>;
      props.options.current.jpeg = res;
      return { ...res };
    },
    {
      quality: read(`${props.storageKey}-jpeg-quality`, 75),
      baseline: read(`${props.storageKey}-jpeg-baseline`, false),
      arithmetic: read(`${props.storageKey}-jpeg-arithmetic`, false),
      progressive: read(`${props.storageKey}-jpeg-progressive`, true),
      // optimize_coding: true,
      // smoothing: 0,
      // color_space: 3,
      // quant_table: 3,
      // trellis_multipass: false,
      // trellis_opt_zero: false,
      // trellis_opt_table: false,
      // trellis_loops: 1,
      // auto_subsample: true,
      // chroma_subsample: 2,
      // separate_chroma_quality: false,
      // chroma_quality: 75,
    }
  );
  useEffect(() => {
    props.options.current.jpeg = { ...state };
  }, []);
  const bindValue: <T extends keyof JpegEncodeOptions>(
    key: T
  ) => { value: JpegEncodeOptions[T] } = (key) => ({
    value: state[key] as JpegEncodeOptions[typeof key],
    onInput: (ev: { target: EventTarget | null }) => {
      const { target } = ev;
      if (!target || !('value' in target)) return;
      dispatch({ [key]: validate(key, target.value as JpegEncodeOptions[typeof key]) });
    },
  });

  const validate: <T extends keyof JpegEncodeOptions>(
    key: T,
    value: Partial<JpegEncodeOptions>[T] | null
  ) => JpegEncodeOptions[T] = (key, value) => {
    switch (key) {
      case 'quality':
        return clamp(value, 1, 100) as JpegEncodeOptions[typeof key];
      case 'baseline':
      case 'progressive':
      case 'arithmetic':
        return Boolean(value) as JpegEncodeOptions[typeof key];
    }
    throw new Error(`未知类型: ${key}`);
  };

  return (
    <Para className="form col-3" style={{ ...props.style }}>
      <Field title="1~100 越高品质越好体积越大，默认为 75，太低会导致图片糊掉">
        <label>图片品质</label>
        <input type="number" {...bindValue('quality')}></input>
      </Field>
      <Field title="编译为基线 JPEG，默认为否">
        <label>基线</label>
        <Switch {...bindValue('baseline')}></Switch>
      </Field>
      <Field title="编译为渐进式 JPEG，默认为是">
        <label>渐进式</label>
        <Switch {...bindValue('progressive')}></Switch>
      </Field>
      <Field title="使用算术编码，默认为否">
        <label>算术编码</label>
        <Switch {...bindValue('arithmetic')}></Switch>
      </Field>
    </Para>
  );
}
