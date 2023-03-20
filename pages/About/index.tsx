/*
 * @LastEditTime: 2023-03-20 11:32:29
 * @Description: “关于”页面
 */
import React from 'react';
import { Link } from 'react-router-dom';
import style from './index.module.scss';

export default () => {
  return (
    <div className={style['demo']}>
      <Link to="/">跳转到主页</Link>
    </div>
  );
};
