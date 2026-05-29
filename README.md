# TechValues - 计算机科技理念测试

一个类似 8values 的测试，帮助你了解自己在计算机科技领域的理念倾向。

## 🎯 测试维度

| 维度 | 描述 |
|------|------|
| 免费 vs 商业 | 软件应该免费还是商业化 |
| 开源 vs 闭源 | 源代码应该公开还是专有 |
| 个体 vs 中心化 | 去中心化还是大平台主导 |
| 自由 vs 安全 | 黑客精神还是安全优先 |

## 🚀 快速开始

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建
pnpm build
```

## 📦 部署到 GitHub Pages

1. 构建项目后，`docs/` 文件夹会自动生成
2. 在 GitHub 仓库设置中，将 Pages 源设置为 `docs/` 文件夹
3. 访问 `https://<username>.github.io/techvalues/`

## 📝 自定义

### 修改题目

编辑 `src/data/questions.json`：

```json
{
  "id": 1,
  "text": "你的问题",
  "effect": {
    "free_commercial": 1.0,
    "public_proprietary": 0.5,
    "individual_center": 0,
    "freedom_security": -0.5
  },
  "tags": {
    "strongly_agree": ["tag_id_1"],
    "agree": ["tag_id_2"]
  }
}
```

- `effect`: -1.0 到 1.0，正值倾向左侧，负值倾向右侧
- `tags`: 当用户选择该选项时触发的次级标签

### 修改意识形态

编辑 `src/data/ideologies.json`

### 修改次级标签

编辑 `src/data/tags.json`

## 📄 License

MIT