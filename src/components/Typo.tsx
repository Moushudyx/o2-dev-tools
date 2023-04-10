/*
 * @Author: MouShu
 * @Date: 2022-03-16 16:44:34
 * @Description: 基本样式
 */
import React, { FC, HTMLAttributes } from 'react';
import './Typo.scss';

const combineProps = function <T>(props: HTMLAttributes<T>, className: string): HTMLAttributes<T> {
  return { ...props, className: `${props.className || ''} ${className}`, children: undefined };
};

export const Container: FC<HTMLAttributes<HTMLDivElement>> = (props) => (
  <div {...combineProps(props, 'demo-typo-container')}>{props.children}</div>
);

export const Title: FC<HTMLAttributes<HTMLHeadingElement>> = (props) => (
  <h2 {...combineProps(props, 'demo-typo-title')}>{props.children}</h2>
);

export const SubTitle: FC<HTMLAttributes<HTMLHeadingElement>> = (props) => (
  <h3 {...combineProps(props, 'demo-typo-sub-title')}>{props.children}</h3>
);

export const SubLine: FC<HTMLAttributes<HTMLHeadingElement>> = (props) => (
  <h3 {...combineProps(props, 'demo-typo-sub-line')}>{props.children}</h3>
);

export const Para: FC<HTMLAttributes<HTMLDivElement>> = (props) => (
  <div {...combineProps(props, 'demo-typo-text')}>{props.children}</div>
);

export const Field: FC<HTMLAttributes<HTMLDivElement>> = (props) => (
  <div {...combineProps(props, 'demo-typo-field')}>{props.children}</div>
);
