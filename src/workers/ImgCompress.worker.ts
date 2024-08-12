/*
 * @Author: moushu
 * @Date: 2024-08-12 13:52:07
 * @LastEditTime: 2024-08-12 15:22:00
 * @Description: file content
 * @FilePath: \o2-dev-tools\src\workers\ImgCompress.worker.ts
 */
/* eslint-disable no-console */
import { decode, encode, EncodeOptions, ImageType } from './ImgCompress/utils';

const ctx = self as unknown as Worker;

interface BaseDataType {
  type: string;
  id: string;
}

interface EncodeDataType extends BaseDataType {
  type: 'encode';
  outputType: ImageType;
  imageData: ImageData;
  options?: EncodeOptions;
}
interface DecodeDataType extends BaseDataType {
  type: 'decode';
  sourceType: ImageType;
  fileBuffer: ArrayBuffer;
}

type DataType = DecodeDataType | EncodeDataType;

ctx.addEventListener(
  'message',
  (res) => {
    console.log('Worker 收到消息');
    const data = res.data as unknown as DataType;
    // 向主线程发送消息
    if (data.type === 'encode') {
      const { outputType, imageData, options, id } = data;
      // @ts-ignore
      void encode(outputType, imageData, options).then((res) => {
        ctx.postMessage({ res, id });
      }).catch((err) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        ctx.postMessage({ err, id });
      });
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    } else if (data.type === 'decode') {
      const { sourceType, fileBuffer, id } = data;
      void decode(sourceType, fileBuffer).then((res) => {
        ctx.postMessage({ res, id });
      }).catch((err) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        ctx.postMessage({ err, id });
      });
    } else {
      throw new Error('未知的 type');
    }
  },
  false
);

// 或
// ctx.onmessage = (e) => {
// };

// 监听错误事件
ctx.addEventListener('error', (res) => {
  console.log('Worker 执行出错\n', res);
});
