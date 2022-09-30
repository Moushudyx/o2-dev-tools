<!--
 * @Author: Moushu
 * @Date: 2021-11-30 14:09:39
 * @LastEditTime: 2022-03-16 17:19:27
-->

# 老船长的前端脚手架

ms-esbuild-react-scaffold，使用 esbuild 作为打包工具的 react 脚手架，最前面的`ms`是防重名的前缀。

## 介绍

自用的使用 esbuild 为打包工具的 react 网页应用模板，使用的 CSS 预处理器为 SCSS。

初次使用，按照安装步骤走下载代码后，执行 `yarn serve` 即可启动。

启动后默认显示一个示例页面，该页面的代码在 `pages/Index`。

### 安装教程

我是菜鸟，不会写脚手架（`npx XXXX`这样的），因此使用方式是：

1. 下载仓库到一个合适的地方
2. 改掉 package.json 和 README.md
3. 删除 .git 文件夹，执行指令 `git init`

### 使用方法

1. `yarn serve` 开启本地服务（默认端口 5000），监听代码更新，修改后会刷新页面
2. `yarn build` 打包应用，打包为 bundle.js 和 bundle.css （还有压缩版）放在 dist 文件夹
3. `yarn lint` 代码质量检查，注意根据实际需要编写 eslint 规则

## 软件架构

1. 打包工具是 esbuild，使用了 esbuild-sass-plugin 等插件
    1. esbuild-sass-plugin 插件用到了 postcss-modules 因此这个依赖尽量不要动
    2. 打包和本地服务的脚本都在 script 文件夹下
2. 用 eslint 规范代码，用 prettier 格式化代码
    1. eslint 规则放在 settings 文件夹里
3. 开发框架是 React，因此使用 React-Router 作为路由组件
    1. 本地启动服务时，使用哈希路由；打包时使用浏览器路由
    2. 如果要打包为使用哈希路由的软件，请使用 `yarn build-hash` 方法

### 开发环境

1. 推荐使用 VSCode 等支持 eslint、prettier 的编辑工具或 IDE
2. 没有添加路由功能，需要自行添加（自己实现一个也行）
3. 目前写法是新的页面写到 src/pages 下面，这个没有任何规范，只是写着方便
4. 编译的入口文件是 src/index.tsx，如果删除或改名会出问题

### 别名功能

使用了 TypeScript 自带的别名功能

| 别名       | 路径            | 示例                                       |
| ---------- | --------------- | ------------------------------------------ |
| Pages      | pages/          | import Container from 'Pages/Container'    |
| Utils      | src/utils/      | import { useNightMode } from 'Utils/utils' |
| Components | src/components/ | import { Para } from 'Components/Typo'     |

### 使用 SCSS

具体用法可以参考示例页面的用法

1. CSS 模块：任何以 `.module.scss`、`.mod.scss`、`.m.scss` 结尾的文件将视为 CSS 模块
2. CSS 文本：任何以 `.text.scss`、`.txt.scss`、`.t.scss` 结尾的文件将编译为 CSS 后以字符串引入
3. 普通 CSS 文件：其他的 SCSS 文件将视为普通的 CSS 文件打包

### 实用工具

所有的实用工具都在 `src/utils` 下，可以通过 `import { XXX } from 'Utils/utils'` 调用。

1. localStorage 封装，封装了 localStorage 的基础操作。
2. 类型守卫，常见的 typescript 类型守卫。

### 文件结构

- script 脚本
  - `script/bundle.js` 打包脚本
  - `script/serve.js` 本地预览脚本
  - `script/tools/` 本地脚本使用的工具代码
    - `script/tools/core.js` 打包与预览脚本的核心代码
    - `script/tools/port.js` 寻找可用端口
    - `script/tools/format-XXX.js` 控制台输出格式化
- settings 配置
  - `settings/eslint-XXX.js` eslint 配置文件
- pages 页面
  - `pages/routers.tsx` 路由配置文件
  - `pages/Index/` 示例页面
    - `pages/Index/index.tsx` 示例页面代码文件
    - `pages/Index/index.module.scss` 示例 SCSS 模块
    - `pages/Index/index.text.scss` 示例 SCSS 文本
- src 核心代码
  - `src/config/` 配置文件
  - `src/components/` 通用组件
  - `src/utils/` 通用工具
  - `src/App.tsx` 逻辑上的入口文件
  - `src/App.scss` 全局样式，优先级低
  - `src/scss/` 全局样式，优先级高
    - `src/scss/index.scss` 全局样式入口文件
  - `src/index.tsx` 编译/预览时用的入口文件

## 使用说明

1. 记得改掉 package.json 和 README.md
2. 记得下载之后记得删了 .git 文件夹
3. build 和 serve 用的脚本在 script 文件夹里
4. 不喜欢强制每行添加分号、箭头函数加括号的话，可以去 .prettierrc 里改规则
5. 记得给 IDE 添加 eslint 和 prettier 插件（参与开发的每一个人都要加）
6. 脚手架自带的本地服务功能，只能使用哈希路由

## 参与贡献

1. 切出（fork）仓库到你的名下
2. 新建 feat-xxx / bugfix-xxx 分支
    1. `feat` 类型的分支一般用于添加**影响较大的功能**或**影响较大的改动**
    2. `bugfix` 类型的分支一般用于修复代码漏洞（可以简写为 `bug-xxx`）
3. 提交代码，注意提交的时候附带详细的说明
4. 新建合并请求
