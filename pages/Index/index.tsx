/*
 * @LastEditTime: 2023-06-13 11:06:30
 * @Description: 演示页面
 */
import React from 'react';
// import { Link } from 'react-router-dom';
import { Container, SubTitle, Para } from 'Components/Typo';
// import style from './index.module.scss';

export default () => (
  <>
    <Container>
      <SubTitle>O2 开发工具</SubTitle>
      <Para>O2 开发的前端工具集（也包含了部分 Link 开发工具）</Para>
      <hr />
      <Para>左侧是可用的前端开发辅助工具。</Para>
      <Para>
        部分输入框有本地存储功能，可以将你的输入的内容保存在本地，刷新页面、切换工具不会丢失数据；
      </Para>
      <Para>
        也有部分输入框只会<b>暂存</b>你的操作，关闭页面后数据将会丢失，此类工具一般会有提示；
      </Para>
      <Para>上传的文件数据等不会保存，关闭页面前注意自行保存。</Para>
      <hr />
      <Para>右上角的按钮是切换亮色/暗色模式功能。</Para>
      {/* <Para>
        <Link to="/about">跳转到“关于”页</Link>
      </Para> */}
    </Container>
  </>
);
