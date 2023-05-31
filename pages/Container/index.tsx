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
import { Collapse } from 'Components/Typo';

const GroupItem: React.FC<{ menus: MenuItemSetting[] }> = (props) => {
  const { menus } = props;
  return (
    <>
      {menus.map((menu) => (
        <MenuItem key={menu.isGroup ? menu.name : menu.link} setting={menu} />
      ))}
    </>
  );
};

const MenuItem: React.FC<{ setting: MenuItemSetting }> = (props) => {
  const { setting } = props;
  const { name, isGroup } = setting;
  if (isGroup) {
    const { children } = setting;
    return (
      <Collapse
        header={name}
        headerContainerProps={{ style: { height: '2em', padding: '0 0 0 12px' } }}
        bodyProps={{ style: { padding: '2px 0 2px 12px' } }}
      >
        <GroupItem menus={children} />
      </Collapse>
    );
  } else {
    const { link, options } = setting;
    const nav = useNavigate();
    const resolved = useResolvedPath(link);
    const match = useMatch({ path: resolved.pathname, end: true });
    return (
      <div
        className={`${styles['left-menu-item']}${match ? ' active' : ''}`}
        onClick={() => {
          if (!match) nav(link, options);
        }}
      >
        {name}
      </div>
    );
  }
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
      <GroupItem menus={menus} />
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
