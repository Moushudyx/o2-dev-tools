/* eslint-disable complexity */
/*
 * @Author: moushu
 * @Date: 2024-08-09 10:13:09
 * @LastEditTime: 2024-08-13 16:37:30
 * @Description: 图片压缩工具
 * @FilePath: \o2-dev-tools\pages\General\ImgCompress\index.tsx
 */
import React, { useRef, useState } from 'react';
import { $error, $log, sleep } from 'salt-lib';
import { Container, SubTitle, Field, Para, Collapse } from 'Components/Typo';
// import { debounce } from 'Utils/utils';
import { read, write } from 'Utils/sessionStorage';
import {
  analyzeFile,
  decode,
  encode,
  type ImageType,
  type FileReport,
  previewImage,
  download,
  showByte,
  StateCurrent,
} from './utils';
import './index.scss';
import ImgCompare from './ImgCompare';
import ImgInput from './ImgInput';
import type { EncodeOptions } from 'src/workers/ImgCompress';
import PngOptions from './components/PngOptions';
import JpegOptions from './components/JpegOptions';

const storageKey = 'ImgCompress';
/** 就绪 */
const LOADING_READY = '✅就绪';
/** 执行出错 */
const LOADING_ERROR = '!!!❌执行出错❌!!!';
/** 读取中 */
const LOADING_READING = '🚗读取中';
/** 解析中 */
const LOADING_DECODE = '🚚解析中';
/** 编码中 */
const LOADING_ENCODE = '🚚编码中';

const availableType = [{ type: 'avif' }, { type: 'jpeg' }, { type: 'png' }, { type: 'webp' }];

export default function ImgCompress() {
  const [originFile, setOriginFile] = useState<FileReport | null>(null);
  const [minifyFile, setMinifyFile] = useState<FileReport | null>(null);
  const [targetType, setTargetType] = useState<ImageType>(read(`${storageKey}-targetType`, 'png'));
  const [loadingType, setLoadingType] = useState<string>(LOADING_READY);
  const loading = useRef(false);
  const options = useRef({} as StateCurrent);

  const readFile = async (file: File) => {
    if (loading.current) return;
    loading.current = true;
    try {
      // 读取图片
      setLoadingType(LOADING_READING);
      const fr = await analyzeFile(file);
      setOriginFile(fr);
      setMinifyFile(null);
      // 转换图片
      void process(fr);
    } catch (e) {
      // eslint-disable-next-line require-atomic-updates
      loading.current = false;
      void $error(e);
      setLoadingType(LOADING_ERROR);
    }
  };
  const process = async (fr: FileReport | null = originFile, tType: ImageType = targetType) => {
    if (!fr) return;
    loading.current = true;
    try {
      setLoadingType(LOADING_DECODE);
      await sleep(33); // 等页面展示文字
      const imgData = await decode(fr.fileType, fr.fileBuffer);
      await sleep(33); // 防止白屏卡死
      setLoadingType(LOADING_ENCODE);
      await sleep(33); // 等页面展示文字
      void $log('类型:', tType, '\n参数:\n', { ...options.current[tType as keyof StateCurrent] });
      const newFile = await encode(
        tType,
        imgData,
        options.current[tType as keyof StateCurrent] as EncodeOptions
      );
      setMinifyFile({
        fileBuffer: newFile,
        fileName: `${fr.fileName || '压缩文件'}`,
        fileType: tType,
        fileSize: newFile.byteLength,
        src: previewImage(tType, newFile),
      });
      // 完成操作
      loading.current = false;
      setLoadingType(LOADING_READY);
    } catch (e) {
      void $error(e);
      loading.current = false;
      setLoadingType(LOADING_ERROR);
      // } finally {
    }
  };
  const changeFileType = (type: ImageType) => {
    if (loading.current) return;
    setTargetType(type);
    write(`${storageKey}-targetType`, type);
    if (originFile) return process(originFile, type);
  };
  const downloadFile = () => {
    if (minifyFile)
      download(`${minifyFile.fileName}.${minifyFile.fileType}`, minifyFile.fileBuffer);
  };
  const sizeRadio =
    originFile && minifyFile
      ? Number(((minifyFile.fileSize / originFile.fileSize) * 100).toFixed(2))
      : 0;

  return (
    <>
      <Container className="img-compress">
        <SubTitle>图片格式转换/体积压缩工具</SubTitle>
        <Collapse header={<b>使用说明（点击右侧按钮展开详细说明）：</b>} defaultCollapse>
          <Para>
            点击上传框上传图片,&nbsp;或者右键你想要复制的图片然后&nbsp;Ctrl+V&nbsp;粘贴到这个页面上,
            <br />
            或者将本地图片拖动到上传框里均可，网络图片可能因为同源策略无法获取
            <br />
            目前只支持导入&nbsp;avif、jpeg、jxl、png、webp&nbsp;格式的文件
            <br />
            只支持导出&nbsp;avif、jpeg、png、webp&nbsp;格式的文件(jxl格式实在没人用不加了)
            <br />
            没有实现 bmp、tiff 等文件类型的适配
            <br />
            使用谷歌的 wasm 实现图片读取、格式转换
          </Para>
        </Collapse>
        <Para>
          <Field>
            <ImgInput
              onChange={(file) => {
                void readFile(file);
              }}
              disabled={loading.current}
            />
            {/* <label htmlFor="img-compress-image-input">将图片上传到这里</label>
            <input
              id="img-compress-image-input"
              type="file"
              name="Image Upload"
              accept=".png, .jpg, .jpeg, .jxl, .webp, .avif"
              onChange={(ev) => {
                const list = Array.from((ev.target as HTMLInputElement).files || []);
                if (!list[0]) return;
                void readFile(list[0]);
              }}
            /> */}
          </Field>
          <Field>
            {originFile?.fileName || '没有文件'}&nbsp;-&nbsp;{loadingType}
          </Field>
        </Para>
        <Para>
          <Field>
            目标格式:&nbsp;
            {availableType.map(({ type }) => (
              <span
                className={`type-btn ${targetType === type ? 'active' : ''}`}
                role="button"
                onClick={() => {
                  void changeFileType(type);
                }}
              >
                <span className="type-btn-icon">{targetType === type ? '📖' : '📘'}</span>
                {type}
              </span>
            ))}
          </Field>
        </Para>
        <JpegOptions
          storageKey={storageKey}
          options={options}
          style={{ display: targetType === 'jpeg' ? 'flex' : 'none' }}
        />
        <PngOptions
          storageKey={storageKey}
          options={options}
          style={{ display: targetType === 'png' ? 'flex' : 'none' }}
        />
        <Para>
          {originFile && minifyFile && (
            <Field>
              转换前后对比&nbsp;{originFile.fileType}&nbsp;{showByte(originFile.fileSize)}
              &nbsp;:&nbsp;{minifyFile.fileType}&nbsp;{showByte(minifyFile.fileSize)}
              &nbsp;-&nbsp;体积比&nbsp;
              <span
                className={`size-radio ${sizeRadio <= 50 ? 'very-small ' : ''}${
                  sizeRadio <= 75 ? 'small ' : ''
                }${sizeRadio > 75 && sizeRadio <= 100 ? 'normal ' : ''}${
                  sizeRadio > 100 ? 'big ' : ''
                }${sizeRadio >= 200 ? 'very-big ' : ''}`}
              >
                {sizeRadio}%
              </span>
            </Field>
          )}
          {minifyFile && (
            <Field>
              <span className="download-btn" role="button" onClick={downloadFile}>
                下载处理后的图片
              </span>
            </Field>
          )}
          <ImgCompare
            storageKey={storageKey}
            originSrc={originFile ? originFile.src : ''}
            minifySrc={minifyFile ? minifyFile.src : ''}
            title="左边为处理前的图片，右边为处理后的图片"
          />
          本工具不会像其他工具一样缓存数据，关闭页面前请手动转移数据
        </Para>
      </Container>
    </>
  );
}
