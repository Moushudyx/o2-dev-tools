/*
 * @Author: shuyan.yin@hand-china.com
 * @Date: 2023-06-02 18:23:22
 * @LastEditTime: 2023-06-02 18:34:12
 * @LastEditors: shuyan.yin@hand-china.com
 * @Description: file content
 * @FilePath: \o2-dev-tools\pages\Console\TemplateCode\TemplateManage.tsx
 */
import React, { useMemo, useReducer, useState } from 'react';

function replaceTemplateReg(code: string){
  return new RegExp(`\\$\\{\\{\\s*${code}\\s*\\}\\}`, 'g')
}

export function TemplateManage(props: {
  onChooseTemplate: (template: string, code: string) => unknown;
  currentTemplateCode: string;
}) {
  return <></>;
}
