/*
 * @Author: Moushu
 * @Date: 2022-03-10 13:33:18
 * @Description: 路由之外的容器
 */
import React from 'react';
import styles from './index.mod.scss';

const Container: React.FC = (props) => (
  <div className={styles.container}>
    {props.children}
  </div>
);

export default Container;
