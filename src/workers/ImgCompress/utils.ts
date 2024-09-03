/*
 * @Author: moushu
 * @Date: 2024-08-12 14:07:26
 * @LastEditTime: 2024-08-13 14:58:15
 * @Description: file content
 * @FilePath: \o2-dev-tools\src\workers\ImgCompress\utils.ts
 */
// AVIF
import { encode as avifEncode, decode as avifDecode } from '@jsquash/avif';
// JPEG 和 JXL 是两种东西
import { encode as jpegEncode, decode as jpegDecode } from '@jsquash/jpeg';
import { encode as jxlEncode, decode as jxlDecode } from '@jsquash/jxl';
// PNG 图片比较特殊, 需要用 oxipng 来优化
import { encode as pngEncode, decode as pngDecode } from '@jsquash/png';
import { optimise as optimize } from '@jsquash/oxipng';
// WEBP
import { encode as webpEncode, decode as webpDecode } from '@jsquash/webp';
// 类型体操
import {
  AvifEncodeOptions,
  EncodeOptions,
  ImageType,
  JpegEncodeOptions,
  JxlEncodeOptions,
  OptimizeOptions,
  WebpEncodeOptions,
} from '.';

// decode 和 encode 因为库本身的写法有问题
// 所以这里需要做复杂的类型体操来规避 ts 报错

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

/**
 * 将图片转换为`avif`格式
 * @param imageData `decode`方法返回的`ImageData`对象
 * @param options TODO 待补充
 */
export async function encode(
  outputType: 'avif',
  imageData: ImageData,
  options?: Partial<AvifEncodeOptions>
): Promise<ArrayBuffer>;
/**
 * 将图片转换为`jpeg`格式
 * @param imageData `decode`方法返回的`ImageData`对象
 * @param options TODO 待补充
 */
export async function encode(
  outputType: 'jpeg',
  imageData: ImageData,
  options?: Partial<JpegEncodeOptions>
): Promise<ArrayBuffer>;
/**
 * 将图片转换为`jxl`格式
 * @param imageData `decode`方法返回的`ImageData`对象
 * @param options TODO 待补充
 */
export async function encode(
  outputType: 'jxl',
  imageData: ImageData,
  options?: Partial<JxlEncodeOptions>
): Promise<ArrayBuffer>;
/**
 * 将图片转换为`png`格式
 * @param imageData `decode`方法返回的`ImageData`对象
 * @param options TODO 待补充
 */
export async function encode(
  outputType: 'png',
  imageData: ImageData,
  options?: Partial<OptimizeOptions>
): Promise<ArrayBuffer>;
/**
 * 将图片转换为`webp`格式
 * @param imageData `decode`方法返回的`ImageData`对象
 * @param options TODO 待补充
 */
export async function encode(
  outputType: 'webp',
  imageData: ImageData,
  options?: Partial<WebpEncodeOptions>
): Promise<ArrayBuffer>;
/** 将图片转换为指定格式 */
export async function encode(outputType: string, imageData: ImageData): Promise<ArrayBuffer>;
export async function encode(
  outputType: ImageType,
  imageData: ImageData,
  options?: Partial<EncodeOptions>
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
      return (pngEncode as encodeFn)(imageData).then((buffer) => optimize(buffer, options as OptimizeOptions));
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
