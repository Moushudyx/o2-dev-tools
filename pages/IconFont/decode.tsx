/*
 * @Author: moushu
 * @Date: 2024-09-03 16:11:49
 * @LastEditTime: 2024-09-10 15:44:18
 * @Description: file content
 * @FilePath: \o2-dev-tools\pages\IconFont\decode.tsx
 */
import { Collapse, Container, Field, Para, SubTitle } from 'Components/Typo';
import React, { useReducer } from 'react';
import { setStyle } from 'salt-lib';
import './decode.scss';
import { copy } from 'Utils/utils';

type IconList = Array<{ name: string; className: string }>;

const cssId = 'IconFontDecode-TempCSS';

const defaultValue = {
  css: '',
  iconList: [] as IconList,
};

function getAllIcon(css: string): IconList {
  const iconClass = getIconClass(css);
  return (css.match(/icon-([^:\s]+):before/g) || [])
    .map((s) => s.replace('icon-', '').replace(':before', ''))
    .map((name) => ({ name, className: `${iconClass} icon-${name}` }));
}
function getIconClass(css: string): string {
  const matchArr = css.match(/\.(\S+)\s?{[\s\n]*font-family/);
  if (matchArr?.[1]) return matchArr[1];
  return '';
}
function handleCopy(icon: string) {
  copy(`<o2-icon color="var(--BLACK1)" icon="icon-${icon}" size="24rpx" />`);
}

const IconFontDecode = () => {
  // const [iconList, setIconList] = useState([]);
  const [state, dispatch] = useReducer(
    (preState: typeof defaultValue, action: Partial<typeof defaultValue>) => {
      const res = { ...preState, ...action };
      return res;
    },
    { ...defaultValue }
  );
  const handleChange = (css: string) => {
    setStyle(css, cssId);
    const iconList = getAllIcon(css);
    dispatch({ css, iconList });
  };
  return (
    <>
      <Container className="icon-font-decode">
        <SubTitle>IconFont 解析工具</SubTitle>
        <Collapse header={<b>使用说明（点击右侧按钮展开详细说明）：</b>} defaultCollapse></Collapse>
        <hr />
        <Para>本工具不会像其他工具一样缓存数据，关闭页面前请手动转移数据</Para>
        <Para>
          <Field>
            <label>IconFont 的 CSS</label>
            <textarea
              value={state.css}
              onInput={(ev) => handleChange((ev.target as HTMLTextAreaElement).value || '')}
            ></textarea>
          </Field>
        </Para>
        <Para className="decode-icon-list">
          {state.iconList.map(({ name, className }) => (
            <Field
              className="decode-icon-item"
              key={name}
              title={name}
              onClick={() => {
                handleCopy(name);
              }}
            >
              <span className={`decode-icon-item-icon ${className}`}></span>
              <span className="decode-icon-item-name">{name}</span>
            </Field>
          ))}
        </Para>
      </Container>
    </>
  );
};

export default IconFontDecode;
