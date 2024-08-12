/*
 * @Author: moushu
 * @Date: 2024-08-09 13:47:50
 * @LastEditTime: 2024-08-12 15:24:03
 * @Description: file content
 * @FilePath: \o2-dev-tools\pages\General\ImgCompress\utils.ts
 */
// import { encode as avifEncode, decode as avifDecode } from '@jsquash/avif';
import { EncodeOptions as AvifEncodeOptions } from '@jsquash/avif/meta';
// import { encode as jpegEncode, decode as jpegDecode } from '@jsquash/jpeg';
import { EncodeOptions as JpegEncodeOptions } from '@jsquash/jpeg/meta';
// import { encode as jxlEncode, decode as jxlDecode } from '@jsquash/jxl';
import { EncodeOptions as JxlEncodeOptions } from '@jsquash/jxl/meta';
// import { encode as pngEncode, decode as pngDecode } from '@jsquash/png';
// import { encode as webpEncode, decode as webpDecode } from '@jsquash/webp';
import { EncodeOptions as WebpEncodeOptions } from '@jsquash/webp/meta';
import { $error, defer, isNumber, uuidV4 } from 'salt-lib';
import { getFileType } from './fileTypeUtils';

// let PublicWorker: Worker | null = null;

function getWorker() {
  return new Worker(new URL('ImgCompress.js', $$ImportMetaUrl));
}

// function initWorker() {
//   PublicWorker = getWorker();
// }

// decode 和 encode 因为库本身的写法有问题
// 所以这里需要做复杂的类型体操来处理 ts 报错问题

export type ImageType = string | 'avif' | 'jpeg' | 'jxl' | 'png' | 'webp';

// ==================================================
//                     decode 方法
// ==================================================

// type decodeFn = (buffer: ArrayBuffer) => Promise<ImageData>;

export async function decode(sourceType: ImageType, fileBuffer: ArrayBuffer): Promise<ImageData> {
  // if (!PublicWorker) initWorker();
  const worker = getWorker();
  const { promise, resolve, reject } = defer<ImageData>();
  const id = uuidV4();
  switch (sourceType) {
    case 'avif':
    case 'jpeg':
    case 'jxl':
    case 'png':
    case 'webp':
      worker.postMessage({ type: 'decode', sourceType, fileBuffer, id });
      worker.onmessage = ({ data }) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (data.res) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          resolve(data.res as unknown as ImageData);
        } else {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          reject(data.err);
        }
        setTimeout(() => worker.terminate(), 0);
      };
      worker.onmessageerror = (err) => {
        void $error(err);
        reject(err);
        setTimeout(() => worker.terminate(), 0);
      };
      worker.onerror = (err) => {
        void $error(err);
        reject(err);
        setTimeout(() => worker.terminate(), 0);
      };
      break;
    default:
      reject(new Error(`不支持此文件类型: ${sourceType}`));
  }
  return promise;
}

// ==================================================
//                     encode 方法
// ==================================================
// type encodeFn = (data: ImageData) => Promise<ArrayBuffer>;

type EncodeOptions = AvifEncodeOptions | JpegEncodeOptions | JxlEncodeOptions | WebpEncodeOptions;
/**
 * 将图片转换为`avif`格式
 * @param imageData `decode`方法返回的`ImageData`对象
 * @param options TODO 待补充
 */
export async function encode(
  outputType: 'avif',
  imageData: ImageData,
  options?: AvifEncodeOptions
): Promise<ArrayBuffer>;
/**
 * 将图片转换为`jpeg`格式
 * @param imageData `decode`方法返回的`ImageData`对象
 * @param options TODO 待补充
 */
export async function encode(
  outputType: 'jpeg',
  imageData: ImageData,
  options?: JpegEncodeOptions
): Promise<ArrayBuffer>;
/**
 * 将图片转换为`jxl`格式
 * @param imageData `decode`方法返回的`ImageData`对象
 * @param options TODO 待补充
 */
export async function encode(
  outputType: 'jxl',
  imageData: ImageData,
  options?: JxlEncodeOptions
): Promise<ArrayBuffer>;
/**
 * 将图片转换为`png`格式
 * @param imageData `decode`方法返回的`ImageData`对象
 * @param options TODO 待补充
 */
export async function encode(outputType: 'png', imageData: ImageData): Promise<ArrayBuffer>;
/**
 * 将图片转换为`webp`格式
 * @param imageData `decode`方法返回的`ImageData`对象
 * @param options TODO 待补充
 */
export async function encode(
  outputType: 'webp',
  imageData: ImageData,
  options?: WebpEncodeOptions
): Promise<ArrayBuffer>;
/** 将图片转换为指定格式 */
export async function encode(outputType: string, imageData: ImageData): Promise<ArrayBuffer>;
export async function encode(
  outputType: ImageType,
  imageData: ImageData,
  options?: EncodeOptions
): Promise<ArrayBuffer> {
  // if (!PublicWorker) initWorker();
  const worker = getWorker();
  const { promise, resolve, reject } = defer<ArrayBuffer>();
  const id = uuidV4();
  switch (outputType) {
    case 'avif':
    case 'jpeg':
    case 'jxl':
    case 'png':
    case 'webp':
      worker.postMessage({ type: 'encode', outputType, imageData, options, id });
      worker.onmessage = ({ data }) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (data.res) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          resolve(data.res as unknown as ArrayBuffer);
        } else {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          reject(data.err);
        }
        setTimeout(() => worker.terminate(), 0);
      };
      worker.onmessageerror = (err) => {
        void $error(err);
        reject(err);
        setTimeout(() => worker.terminate(), 0);
      };
      worker.onerror = (err) => {
        void $error(err);
        reject(err);
        setTimeout(() => worker.terminate(), 0);
      };
      break;
    default:
      reject(new Error(`不支持此文件类型: ${outputType}`));
  }
  return promise;
}

// ==================================================

/** 把`encode`的输出塞进来, 返回一个 Base64 的字符串 */
export function previewImage(type: ImageType, fileBuffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(fileBuffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return `data:image/${type};base64,${btoa(binary)}`;
}

// ==================================================

export type FileReport = {
  fileBuffer: ArrayBuffer;
  fileName: string;
  fileType: string;
  fileSize: number;
  src: string;
};

export async function analyzeFile(file: File): Promise<FileReport> {
  const fileBuffer = await file.arrayBuffer();
  const fileName = file.name;
  const fileType = getFileType(fileBuffer, fileName, file.type);
  const fileSize = file.size;
  return { fileBuffer, fileName, fileType, fileSize, src: previewImage(fileType, fileBuffer) };
}

// ==================================================

export function download(fileName: string, fileBuffer: ArrayBuffer) {
  const fb = new Blob([fileBuffer]);
  const downloadLink = URL.createObjectURL(fb);
  // URL.revokeObjectURL(downloadLink);
  const downloadElement = document.createElement('a');
  downloadElement.href = downloadLink;
  downloadElement.download = fileName;
  downloadElement.style.display = 'none';
  document.body.appendChild(downloadElement);
  downloadElement.click(); // 触发下载
  setTimeout(() => {
    document.body.removeChild(downloadElement);
  }, 0);
}

// ==================================================

export function showByte(size: number) {
  if (!isNumber(size)) return '';
  if (size < 2 ** 10) {
    return `${size}iB`;
  } else if (size < 2 ** 20) {
    return `${Number((size / 2 ** 10).toFixed(2))}KiB`;
  } else if (size < 2 ** 30) {
    return `${Number((size / 2 ** 20).toFixed(2))}MiB`;
  } else {
    return `${Number((size / 2 ** 30).toFixed(2))}GiB`;
  }
}
