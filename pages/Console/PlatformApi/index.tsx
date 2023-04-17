/*
 * @Author: shuyan.yin@hand-china.com
 * @Date: 2023-04-07 14:11:12
 * @LastEditTime: 2023-04-17 18:05:08
 * @LastEditors: shuyan.yin@hand-china.com
 * @Description: file content
 * @FilePath: \o2-dev-tools\pages\Console\PlatformApi\index.tsx
 */
import React from 'react';
import { Container, SubTitle, Para, SubLine } from 'Components/Typo';
import { CopyList } from './CopyList';
import CodeTextarea from './CodeTextarea';
import BatchConvert from './BatchConvert';
// import styles from './index.mod.scss';

export default function PlatformApi() {
  return (
    <>
      <Container>
        <SubTitle>平台层改造辅助工具</SubTitle>
        <Para>改造范式：</Para>
        <Para>创建一个编码一致的平台层级菜单，其他什么都不用改</Para>
        <Para>
          与后端确认接口的改造情况（一般只去掉接口中的<code>租户ID</code>）
        </Para>
        <Para>利用下列工具达成目的，记得自测和联调</Para>
        <hr />
        <SubLine>常用代码</SubLine>
        {CopyList}
        <hr />
        <SubLine>单文件处理（需要浏览器支持 ES9 否则报错）</SubLine>
        <CodeTextarea />
        <hr />
        <SubLine>批量处理（需要浏览器支持 ES9 否则报错）</SubLine>
        <BatchConvert />
        <hr />
        <SubLine>免责声明</SubLine>
        <Para>此工具不能保证转换后的代码无问题</Para>
        <Para>请仔细比对转换前后的代码并完整测试</Para>
      </Container>
    </>
  );
}
