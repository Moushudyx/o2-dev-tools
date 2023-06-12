/*
 * @Author: MouShu
 * @Date: 2022-03-16 16:44:34
 * @Description: 基本样式
 */
import React, {
  FC,
  HTMLAttributes,
  ReactNode,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import './Typo.scss';

const combineProps = function <T>(props: HTMLAttributes<T>, className: string): HTMLAttributes<T> {
  return { ...props, className: `${props.className || ''} ${className}`, children: undefined };
};

export const Container: FC<HTMLAttributes<HTMLDivElement>> = (props) => (
  <div {...combineProps(props, 'demo-typo-container')}>{props.children}</div>
);

export const Collapse: FC<
  HTMLAttributes<HTMLDivElement> & {
    defaultCollapse?: boolean;
    header?: ReactNode;
    headerContainerProps?: HTMLAttributes<HTMLDivElement>;
    headerLineContainerProps?: HTMLAttributes<HTMLDivElement>;
    headerButtonProps?: HTMLAttributes<HTMLDivElement>;
    bodyContainerProps?: HTMLAttributes<HTMLDivElement>;
    bodyProps?: HTMLAttributes<HTMLDivElement>;
  }
> = (props) => {
  const {
    defaultCollapse = false,
    header,
    headerContainerProps = {},
    headerLineContainerProps = {},
    headerButtonProps = {},
    bodyContainerProps = {},
    bodyProps = {},
    children,
    ...otherProps
  } = props;
  // const onClick = useMemo(() => {
  //   let key = Date.now(); // 防止连续点击导致问题
  //   return (event: MouseEvent<HTMLSpanElement>) => {
  //     const target = event.target as HTMLSpanElement;
  //     const body = target.parentElement?.parentElement?.querySelector(
  //       '.demo-typo-collapse-body'
  //     ) as HTMLElement | null;
  //     setCollapse((isCollapse) => {
  //       if (body) {
  //         body.style.maxHeight = `${body.scrollHeight}px`;
  //         const lastKey = (key = Date.now());
  //         setTimeout(() => {
  //           if (key === lastKey) body.style.maxHeight = '';
  //         }, 500);
  //       }
  //       return !isCollapse;
  //     });
  //   };
  // }, []);
  const [collapse, setCollapse] = useState(defaultCollapse);
  const bodyRef = useRef(null as HTMLDivElement | null);
  const setHeight = useMemo(
    () => () => {
      if (bodyRef.current) bodyRef.current.style.maxHeight = `${bodyRef.current.scrollHeight}px`;
    },
    []
  );
  const observer = useMemo(() => new MutationObserver(setHeight), []);
  useLayoutEffect(() => {
    if (bodyRef.current) {
      const b = bodyRef.current;
      observer.observe(b, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class'],
      });
      setHeight();
      b.addEventListener('transitionend', setHeight);
    }
    return () => {
      observer.disconnect();
    };
  });
  return (
    <div {...combineProps(otherProps, `demo-typo-collapse ${collapse ? 'hide' : 'show'}`)}>
      <div {...combineProps(headerContainerProps, `demo-typo-collapse-header`)}>
        <div {...combineProps(headerLineContainerProps, `demo-typo-collapse-header-line`)}>
          {header}
        </div>
        <span
          role="button"
          {...combineProps(headerButtonProps, `demo-typo-collapse-header-button`)}
          onClick={() => setCollapse((isCollapse) => !isCollapse)}
        >
          <span>{collapse ? '展开' : '收起'}</span>
        </span>
      </div>
      <div ref={bodyRef} {...combineProps(bodyContainerProps, `demo-typo-collapse-body-container`)}>
        <div {...combineProps(bodyProps, `demo-typo-collapse-body`)}>{children}</div>
      </div>
    </div>
  );
};

export const Title: FC<HTMLAttributes<HTMLHeadingElement>> = (props) => (
  <h2 {...combineProps(props, 'demo-typo-title')}>{props.children}</h2>
);

export const SubTitle: FC<HTMLAttributes<HTMLHeadingElement>> = (props) => (
  <h3 {...combineProps(props, 'demo-typo-sub-title')}>{props.children}</h3>
);

export const SubLine: FC<HTMLAttributes<HTMLHeadingElement>> = (props) => (
  <h3 {...combineProps(props, 'demo-typo-sub-line')}>{props.children}</h3>
);

export const Para: FC<HTMLAttributes<HTMLDivElement>> = (props) => (
  <div {...combineProps(props, 'demo-typo-text')}>{props.children}</div>
);

export const Field: FC<HTMLAttributes<HTMLDivElement>> = (props) => (
  <div {...combineProps(props, 'demo-typo-field')}>{props.children}</div>
);
