/*
 * @Author: moushu
 * @Date: 2024-08-12 15:23:19
 * @LastEditTime: 2024-08-12 15:24:59
 * @Description: 检查文件类型
 * @FilePath: \o2-dev-tools\pages\General\ImgCompress\fileTypeUtils.ts
 */

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
export function getFileType(fileBuffer: ArrayBuffer, fileName: string, fileType: string) {
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
