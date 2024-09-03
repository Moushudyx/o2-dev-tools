/*
 * @Author: moushu
 * @Date: 2024-08-13 09:40:43
 * @LastEditTime: 2024-08-13 10:24:00
 * @Description: file content
 * @FilePath: \o2-dev-tools\src\workers\ImgCompress\index.d.ts
 */
// AVIF
import { EncodeOptions as AvifEncodeOptions } from '@jsquash/avif/meta';
// JPEG 和 JXL 是两种东西
import { EncodeOptions as JpegEncodeOptions } from '@jsquash/jpeg/meta';
import { EncodeOptions as JxlEncodeOptions } from '@jsquash/jxl/meta';
// PNG 图片比较特殊, 需要用 oxipng 来优化
import { OptimiseOptions as OptimizeOptions } from '@jsquash/oxipng/meta';
// WEBP
import { EncodeOptions as WebpEncodeOptions } from '@jsquash/webp/meta';

export {
  AvifEncodeOptions,
  JpegEncodeOptions,
  JxlEncodeOptions,
  OptimizeOptions,
  OptimizeOptions as PngEncodeOptions,
  WebpEncodeOptions,
};

export type ImageType = string | 'avif' | 'jpeg' | 'jxl' | 'png' | 'webp';

export type EncodeOptions =
  | AvifEncodeOptions
  | JpegEncodeOptions
  | JxlEncodeOptions
  | OptimizeOptions
  | WebpEncodeOptions;

export interface BaseDataType {
  type: string;
  /** 一般不需要传这个 */
  id?: number | string | symbol;
}

export interface DecodeDataType extends BaseDataType {
  /** 将图片从`ArrayBuffer`处理为内部对象`ImageData` */
  type: 'decode';
  sourceType: ImageType;
  fileBuffer: ArrayBuffer;
}
export interface EncodeDataType extends BaseDataType {
  /** 将图片从`ImageData`内部对象处理为`ArrayBuffer`并优化 */
  type: 'encode';
  outputType: ImageType;
  imageData: ImageData;
  options?: EncodeOptions;
}
export interface OptimizeDataType extends BaseDataType {
  /** 将图片的`ArrayBuffer`从原始类型处理为指定类型并优化 */
  type: 'optimize';
  sourceType: ImageType;
  fileBuffer: ArrayBuffer;
  outputType: ImageType;
  options?: EncodeOptions;
}

export type DataType = DecodeDataType | EncodeDataType | OptimizeDataType;
