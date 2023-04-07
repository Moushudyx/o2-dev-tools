/*
 * @Author: shuyan.yin@hand-china.com
 * @Date: 2023-04-07 14:11:12
 * @LastEditTime: 2023-04-07 14:19:35
 * @LastEditors: shuyan.yin@hand-china.com
 * @Description: file content
 * @FilePath: \o2-dev-tools\pages\Console\PlatformApi\index.tsx
 */
import React from 'react';
import { Container, SubTitle, Para } from 'Components/Typo';

export default () => {
  return (
    <>
      <Container>
        <SubTitle>平台层改造辅助工具</SubTitle>
        <Para>改造范式：</Para>
        <Para>创建一个编码一致的平台层级菜单，其他什么都不用改</Para>
        <Para>与后端确认接口的改造情况（一般只去掉接口中的<code>租户ID</code>）</Para>
        <Para>利用下列工具达成目的，记得自测和联调</Para>
      </Container>
    </>
  );
};
