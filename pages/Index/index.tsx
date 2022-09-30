/*
 * @LastEditTime: 2022-09-30 15:07:27
 * @Description: 演示页面
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Title, SubTitle, Para } from 'Components/Typo';
import style from './index.module.scss';

export default () => (
  <div className={style['demo']}>
    <Container>
      <Title>简单的脚手架</Title>
      <SubTitle>老船长的自用脚手架</SubTitle>
      <Para>一个 React 的脚手架，使用 ESbuild 作为打包工具；支持 SCSS 和 SCSS 模块。</Para>
      <Para>
        常用指令：
        <code>build</code>，将代码打包到 dist 文件夹中；
        <code>serve</code>，打开本地开发环境；
        <code>lint</code>，检查代码质量。
      </Para>
      <SubTitle>这是一个演示页面</SubTitle>
      <Para>
        <ul>
          <li>
            跨页数据同步：你可以同时打开多个这个页面，然后点击右上角的“昼间/夜间”模式切换按钮。
            可以看到，在任意一个页面切换了夜间模式，其他所有页面都会立即同步。
          </li>
          <li>
            SCSS 支持：包括了基本支持，引入<code>.scss</code>文件作为样式表； CSS 模块支持，引入
            <code>.module.scss</code>文件作为 CSS 模块使用；SCSS 编译支持，引入
            <code>.text.scss</code>将编译结果作为普通的字符串使用。
          </li>
          <li>
            SCSS 文件别名：<code>.module.scss</code>、<code>.mod.scss</code>、<code>.m.scss</code>
            都是 SCSS 模块；而引入<code>.text.scss</code>、<code>.txt.scss</code>、
            <code>.t.scss</code>
            都是编译后的普通字符串。
          </li>
          <li>
            开发相关：
            <br />
            <code>src/index.tsx</code>、<code>src/global.d.ts</code>
            与整体结构有关，不熟悉的话请不要动。
            <br />
            <code>src/App.tsx</code>是入口。
            <br />
            <code>src/App.scss</code>、<code>src/scss/index.scss</code>
            这两个文件都是全局样式入口，后者优先级高。
          </li>
        </ul>
      </Para>
      <Para>
        <Link to="/about">跳转到“关于”页</Link>
      </Para>
    </Container>
  </div>
);
