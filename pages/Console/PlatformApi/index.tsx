/*
 * @Author: moushu
 * @Date: 2023-04-07 14:11:12
 * @LastEditTime: 2023-06-12 14:01:24
 * @Description: file content
 * @FilePath: \o2-dev-tools\pages\Console\PlatformApi\index.tsx
 */
import React from 'react';
import { Container, SubTitle, Para, SubLine, Collapse } from 'Components/Typo';
import { CopyList } from './CopyList';
import CodeTextarea from './CodeTextarea';
import BatchConvert from './BatchConvert';
// import styles from './index.mod.scss';

export default function PlatformApi() {
  return (
    <>
      <Container>
        <SubTitle>平台层改造辅助工具</SubTitle>
        <Collapse header={<b>使用说明（点击右侧按钮展开详细说明）：</b>} defaultCollapse>
          <Para>
            常用代码：
            <br />
            平台层改造时常用代码，比如平台层用到的“商家名称”列，租户层用到的“来源”列。
          </Para>
          <hr />
          <Para>
            单文件处理：
            <br />将<code>.js</code>
            文件的代码复制到上面的文本框里，下面的文本框里就是处理后的代码；
            <br />
            代码处理会寻找页面中形如<code>{`{prefix}/v1/{tenantId}/xxx`}</code>的 URL 拼接代码，
            更改为<code>getPlatformUrl("xxx")</code>模式的代码；
            <br />
            这个过程中会自动引入<code>platformUrlFactory</code>等依赖，处理代码中有多个
            <code>prefix</code>等特殊情况。
          </Para>
          <hr />
          <Para>
            批量处理：
            <br />
            与单文件处理类似，不过你可以上传一整个文件夹；
            此工具会自动扫描整个文件夹，找出需要处理的文件并以树形展示。
            <br />
            你可以在树形图中点击文件查看转换后的代码，确认无误后可以点击下载 zip 文件，
            这个压缩包中就是转换代码后的文件（树形结构，只会包含需要转换代码的文件），解压后覆盖即可。
          </Para>
          <hr />
          <Para>
            平台层改造范式：
            <ol>
              <li>创建一个编码一致的平台层级菜单，其他什么都不用改</li>
              <li>
                与后端确认接口的改造情况（一般只去掉接口中的<code>租户ID</code>）
              </li>
              <li>利用下列工具达成目的，记得自测和联调</li>
            </ol>
          </Para>
          <Para>
            <b>此工具不能保证转换后的代码无问题，请仔细比对转换前后的代码并完整测试</b>
          </Para>
        </Collapse>
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
