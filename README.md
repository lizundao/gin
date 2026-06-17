# gin.wiki

Gin 框架多语言文档站，纯静态，部署于 Cloudflare Pages。

- 站点：[gin.wiki](https://gin.wiki)
- 文档来源：[gin-gonic/website](https://github.com/gin-gonic/website/tree/master/src/content/docs)
- 技术栈：Astro + Starlight + Tailwind CSS v4

## 开发

```bash
npm install
npm run dev
```

## 同步官方文档

只拉取文档内容，不克隆整站。**不会覆盖** `src/content/pages/` 下的本地页面（关于页、首页等），同步后自动写回：

```bash
npm run sync-docs
```

本地页面源文件位置：

- `src/content/pages/about/{locale}.md` - 各语言关于页
- `src/content/pages/index.mdx` - 根首页

## 构建与部署

```bash
npm run build
npm run deploy
```

或在 Cloudflare Pages 控制台连接仓库，构建设置：

| 项 | 值 |
|---|---|
| 构建命令 | `npm run build` |
| 输出目录 | `dist` |
| Node 版本 | `20` |

## 多语言

默认语言为简体中文。根路径 `/` 重定向至 `/zh-cn/`。

## 设计

- 主色：Gin 官方蓝 `hsl(215, 69%, 52%)`
- 中文标题用 ZCOOL XiaoWei，正文与导航用 IBM Plex Sans
- 侧栏激活态：左侧蓝条 + 浅蓝底 + 深色文字（高对比）
- Logo / Favicon 同步自 [gin-gonic/website](https://github.com/gin-gonic/website)

## 推送到 GitHub

```bash
git add .
git commit -m "feat: gin.wiki 多语言文档站"
git push -u origin main
```

仓库地址：https://github.com/lizundao/gin
