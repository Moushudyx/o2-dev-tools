/*
 * @Author: Moushu
 * @Date: 2022-03-10 13:33:18
 * @Description: 路由之外的容器
 */
import React from 'react';
import { useNavigate, useResolvedPath, useMatch } from 'react-router-dom';
import { useNightMode } from 'Utils/utils';
import { MenuItemSetting, menus } from 'Pages/routers';
import styles from './index.mod.scss';

const MenuItem: React.FC<{ setting: MenuItemSetting }> = (props) => {
  const { setting } = props;
  const nav = useNavigate();
  const resolved = useResolvedPath(setting.link);
  const match = useMatch({ path: resolved.pathname, end: true });
  return (
    <div
      className={`${styles['left-menu-item']}${match ? ' active' : ''}`}
      onClick={() => {
        if (!match) nav(setting.link, setting.options);
      }}
    >
      {setting.name}
    </div>
  );
};

const Container: React.FC = (props) => {
  const [isNight, setNight] = useNightMode();
  const ToggleNight = (
    <div
      className={styles['toggle-night']}
      onClick={() => setNight(!isNight)}
      title={isNight ? '点击进入明亮模式' : '点击进入深色模式'}
    >
      {isNight ? '🌙' : '☀️'}
    </div>
  );
  const Menu = (
    <div className={styles['left-menu']}>
      {menus.map((menu) => (
        <MenuItem key={menu.link} setting={menu} />
      ))}
    </div>
  );
  return (
    <div className={styles.container}>
      {ToggleNight}
      {Menu}
      <div className={styles['right-section']}>{props.children}</div>
    </div>
  );
};

export default Container;
