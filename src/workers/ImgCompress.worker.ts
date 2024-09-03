/*
 * @Author: moushu
 * @Date: 2024-08-12 13:52:07
 * @LastEditTime: 2024-08-13 09:58:56
 * @Description: 图片压缩/格式转换 Worker 的主要逻辑
 * @FilePath: \o2-dev-tools\src\workers\ImgCompress.worker.ts
 */
/* eslint-disable no-console */
import { DataType } from './ImgCompress';
import { decode, encode } from './ImgCompress/utils';

const ctx = self as unknown as Worker;

ctx.addEventListener(
  'message',
  (res) => {
    if (!res.data) throw new Error('未知的指令类型');
    // console.log('ImgCompress Worker 收到消息');
    const data = res.data as unknown as DataType;
    if (data.type === 'encode') {
      // encode 编码 将图片从 ImageData 内部对象处理为 ArrayBuffer 并优化
      const { outputType, imageData, options, id } = data;
      // @ts-ignore
      void encode(outputType, imageData, options)
        .then((res) => {
          ctx.postMessage({ res, id });
        })
        .catch((err) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          ctx.postMessage({ err, id });
        });
    } else if (data.type === 'decode') {
      // decode 解码 将图片从 ArrayBuffer 处理为内部对象 ImageData
      const { sourceType, fileBuffer, id } = data;
      void decode(sourceType, fileBuffer)
        .then((res) => {
          ctx.postMessage({ res, id });
        })
        .catch((err) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          ctx.postMessage({ err, id });
        });
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    } else if (data.type === 'optimize') {
      // optimize 优化 将图片的 ArrayBuffer 从原始类型处理为指定类型并优化
      const { outputType, options, sourceType, fileBuffer, id } = data;
      // @ts-ignore
      void decode(sourceType, fileBuffer)
        // @ts-ignore
        .then((res) => encode(outputType, res, options))
        .then((res) => {
          ctx.postMessage({ res, id });
        })
        .catch((err) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          ctx.postMessage({ err, id });
        });
    } else {
      throw new Error('未知的指令类型: type 只能为这些值 - encode decode');
    }
  },
  false
);

// 或
// ctx.onmessage = (e) => {
// };

// 监听错误事件
ctx.addEventListener('error', (res) => {
  console.error('ImgCompress Worker 执行出错\n', res);
});
