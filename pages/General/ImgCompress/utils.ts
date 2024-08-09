/*
 * @Author: shuyan.yin@hand-china.com
 * @Date: 2024-08-09 13:47:50
 * @LastEditTime: 2024-08-09 16:48:03
 * @LastEditors: shuyan.yin@hand-china.com
 * @Description: file content
 * @FilePath: \o2-dev-tools\pages\General\ImgCompress\utils.ts
 */
import { encode as avifEncode, decode as avifDecode } from '@jsquash/avif';
import { EncodeOptions as AvifEncodeOptions } from '@jsquash/avif/meta';
import { encode as jpegEncode, decode as jpegDecode } from '@jsquash/jpeg';
import { EncodeOptions as JpegEncodeOptions } from '@jsquash/jpeg/meta';
import { encode as jxlEncode, decode as jxlDecode } from '@jsquash/jxl';
import { EncodeOptions as JxlEncodeOptions } from '@jsquash/jxl/meta';
import { encode as pngEncode, decode as pngDecode } from '@jsquash/png';
import { encode as webpEncode, decode as webpDecode } from '@jsquash/webp';
import { EncodeOptions as WebpEncodeOptions } from '@jsquash/webp/meta';
import { isNumber } from 'salt-lib';

// decode 和 encode 因为库本身的写法有问题
// 所以这里需要做复杂的类型体操来处理 ts 报错问题

export type ImageType = string | 'avif' | 'jpeg' | 'jxl' | 'png' | 'webp';

// ==================================================
//                     decode 方法
// ==================================================

type decodeFn = (buffer: ArrayBuffer) => Promise<ImageData>;

export async function decode(sourceType: ImageType, fileBuffer: ArrayBuffer): Promise<ImageData> {
  switch (sourceType) {
    case 'avif':
      return (avifDecode as decodeFn)(fileBuffer);
    case 'jpeg':
      return (jpegDecode as decodeFn)(fileBuffer);
    case 'jxl':
      return (jxlDecode as decodeFn)(fileBuffer);
    case 'png':
      return (pngDecode as decodeFn)(fileBuffer);
    case 'webp':
      return (webpDecode as decodeFn)(fileBuffer);
    default:
      throw new Error(`不支持此文件类型: ${sourceType}`);
  }
}

// ==================================================
//                     encode 方法
// ==================================================
type encodeFn = (data: ImageData) => Promise<ArrayBuffer>;

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
  switch (outputType) {
    case 'avif':
      return (
        avifEncode as (
          data: ImageData,
          options?: Partial<AvifEncodeOptions>
        ) => Promise<ArrayBuffer>
      )(imageData, options as AvifEncodeOptions);
    case 'jpeg':
      return (
        jpegEncode as (
          data: ImageData,
          options?: Partial<JpegEncodeOptions>
        ) => Promise<ArrayBuffer>
      )(imageData, options as JpegEncodeOptions);
    case 'jxl':
      return (
        jxlEncode as (data: ImageData, options?: Partial<JxlEncodeOptions>) => Promise<ArrayBuffer>
      )(imageData, options as JxlEncodeOptions);
    case 'png':
      return (pngEncode as encodeFn)(imageData);
    case 'webp':
      return (
        webpEncode as (
          data: ImageData,
          options?: Partial<WebpEncodeOptions>
        ) => Promise<ArrayBuffer>
      )(imageData, options as WebpEncodeOptions);
    default:
      throw new Error(`不支持此文件类型: ${outputType}`);
  }
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

function checkType(buffer: ArrayBuffer, headers: number[], offset = 0) {
  const bf = new Uint8Array(buffer);
  for (const [index, header] of headers.entries()) {
    if (header !== bf[index + offset]) {
      return false;
    }
  }
  return true;
}

/** 防止有小天才把后缀名改了上传上来 */
function getFileType(fileBuffer: ArrayBuffer, fileName: string, fileType: string) {
  // if (checkType(fileBuffer, [])) return 'avif';
  if (checkType(fileBuffer, [0xff, 0xd8, 0xff])) return 'jpeg';
  if (
    checkType(fileBuffer, [0xff, 0x0a]) ||
    checkType(fileBuffer, [0x00, 0x00, 0x00, 0x0c, 0x4a, 0x58, 0x4c, 0x20, 0x0d, 0x0a, 0x87, 0x0a])
  )
    return 'jxl';
  if (checkType(fileBuffer, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return 'png';
  if (checkType(fileBuffer, [0x57, 0x45, 0x42, 0x50], 8)) return 'webp';
  return fileName.endsWith('jxl') ? 'jxl' : fileType.replace('image/', '');
}

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
