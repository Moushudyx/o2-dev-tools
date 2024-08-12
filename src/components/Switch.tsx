/*
 * @Author: moushu
 * @Date: 2023-06-08 17:19:14
 * @LastEditTime: 2023-06-08 18:08:12
 * @Description: 开关组件
 * @FilePath: \o2-dev-tools\src\components\Switch.tsx
 */
import React, { FC, HTMLAttributes } from 'react';
import { isFunction } from 'salt-lib';
import './Switch.scss';

const combineProps = function <T>(props: HTMLAttributes<T>, className: string): HTMLAttributes<T> {
  return { ...props, className: `${props.className || ''} ${className}`, children: undefined };
};

const Switch: FC<
  HTMLAttributes<HTMLDivElement> & {
    value: boolean;
    onChange?: (ev: React.MouseEvent) => unknown;
    onInput?: (ev: React.MouseEvent) => unknown;
  }
> = function (props) {
  const { children, value, onChange, onInput, ...otherProps } = props;
  return (
    <div
      {...combineProps(otherProps, `demo-switch-container ${value ? 'hide' : 'show'}`)}
      onClick={(ev) => {
        Object.assign(ev.target, { value: !props.value });
        if (isFunction(onChange)) onChange(ev);
        if (isFunction(onInput)) onInput(ev);
      }}
    >
      <div className={`demo-switch ${value ? 'on' : 'off'}`} />
      {children}
    </div>
  );
};

export default Switch;
