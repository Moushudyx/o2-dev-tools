/*
 * @Author: moushu
 * @Date: 2023-06-28 09:58:11
 * @LastEditTime: 2023-06-28 11:38:08
 * @Description: file content
 * @FilePath: \o2-dev-tools\pages\Link\CreateLinkField\xlsx.ts
 */
import type { ParsingOptions, WorkBook } from 'xlsx';

export async function readXlsx(file: File, opts?: ParsingOptions) {
  const ab = await file.arrayBuffer();
  const view = new Uint8Array(ab);
  return XLSX.read(view, { ...opts, type: 'array' });
}

export async function readLines(wb: WorkBook, sheetName: string) {
  const sheet = wb.Sheets[sheetName];
  const aoa = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  const [head, ...body] = valueFilter(aoa as string[][]);
  // console.log(XLSX.utils.sheet_to_txt(sheet))
  // console.log({ head, body });
  return { head, body } as {
    head: string[];
    body: string[][];
  };
}

function valueFilter(v: string[][]): string[][] {
  const res = v.slice();
  while (res.length > 2 && count(res[0]) < count(res[1])) res.splice(0, 1);
  res.forEach((l) => {
    for (let i = 0; i < l.length; i++) {
      if (l[i]) l[i] = l[i].replace(/[\r\n\t]/g, ' ');
    }
  });
  return res;
  /** 计算一行有几个有值的格子 */
  function count(line: unknown[]) {
    let c = 0;
    for (let i = 0; i < line.length; i++) {
      line[i] && c++;
    }
    return c;
  }
}
