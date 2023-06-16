/*
 * @Author: Moushu
 * @Date: 2022-03-10 13:33:18
 * @Description: 路由之外的容器
 */
import React, { ReactElement } from 'react';
import { useNavigate, useResolvedPath, useMatch } from 'react-router-dom';
import { useNightMode } from 'Utils/utils';
import { MenuItemSetting, menus } from 'Pages/routers';
import { Collapse } from 'Components/Typo';
import './index.scss';

const GroupItem: React.FC<{ menus: MenuItemSetting[] }> = (props) => {
  const { menus } = props;
  return (
    <>
      {menus.map((menu) => (
        <MenuItem key={`${menu.name} : ${menu.link}`} setting={menu} />
      ))}
    </>
  );
};

const MenuItem: React.FC<{ setting: MenuItemSetting }> = (props) => {
  const { setting } = props;
  const { name, link, options, children } = setting;
  // 线上不再展示开发中的页面
  if (/[\(\[\{]\s*开发中\s*[\)\]\}]/.test(name) && !/localhost/i.test(location.hostname)) {
    if(link) console.log('菜单', name, '尚未开发完成，你可以手动访问', `#${link}`);
    else console.log('菜单', name, '尚未开发完成，暂时无法访问');
    return <></>;
  }
  let el: ReactElement;
  if (link) {
    const nav = useNavigate();
    const resolved = useResolvedPath(link);
    const match = useMatch({ path: resolved.pathname, end: true });
    el = (
      <div
        className={`left-menu-item ${match ? ' active' : ''}`}
        onClick={() => {
          if (!match) nav(link, options);
        }}
      >
        {name}
      </div>
    );
  } else el = <>{name}</>;
  if (children) {
    el = (
      <Collapse
        header={el}
        headerContainerProps={{ style: { height: '2em', padding: link ? '0' : '0 0 0 12px' } }}
        bodyProps={{ style: { padding: '2px 0 2px 12px' } }}
      >
        <GroupItem menus={children} />
      </Collapse>
    );
  }
  return el;
};

const Container: React.FC = (props) => {
  const [isNight, setNight] = useNightMode();
  const ToggleNight = (
    <div
      className="toggle-night"
      onClick={() => setNight(!isNight)}
      title={isNight ? '点击进入明亮模式' : '点击进入深色模式'}
    >
      {isNight ? '🌙' : '☀️'}
    </div>
  );
  const Menu = (
    <div className="page-container-left-menu">
      <GroupItem menus={menus} />
    </div>
  );
  return (
    <div className="page-container">
      {ToggleNight}
      {Menu}
      <div className="page-container-right-section">{props.children}</div>
    </div>
  );
};

export default Container;
