/*
 * @Author: moushu
 * @Date: 2023-04-10 13:34:39
 * @LastEditTime: 2023-05-25 16:03:53
 * @Description: file content
 * @FilePath: \o2-dev-tools\pages\Console\PlatformApi\codeConvert.ts
 */
type replaceUrlOptions = {
  basePrefix: string;
  baseVersion: string;
  prefixMap: { [prefix: string]: string };
  tenantMap: string[];
};

const getApiReg = /\`\$\{\s*([^}]+)\s*\}\/([^$]+)\/(\$\{\s*[^}]+\s*\}|\d+)\/(\S+)\`/i;
const getAllApiReg = new RegExp(getApiReg, 'gi');
/** 匹配`import { XXX } from 'o2Utils/config';` */
const getPrefixConfigReg =
  /(?<!\/\/\s*)import\s*\{\s*([^}]+)\s*\}\s*from\s*["'](?:o2-front\/(?:src|lib)\/utils|o2Utils)\/config["']/;
/** 匹配`import { XXX } from 'o2Utils/o2Utils';` */
const getO2UtilsReg =
  /(?<!\/\/\s*)import\s*\{\s*([^}]+?),?\s*\}\s*from\s*["'](?:o2-front\/(?:src|lib)\/utils|o2Utils)\/o2Utils["'];?/;
const getPrefixMapReg = (name: string) =>
  new RegExp(`(?:var|let|const)\\s*(\\S+)\\s*=\\s*(${name}|\`\\$\\{${name}\\}\`)`);

const defaultBasePrefix = 'prefix';
const defaultBaseVersion = 'v1';

export function needConvert(code: string) {
  return getApiReg.test(code);
}

/**
 * 主要流程：
 * 1. 引入`platformUrlFactory`生成`getPlatformUrl`
 * 2. 替换`${prefix}/v1/${organizationId}/xxx`接口路径为`getPlatformUrl("xxx")`
 * 3. 删除 prefix、getCurrentOrganizationId（getOrganizationId）的定义
 * @param code 要转换的代码
 */
export function codeConvert(code: string): [string, string[]] {
  let _code = code;
  const res: string[] = [];
  if (!needConvert(code)) return [_code, res]; // 不需要转换
  const prefixMap = getCodeMaps(code);
  const [basePrefix, baseVersion] = getPagePrefixVersion(code, prefixMap);
  const option: replaceUrlOptions = {
    basePrefix,
    baseVersion,
    prefixMap,
    tenantMap: ['getCurrentOrganizationId()', 'organizationId'],
  };
  // 1. 引入`platformUrlFactory`生成`getPlatformUrl`
  const [impResCode, impResLog] = importUrlFactory(_code, option);
  _code = impResCode;
  res.push(...impResLog);
  // 2. 替换`${prefix}/v1/${organizationId}/xxx`接口路径为`getPlatformUrl("xxx")`
  const [repResCode, repResLog] = replaceUrl(_code, option);
  _code = repResCode;
  res.push(...repResLog);
  // 3. 删除 prefix、getCurrentOrganizationId（getOrganizationId）的定义
  return [_code, res];
}
/**
 * 内部方法，获取代码中:\
 * 使用次数最多的接口前缀`prefix`\
 * 使用次数最多的接口版本`version`
 */
function getPagePrefixVersion(
  code: string,
  prefixMap: { [prefix: string]: string }
): [string, string] {
  const codes = code.match(getAllApiReg);
  const countPrefix: { [p: string]: number } = {};
  const countVersion: { [p: string]: number } = {};
  codes?.forEach((code) => {
    const match = code.match(getApiReg);
    const _p = match?.[1];
    const v = match?.[2];
    if (_p) {
      const p = prefixMap[_p] ? prefixMap[_p] : _p;
      if (!countPrefix[p]) countPrefix[p] = 1;
      else countPrefix[p] += 1;
    }
    if (v) {
      if (!countVersion[v]) countVersion[v] = 1;
      else countVersion[v] += 1;
    }
  });
  let maxPrefix = defaultBasePrefix;
  let maxPrefixCount = 0;
  Object.keys(countPrefix).forEach((p) => {
    if (countPrefix[p] > maxPrefixCount) {
      maxPrefixCount = countPrefix[p];
      maxPrefix = p;
    }
  });
  let maxVersion = defaultBaseVersion;
  let maxVersionCount = 0;
  Object.keys(countVersion).forEach((v) => {
    if (countVersion[v] > maxVersionCount) {
      maxVersionCount = countVersion[v];
      maxVersion = v;
    }
  });
  return [maxPrefix, maxVersion];
}
/**
 * 内部方法，获取代码中:\
 * 所有的接口前缀对照表`prefixMap`\
 * “租户ID”获取方式`tenantMap`
 */
function getCodeMaps(code: string) {
  const prefixMap: { [prefix: string]: string } = {};
  if (!code.match(getPrefixConfigReg)) return prefixMap;
  const knownPrefix = (code.match(getPrefixConfigReg) || ['', ''])[1].replace(/\s/g, '').split(',');
  knownPrefix.forEach((p) => {
    const match = code.match(getPrefixMapReg(p));
    if (match) prefixMap[match[1]] = p;
  });
  return prefixMap;
}
/**
 * 内部方法，向代码中引入`platformUrlFactory`
 * 根据传入的`options`生成`getPlatformUrl`
 */
function importUrlFactory(code: string, options: replaceUrlOptions): [string, string[]] {
  let _code = code;
  const res: string[] = [];
  let codeList = _code.split('\n');
  // 引入 platformUrlFactory
  if (_code.match(getO2UtilsReg)) {
    _code = _code.replace(
      getO2UtilsReg,
      `import { $1, platformUrlFactory } from 'o2Utils/o2Utils';`
    );
    codeList = _code.split('\n');
  } else {
    codeList.splice(
      getImportLine(_code, 'import'),
      0,
      `import { platformUrlFactory } from 'o2Utils/o2Utils';`
    );
  }
  _code = codeList.join('\n');
  const { basePrefix, baseVersion } = options;
  const getPlatformUrlLine =
    baseVersion === defaultBaseVersion
      ? `const getPlatformUrl = platformUrlFactory(${basePrefix});`
      : `const getPlatformUrl = platformUrlFactory({ prefix: ${basePrefix}, version: \`${baseVersion}\` });`;
  codeList.splice(getImportLine(_code, 'code-start'), 0, getPlatformUrlLine);
  _code = codeList.join('\n');
  return [_code, res];
}
function getImportLine(code: string, type: 'code-start' | 'import-end' | 'import') {
  const lines = code.split('\n');
  /** 是否计入`import './index.less'`这种 */
  const readImportFile = type === 'import-end' || type === 'code-start';
  let i = 0;
  lines.forEach((line, index) => {
    if (/^\s*\/\//.test(line)) return;
    if (/\}\s*from\s*["']\S+["'];*\s*$/.test(line)) i = index;
    if (readImportFile && /^\s*import\s*["']\S+["'];*\s*$/.test(line)) i = index;
  });
  i += type === 'code-start' ? 2 : 1;
  return i;
}
/**
 * 内部方法，将代码中所有\
 * 形如`${prefix}/v1/${organizationId}/xxx`的路径\
 * 替换为`getPlatformUrl("xxx", { ... })` */
function replaceUrl(code: string, options: replaceUrlOptions): [string, string[]] {
  let _code = code;
  let safe = 1e4;
  let match = _code.match(getApiReg);
  const res: string[] = [];
  while (safe-- && match) {
    const { 0: str, index = 0 } = match;
    const rep = generatePlatformUrl(str, options);
    res.push(`替换：“${str}” -> “${rep}”`);
    _code = _code.slice(0, index) + rep + _code.slice(index + str.length);
    match = _code.match(getApiReg);
  }
  return [_code, res];
}

function generatePlatformUrl(code: string, options: replaceUrlOptions) {
  const { basePrefix, baseVersion, prefixMap, tenantMap } = options;
  const match = code.match(getApiReg);
  if (!match) return code;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, prefix, version, tenantId, path] = match;
  // eslint-disable-next-line no-console
  if (!tenantMap.includes(tenantId.replace(/^\$\{\s*/, '').replace(/\s*\}$/, ''))) {
    console.error('未知的“租户ID”获取方式: ', tenantId);
  }
  const needPrefix = !(prefix === basePrefix || prefixMap[prefix] === basePrefix);
  const needVersion = version !== baseVersion;
  const getPlatformUrlOptions: string[] = [];
  if (needPrefix) getPlatformUrlOptions.push(`prefix: ${prefix}`);
  if (needVersion) getPlatformUrlOptions.push(`version: '${version}'`);
  const option = getPlatformUrlOptions.join(', ');
  return option ? `getPlatformUrl(\`${path}\`, { ${option} })` : `getPlatformUrl(\`${path}\`)`;
}
