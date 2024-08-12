/*
 * @Author: moushu
 * @Date: 2024-08-09 10:13:09
 * @LastEditTime: 2024-08-12 16:24:45
 * @Description: 图片获取组件
 * @FilePath: \o2-dev-tools\pages\General\ImgCompress\ImgInput.tsx
 */
import React, { useEffect, useMemo } from 'react';
// import { read, write } from 'Utils/sessionStorage';
import './ImgCompare.scss';
import { uuidV4 } from 'salt-lib';

export default function ImgInput(props: { onChange: (file: File) => unknown; disabled?: boolean }) {
  const id = useMemo(() => `img-input-${uuidV4()}`, []);

  const handleDataTransferItemList = (items: DataTransferItem[]) => {
    const fileItem = items.filter(({ kind }) => kind === 'file');
    if (fileItem.length) {
      const file = fileItem[0].getAsFile();
      if (file) props.onChange(file);
      return;
    }
    const UrlItem = items.filter(({ kind, type }) => kind === 'string' && type === 'text/uri-list');
    if (UrlItem.length) {
      // Handle the dropped image URL
      UrlItem[0].getAsString((imageUrl) => {
        void fetch(imageUrl)
          .then((response) => response.blob())
          .then((blob) => {
            const file = new File([blob], 'file_name', {
              lastModified: Date.now(),
              type: blob.type,
            });
            props.onChange(file);
          });
      });
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    if (props.disabled) return;
    // Array.from(event.dataTransfer.items).forEach((item) =>
    //   item.getAsString((t) => {
    //     console.log({ t });
    //   })
    // );
    // eslint-disable-next-line prefer-destructuring
    const items = Array.from(event.dataTransfer.items);
    handleDataTransferItemList(items);
  };
  // const handleDragOver = (event: { preventDefault: () => void }) => {
  //   event.preventDefault();
  // };

  useEffect(() => {
    const onPaste = (ev: ClipboardEvent) => {
      if (props.disabled) return;
      const cData = ev.clipboardData;
      if (!cData) return;
      handleDataTransferItemList(Array.from(cData.items));
    };
    window.addEventListener('paste', onPaste);
    return () => {
      window.removeEventListener('paste', onPaste);
    };
  }, []);

  return (
    <label
      onDrop={handleDrop}
      // onDragOver={handleDragOver}
      onDragOver={(ev) => {
        ev.preventDefault();
      }}
      style={{
        width: '100%',
        border: '4px dashed #cccc',
        padding: '20px',
        color: '#666',
        textAlign: 'center',
        boxSizing: 'border-box',
      }}
      htmlFor={id}
      title="点击上传、复制图片或者直接将图片拖动到这里，网络图片可能无法获取"
    >
      <input
        id={id}
        type="file"
        name="Image Upload"
        accept=".png, .jpg, .jpeg, .jxl, .webp, .avif"
        onChange={(ev) => {
          const list = Array.from((ev.target as HTMLInputElement).files || []);
          if (!list[0]) return;
          props.onChange(list[0]);
        }}
        disabled={props.disabled}
        style={{ display: 'none' }}
      />
      <span>点击上传、复制图片或将图片拖动到这里</span>
    </label>
  );
}
