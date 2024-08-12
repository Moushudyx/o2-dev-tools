/*
 * @Author: moushu
 * @Date: 2024-08-12 09:48:50
 * @LastEditTime: 2024-08-12 11:15:20
 * @Description: 图片对比组件
 * @FilePath: \o2-dev-tools\pages\General\ImgCompress\ImgCompare.tsx
 */
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { read, write } from 'Utils/sessionStorage';
import { Field } from 'Components/Typo';
import './ImgCompare.scss';
import { debounce } from 'Utils/utils';

export default function ImgCompare(props: {
  storageKey: string;
  originSrc?: string;
  minifySrc?: string;
  title?: string;
}) {
  // 里面涉及到 DOM 操作所以需要一个强制更新操作
  const [, _forceUpdate] = useState(1);
  const forceUpdate = useCallback(
    debounce(() => _forceUpdate((i) => i + 1), 66, true),
    []
  );
  // 对比比例
  const [compareWidth, setCompareWidth] = useState<number>(
    read(`${props.storageKey}-compareWidth`, 50)
  );
  // 渲染
  const img = useRef<HTMLImageElement | null>(null);
  const left = useRef('50%');
  useLayoutEffect(() => {
    const el = img.current;
    if (el?.parentElement) {
      const innerW = el.offsetWidth;
      const outerW = el.parentElement.offsetWidth;
      const cw = isNaN(Number(compareWidth)) ? 50 : Number(compareWidth);
      const l = (innerW * cw) / 100 + (outerW - innerW) / 2;
      left.current = `${((l / outerW) * 100).toFixed(4)}%`;
      forceUpdate();
    }
  }, [compareWidth, props.originSrc, img.current, img.current?.offsetWidth]);

  // 拖动状态
  const state = useRef({ isChangeView: false, cw: compareWidth, cx: 0, cy: 0 });
  // 拖动行为
  const onChangeView = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // 先算出之前的位置
    const el = img.current;
    if (!el?.parentElement || !state.current.isChangeView) return;
    const innerW = el.offsetWidth;
    const { cx, /* cy, */ cw } = state.current;
    const dx = e.pageX - cx;
    // const dy = e.pageY;
    // 再获取改变量
    const dw = (dx / innerW) * 100;
    const res = Math.max(Math.min(cw + dw, 100), 0);
    setCompareWidth(res);
  };
  return (
    <Field
      className={`img-compare ${state.current.isChangeView ? 'img-compare-is-change-view' : ''}`}
      style={
        {
          '--img-compare-compare-width': `${compareWidth}%`,
          '--img-compare-line-left': left.current,
          '--img-compare-line-width': `4px`,
        } as React.CSSProperties
      }
      title={props.title}
      // 松开鼠标记录位置
      onMouseUp={() => {
        if (state.current.isChangeView) {
          state.current.isChangeView = false;
          write(`${props.storageKey}-compareWidth`, compareWidth);
          forceUpdate();
        }
      }}
      onMouseMove={onChangeView}
      // 双击恢复
      onDoubleClick={() => {
        setCompareWidth(50);
        write(`${props.storageKey}-compareWidth`, 50);
      }}
    >
      {props.originSrc ? (
        <>
          <div
            onMouseDown={(e) => {
              state.current.isChangeView = true;
              state.current.cw = compareWidth;
              state.current.cx = e.pageX;
              state.current.cy = e.pageY;
            }}
            className={`img-compare-line ${
              state.current.isChangeView ? 'line-is-change-view' : ''
            }`}
          ></div>
          <img ref={img} className="origin-img" src={props.originSrc || ''}></img>
          {props.minifySrc && <img className="minify-img" src={props.minifySrc || ''}></img>}
        </>
      ) : (
        <></>
      )}
    </Field>
  );
}
