# 小程序模板项目

基于 Taro + React + Redux Toolkit 的跨平台小程序开发模板

## 🛠 技术栈

### 核心框架

- **[Taro 4.0.12](https://taro-docs.jd.com/)** - 跨平台小程序开发框架
- **[React 18](https://react.dev/)** - 前端基础库
- **[TypeScript 5.1+](https://www.typescriptlang.org/)** - 静态类型检查

### 状态管理

- **[@reduxjs/toolkit 2.3+](https://redux-toolkit.js.org/)** - Redux状态管理工具包
- **[react-redux 9.2+](https://react-redux.js.org/)** - React Redux绑定

### UI组件

- **[@taroify/core 0.8+](https://taroify.gitee.io/taroify.com/)** - 基于Taro的移动端组件库
- **[@taroify/icons 0.8+](https://taroify.gitee.io/taroify.com/)** - Taroify图标库
- **[TailwindCSS 4.1+](https://tailwindcss.com/)** - 原子化CSS框架

### 网络请求

- **[axios 1.7+](https://axios-http.com/)** - HTTP客户端
- **[ahooks 3.8+](https://ahooks.js.org/)** - React Hooks工具库

### 工程化工具

- **[ESLint 9.15+](https://eslint.org/)** - 代码质量检查
- **[Prettier 3.3+](https://prettier.io/)** - 代码格式化
- **[Stylelint 14.4+](https://stylelint.io/)** - 样式代码检查
- **[Husky 9.1+](https://typicode.github.io/husky/)** - Git hooks工具
- **[lint-staged 15.2+](https://github.com/okonet/lint-staged)** - 暂存文件检查

## 📁 项目结构

```
template-taro/
├── config/                    # 构建配置
│   ├── dev.ts                 # 开发环境配置
│   ├── prod.ts                # 生产环境配置
│   └── index.ts               # 配置入口
├── public/                    # 静态资源
│   └── static/
│       └── images/            # 静态图片资源
├── src/                       # 源码目录
│   ├── app.config.ts          # 应用全局配置（页面路由、tabBar等）
│   ├── app.css                # 全局样式
│   ├── app.tsx                # 应用入口组件
│   ├── assets/                # 项目资源文件
│   │   ├── icon.png           # 应用图标
│   │   └── tab-bar/           # TabBar图标资源
│   ├── components/            # 公共组件
│   │   └── readme.md          # 组件开发规范
│   ├── hooks/                 # 自定义Hooks
│   │   └── useCommon.ts       # 通用业务逻辑Hooks
│   ├── layout/                # 页面布局组件
│   │   ├── Header.tsx         # 页面头部组件
│   │   ├── SEO.tsx            # SEO优化组件
│   │   └── index.tsx          # 布局组件入口
│   ├── pages/                 # 页面组件
│   │   ├── home/              # 首页模块
│   │   │   ├── index.module.scss  # 页面样式（CSS Modules）
│   │   │   └── index.tsx      # 页面组件
│   │   └── mine/              # 个人中心模块
│   │       └── index.tsx      # 页面组件
│   ├── store/                 # Redux状态管理
│   │   ├── services/          # API服务层
│   │   │   ├── API.d.ts       # API类型定义
│   │   │   ├── common.ts      # 公共API服务
│   │   │   └── user.ts        # 用户相关API服务
│   │   ├── slices/            # Redux切片
│   │   │   ├── common.ts      # 公共状态切片
│   │   │   ├── loading.ts     # 加载状态切片
│   │   │   ├── seo.ts         # SEO状态切片
│   │   │   └── user.ts        # 用户状态切片
│   │   └── store.ts           # Store配置和类型导出
│   └── utils/                 # 工具函数
│       ├── api.ts             # API请求封装（包含流式响应）
│       ├── consts.ts          # 常量定义
│       ├── json.ts            # JSON处理工具
│       ├── storage.h5.ts      # H5存储工具
│       ├── storage.ts         # 通用存储工具
│       ├── url.ts             # URL处理工具
│       └── util.ts            # 通用工具函数
├── types/                     # 全局类型定义
│   ├── global.d.ts            # 全局类型声明
│   └── react-extend.d.ts      # React扩展类型
├── babel.config.cjs           # Babel配置
├── eslint.config.js           # ESLint配置
├── postcss.config.js          # PostCSS配置
├── prettier.config.js         # Prettier配置
├── project.config.json        # 小程序项目配置
├── stylelint.config.js        # Stylelint配置
└── tsconfig.json              # TypeScript配置
```

## 📋 文件夹代码规范

### `/src/pages/` - 页面组件

- 每个页面一个文件夹，包含 `index.tsx` 和样式文件
- 页面组件使用函数组件 + Hooks
- 页面级状态使用 `useState`，全局状态使用 Redux
- 样式文件支持：`.module.scss`、`.module.css`

### `/src/components/` - 公共组件

- 可复用的UI组件，按功能分类存放
- 组件命名使用PascalCase（如：`UserCard.tsx`）
- 每个组件包含：组件文件、样式文件、类型定义
- 导出方式：`export default ComponentName`

### `/src/store/` - 状态管理

- **`slices/`**: Redux Toolkit的切片，按业务模块划分
- **`services/`**: API服务层，封装后端接口调用
- **`store.ts`**: Store配置，导出typed hooks（`useAppDispatch`、`useAppSelector`）

### `/src/utils/` - 工具函数

- **`api.ts`**: Axios封装，支持请求/响应拦截、错误处理、文件上传、流式响应
- **`storage.ts`**: 本地存储封装，兼容小程序和H5
- **`consts.ts`**: 应用常量（API地址、默认配置等）
- 其他工具函数按功能命名

### `/src/hooks/` - 自定义Hooks

- 业务逻辑复用，命名以 `use` 开头
- **`useCommon.ts`**: 通用业务逻辑（如：全局初始化）
- 按功能模块拆分（如：`useAuth.ts`、`useApi.ts`）

### `/src/assets/` - 静态资源

- **`images/`**: 图片资源，按功能分类
- **`tab-bar/`**: TabBar相关图标
- 图片命名：小写字母+连字符（如：`user-avatar.png`）

## 🚀 开发命令

```bash
# 安装依赖
pnpm install

# 开发环境
pnpm dev              # 微信小程序
pnpm dev:h5           # H5
pnpm dev:alipay       # 支付宝小程序
pnpm dev:swan         # 百度小程序
pnpm dev:tt           # 字节跳动小程序

# 构建
pnpm build            # 生产构建（微信小程序）
pnpm build:h5         # H5构建

# 代码检查
pnpm lint             # 运行所有检查
pnpm lint:js          # JavaScript/TypeScript检查
pnpm lint:style       # 样式检查
pnpm prettier         # 代码格式化
```

## 🎯 特性支持

- ✅ 多端发布（微信/支付宝/百度/字节跳动小程序、H5）
- ✅ TypeScript全量支持
- ✅ Redux Toolkit状态管理
- ✅ TailwindCSS原子化样式
- ✅ Taroify组件库
- ✅ 文件上传（支持小程序和H5）
- ✅ 流式响应处理
- ✅ 代码质量检查（ESLint + Prettier + Stylelint）
- ✅ Git提交规范（Husky + lint-staged）
- ✅ SEO优化支持

## 📝 开发规范

1. **命名规范**：组件PascalCase，文件kebab-case，常量UPPER_CASE
2. **类型定义**：优先使用TypeScript类型，避免any
3. **状态管理**：页面级用useState，跨页面用Redux
4. **样式方案**：优先TailwindCSS，复杂样式用CSS Modules
5. **API调用**：统一使用封装的axios实例
6. **错误处理**：使用try-catch包装异步操作
7. **代码提交**：遵循Conventional Commits规范
