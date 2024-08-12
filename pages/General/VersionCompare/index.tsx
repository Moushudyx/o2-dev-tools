/*
 * @Author: moushu
 * @Date: 2023-05-31 11:40:42
 * @LastEditTime: 2023-06-12 14:51:47
 * @Description: file content
 * @FilePath: \o2-dev-tools\pages\Console\VersionCompare\index.tsx
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Container, SubTitle, Field, Para, Collapse } from 'Components/Typo';
import { debounce } from 'Utils/utils';
import { CompareResult, depCompare } from './utils';
import { read, write } from 'Utils/sessionStorage';
import { DiffInfo } from './DiffInfo';
import './index.scss';

const storageKey = 'VersionCompare';

export default function VersionCompare() {
  const [code1, setCode1] = useState(read(`${storageKey}-code1`, ''));
  const [code2, setCode2] = useState(read(`${storageKey}-code2`, ''));
  const codeRef1 = useRef(null as HTMLTextAreaElement | null);
  const codeRef2 = useRef(null as HTMLTextAreaElement | null);

  const isMouseDown = useRef(0);
  const heightAlign = useMemo(
    () =>
      debounce(
        (source: HTMLElement, target: HTMLElement) => {
          if (target.offsetHeight !== source.offsetHeight) {
            target.style.height = `${source.offsetHeight}px`;
          }
        },
        16,
        true
      ),
    []
  );

  const [diffInfo, setDiffInfo] = useState(
    {} as {
      dependencies?: CompareResult;
      devDependencies?: CompareResult;
      resolutions?: CompareResult;
    }
  );
  const getDiff = (t1 = code1, t2 = code2) => {
    const res: {
      dependencies?: CompareResult;
      devDependencies?: CompareResult;
      resolutions?: CompareResult;
    } = {};
    try {
      const obj1 = JSON.parse(t1) as {
        dependencies?: Record<string, string>;
        devDependencies?: Record<string, string>;
        resolutions?: Record<string, string>;
      } | null;
      const obj2 = JSON.parse(t2) as {
        dependencies?: Record<string, string>;
        devDependencies?: Record<string, string>;
        resolutions?: Record<string, string>;
      } | null;
      if (obj1 && obj2) {
        if (obj1.dependencies && obj2.dependencies) {
          res.dependencies = depCompare(obj1.dependencies, obj2.dependencies);
        }
        if (obj1.devDependencies && obj2.devDependencies) {
          res.devDependencies = depCompare(obj1.devDependencies, obj2.devDependencies);
        }
        if (obj1.resolutions && obj2.resolutions) {
          res.resolutions = depCompare(obj1.resolutions, obj2.resolutions);
        }
      }
    } catch (e) {
      //
    } finally {
      setDiffInfo(() => res);
    }
  };

  useEffect(() => {
    if (code1 && code2) getDiff();
  }, []);

  return (
    <>
      <Container>
        <SubTitle>比对依赖版本</SubTitle>
        <Collapse header={<b>使用说明（点击右侧按钮展开详细说明）：</b>} defaultCollapse>
          <Para>
            将两个工程的 package.json 分别粘贴在左右两个文本框里
            <br />
            本工具会自动比对<code>dependencies</code>、<code>devDependencies</code>、
            <code>resolutions</code>中不同的依赖并显示在底部
          </Para>
        </Collapse>
        <Para>
          <Field>
            <label>输入 package.json</label>
            <div style={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'stretch' }}>
              <textarea
                ref={codeRef1}
                onInput={(ev) => {
                  const _code = (ev.target as HTMLTextAreaElement).value || '';
                  setCode1(_code);
                  write(`${storageKey}-code1`, _code);
                  getDiff(_code, code2);
                }}
                value={code1}
                onMouseDown={() => {
                  isMouseDown.current = 1;
                }}
                onMouseMove={() => {
                  if (isMouseDown.current === 1 && codeRef1.current && codeRef2.current) {
                    heightAlign(codeRef1.current, codeRef2.current);
                  }
                }}
                onMouseUp={() => {
                  isMouseDown.current = 0;
                  if (isMouseDown.current === 1 && codeRef1.current && codeRef2.current) {
                    heightAlign(codeRef1.current, codeRef2.current);
                  }
                }}
              />
              <textarea
                ref={codeRef2}
                onInput={(ev) => {
                  const _code = (ev.target as HTMLTextAreaElement).value || '';
                  setCode2(_code);
                  write(`${storageKey}-code2`, _code);
                  getDiff(code1, _code);
                }}
                value={code2}
                onMouseDown={() => {
                  isMouseDown.current = 2;
                }}
                onMouseMove={() => {
                  if (isMouseDown.current === 2 && codeRef1.current && codeRef2.current) {
                    heightAlign(codeRef2.current, codeRef1.current);
                  }
                }}
                onMouseUp={() => {
                  isMouseDown.current = 0;
                  if (isMouseDown.current === 2 && codeRef1.current && codeRef2.current) {
                    heightAlign(codeRef2.current, codeRef1.current);
                  }
                }}
              />
            </div>
          </Field>
          本工具不会像其他工具一样缓存数据，关闭页面前请手动转移数据
        </Para>
        {Object.keys(diffInfo).map((key) => {
          const info = diffInfo[key as keyof typeof diffInfo];
          if (!info) return null;
          return <DiffInfo key={key} code={key} info={info} />;
        })}
      </Container>
    </>
  );
}
