/*
 * @Author: MouShu
 * @Date: 2022-03-10 15:30:19
 * @Description: 夜间模式处理函数
 */
import { useState, useEffect, useRef } from 'react';
import { readAndListen, write } from './localStorage';
import { isBoolean } from './typeGuard';

const key = 'MERS-NIGHT-MODE';
let $isNight = false;

const changeNightStyle = (isNight: boolean) => {
  if (isNight) document.body.classList.add('night-style');
  else document.body.classList.remove('night-style');
};

const toggleNightMode = (isNightMode?: boolean): boolean => {
  if (isBoolean(isNightMode)) {
    if (isNightMode === $isNight) return $isNight;
    $isNight = isNightMode;
  } else {
    $isNight = !$isNight;
  }
  changeNightStyle($isNight);
  write(key, $isNight);
  return $isNight;
};

const isNightMode = () => $isNight;

/**
 * 用法类似 useState
 *
 * 不同的是会在同一域名不同页面间同步夜间模式
 */
function useNightMode() {
  const [isNight, setIsNight] = useState($isNight);
  const setter = useRef(setIsNight);
  setter.current = setIsNight;
  useEffect(() => {
    const [value, off] = readAndListen({
      key,
      defaultValue: false,
      listener: (ev) => {
        const v = !!ev.newValue;
        $isNight = v;
        changeNightStyle(!!v);
        setter.current(v);
      },
    });
    const v = !!value;
    if (v !== isNight) {
      $isNight = v;
      changeNightStyle(v);
      setter.current(v);
    }
    return off;
  }, []);

  return [
    isNight,
    (_isNight: boolean) => {
      toggleNightMode(_isNight);
      setIsNight(_isNight);
    },
  ] as const;
}

export { toggleNightMode, isNightMode, useNightMode };