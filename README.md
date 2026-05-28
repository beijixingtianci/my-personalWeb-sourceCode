# 个人网站源码

[![Website](https://img.shields.io/badge/在线访问-beijixingtianci.github.io-blue?style=flat-square&logo=github)](https://beijixingtianci.github.io)
[![Vue](https://img.shields.io/badge/Vue-3.x-42b883?style=flat-square&logo=vue.js)](https://vuejs.org)
[![Vite](https://img.shields.io/badge/Vite-5.x-646cff?style=flat-square&logo=vite)](https://vitejs.dev)
[![Render](https://img.shields.io/badge/后端-Render-46e3b7?style=flat-square&logo=render)](https://render.com)
[![Supabase](https://img.shields.io/badge/数据库-Supabase-3ecf8e?style=flat-square&logo=supabase)](https://supabase.com)

个人网站源码仓库。基于 **Vue 3 + Vite** 构建，部署在 **GitHub Pages**。

## 🌐 在线访问

[https://beijixingtianci.github.io](https://beijixingtianci.github.io)

> 部署仓库：[beijixingtianci.github.io](https://github.com/beijixingtianci/beijixingtianci.github.io)（仅包含打包后的 dist 文件）

## 📁 页面结构

| 路由 | 页面 | 说明 |
|------|------|------|
| `/` | 首页 | 个人简介 + 导航按钮 |
| `/union` | 学联官网 | 建国大学中国留学生学生会官网（独立子站） |
| `/projects` | 项目列表 | 我的项目展示（卡片式布局） |
| `/contact` | 联系方式 | 微信二维码等联系信息 |

## 🛠 技术栈

### 前端
- **Vue 3** (Options API)
- **Vite** - 构建工具
- **Vue Router** (Hash 模式，适配 GitHub Pages)
- **Font Awesome** - 图标库
- 纯 CSS 样式（无 UI 框架）

### 后端服务
- **Node.js + Express**
- 部署在 **Render**

### 数据库
- **Supabase PostgreSQL**

## 🚀 本地开发

```bash
# 1. 克隆源码仓库
git clone https://github.com/beijixingtianci/my-personalWeb-sourceCode.git

# 2. 进入目录
cd my-personalWeb-sourceCode

# 3. 安装依赖
npm install

# 4. 启动开发服务器
npm run dev
```

## 📦 构建部署

```bash
# 构建生产环境（生成 dist 文件夹）
npm run build

# dist 文件夹内容用于部署到 GitHub Pages
```

## 🏗 项目架构

```
┌─────────────────────────────────────┐
│         Vue 前端 (本仓库)            │
│    源码: Vue 3 + Vite + Vue Router   │
└──────────────┬──────────────────────┘
               │ 调用 API
┌──────────────▼──────────────────────┐
│      Render 后端服务                 │
│      Node.js + Express              │
└──────────────┬──────────────────────┘
               │ 连接数据库
┌──────────────▼──────────────────────┐
│      Supabase PostgreSQL            │
└─────────────────────────────────────┘
```

## 📂 目录结构

```
my-personalWeb-sourceCode/
├── public/              # 静态资源
│   ├── images/          # 图片资源
│   └── icons.svg        # SVG 图标
├── src/
│   ├── assets/          # 项目资源
│   ├── components/      # 公共组件
│   ├── pages/           # 页面组件
│   │   ├── Home.vue     # 首页
│   │   ├── Union.vue    # 学联官网
│   │   ├── Projects.vue # 项目列表
│   │   └── Contact.vue  # 联系方式
│   ├── router/          # 路由配置
│   │   └── index.js
│   ├── App.vue          # 根组件
│   ├── main.js          # 入口文件
│   └── style.css        # 全局样式
├── index.html           # HTML 模板
├── vite.config.js       # Vite 配置
├── package.json         # 依赖配置
└── README.md            # 本文件
```

## 🔗 相关仓库

| 仓库 | 说明 |
|------|------|
| [beijixingtianci.github.io](https://github.com/beijixingtianci/beijixingtianci.github.io) | 部署仓库（GitHub Pages） |
| [my-personalWeb-sourceCode](https://github.com/beijixingtianci/my-personalWeb-sourceCode) | 源码仓库（本仓库） |

## 📝 说明

- 本仓库为**源码仓库**，包含完整的 Vue 项目源代码
- 开发完成后运行 `npm run build` 生成 `dist` 文件夹
- 将 `dist` 内容推送到部署仓库即可更新网站

---

**作者：** 北极星.天赐
