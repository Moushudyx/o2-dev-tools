/*
 * @LastEditTime: 2022-03-16 17:07:24
 * @Description: “关于”页面
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { useNightMode } from 'Utils/utils';
import style from './index.module.scss';

export default () => {
  const [isNight, setNight] = useNightMode();
  return (
    <div className={style['demo']}>
      <div
        className={style['toggle-night']}
        onClick={() => setNight(!isNight)}
        title={isNight ? '点击进入明亮模式' : '点击进入深色模式'}
      >
        {isNight ? '🌙' : '☀️'}
      </div>
      13121231231231231
      <Link to="/">跳转到主页</Link>
    </div>
  );
};
