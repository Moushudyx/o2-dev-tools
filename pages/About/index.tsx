/*
 * @LastEditTime: 2023-04-07 15:31:38
 * @Description: “关于”页面
 */
import { Container, Para, SubTitle } from 'Components/Typo';
import React from 'react';
import { Link } from 'react-router-dom';
import style from './index.module.scss';

export default () => {
  const credit: {
    name: string;
    url?: string;
    creditTo?: string;
    creditUrl?: string;
  }[] = [
    {
      name: 'react',
      url: 'https://github.com/facebook/react',
      creditTo: 'facebook',
      creditUrl: 'https://react.dev/',
    },
    {
      name: 'react-router',
      url: 'https://github.com/remix-run/react-router',
      creditTo: 'Remix',
      creditUrl: 'https://remix.run/',
    },
    {
      name: 'typescript',
      url: 'https://github.com/microsoft/TypeScript',
      creditTo: 'microsoft',
      creditUrl: 'https://www.typescriptlang.org/',
    },
    {
      name: 'esbuild',
      url: 'https://github.com/evanw/esbuild',
      creditTo: 'evanw',
      creditUrl: 'https://github.com/evanw',
    },
    {
      name: 'esbuild-sass-plugin',
      url: 'https://github.com/glromeo/esbuild-sass-plugin',
      creditTo: 'glromeo',
      creditUrl: 'https://github.com/glromeo',
    },
    { name: 'eslint', url: 'https://github.com/eslint/eslint' },
    {
      name: '@types',
      url: 'https://github.com/DefinitelyTyped/DefinitelyTyped',
      creditTo: 'DefinitelyTyped',
      creditUrl: 'https://github.com/DefinitelyTyped',
    },
    { name: 'yarn', url: 'https://yarnpkg.com/', creditTo: '', creditUrl: '' },
    { name: 'open', url: '', creditTo: '', creditUrl: '' },
    { name: 'postcss', url: '', creditTo: '', creditUrl: '' },
    { name: 'prettier', url: '', creditTo: '', creditUrl: '' },
    { name: 'resolve', url: '', creditTo: '', creditUrl: '' },
    { name: 'salt-lib', url: '', creditTo: '', creditUrl: '' },
    { name: 'sass', url: '', creditTo: '', creditUrl: '' },
  ];
  const creditPara = credit.map(({ name, url, creditTo, creditUrl }) => (
    <Para key={name} className={style['credit-list-item']}>
      {url ? (
        <a href={url} target="_blank">
          {name}
        </a>
      ) : (
        <span>{name}</span>
      )}
      {creditUrl ? (
        <a href={creditUrl} target="_blank">
          {creditTo && `-- ${creditTo}`}
        </a>
      ) : (
        <span>{creditTo && `-- ${creditTo}`}</span>
      )}
    </Para>
  ));
  return (
    <Container>
      <SubTitle>关于 O2 开发工具</SubTitle>
      <Para>
        开源软件
        {creditPara}
      </Para>
      <Link to="/">跳转到主页</Link>
    </Container>
  );
};
