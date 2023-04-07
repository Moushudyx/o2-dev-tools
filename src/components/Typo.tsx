/*
 * @Author: MouShu
 * @Date: 2022-03-16 16:44:34
 * @Description: SCSS 模块功能演示
 */
import React from 'react';
import style from './Typo.mod.scss';

export const Container: React.FC = (props) => (
  <div className={style['demo-container']}>{props.children}</div>
);
export const Title: React.FC = (props) => <h2 className={style['title']}>{props.children}</h2>;
export const SubTitle: React.FC = (props) => (
  <h3 className={style['sub-title']}>{props.children}</h3>
);
export const Para: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => (
  <div
    {...{ ...props, className: `${props.className || ''} ${style['text']}`, children: undefined }}
  >
    {props.children}
  </div>
);
export const Field: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => (
  <div
    {...{ ...props, className: `${props.className || ''} ${style['field']}`, children: undefined }}
  >
    {props.children}
  </div>
);
