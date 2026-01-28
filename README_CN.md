# 数独大师 - 网页版

一个精美优雅的数独网页游戏，使用 Vue 3 + Vite 构建。

![Vue](https://img.shields.io/badge/Vue-3.4-4FC08D?style=flat-square&logo=vue.js)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=flat-square&logo=vite)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

**🌐 在线游玩: [https://nokkaya.github.io/sudoku-web/](https://nokkaya.github.io/sudoku-web/)**

---

## ✨ 特性

- 🎮 **完整数独体验** - 功能丰富的游戏，智能操作
- 📱 **响应式设计** - 手机、平板、电脑完美适配
- 🎨 **温暖极简UI** - 简洁舒适的视觉设计
- ⏱️ **计时与统计** - 记录你的解题时间
- 💡 **智能提示** - 卡关时获取帮助
- 🌙 **三种难度** - 简单、中等、困难
- 🚀 **快速加载** - 优化性能，流畅动画
- 🔄 **快速返回** - 随时返回主菜单

---

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

然后在浏览器中打开 http://localhost:5173

### 构建生产版本

```bash
npm run build
```

构建后的文件位于 `docs/` 目录，可直接部署到 GitHub Pages。

---

## 📁 项目结构

```
sudoku-web/
├── index.html          # 入口 HTML
├── package.json        # 项目配置
├── vite.config.js      # Vite 配置
└── src/
    ├── main.js         # 应用入口
    ├── App.vue         # 主组件（包含所有逻辑和样式）
    ├── assets/
    │   └── styles.css  # 全局样式
    └── utils/
        └── sudoku.js   # 数独生成算法
```

---

## 🛠️ 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **Composition API** - 现代组件逻辑组织方式
- **Vite 6** - 下一代前端构建工具
- **CSS3** - 纯 CSS，无框架依赖
- **GitHub Pages** - 免费静态网站托管

---

## 🎮 如何游玩

1. **选择难度** - 从简单、中等、困难中选择
2. **点击格子** - 点击/触摸选择空格
3. **输入数字** - 使用底部数字键盘（1-9）
4. **使用橡皮擦** - 删除错误数字
5. **获取提示** - 卡关时使用提示（限3次）
6. **完成谜题** - 填满所有格子即可通关！

---

## 📝 数独规则

经典数独规则很简单：

- ✅ 每行必须包含 1-9 且不重复
- ✅ 每列必须包含 1-9 且不重复
- ✅ 每个 3×3 宫格必须包含 1-9 且不重复

---

## 🤝 贡献

欢迎贡献！您可以：

- 🐛 报告 bugs
- 💡 提出新功能建议
- 🔧 提交 Pull Request
- 📖 改进文档

---

## 📄 许可证

本项目采用 MIT 许可证。

---

## 👨‍💻 作者

**Nokkaya**

- 💻 GitHub: [@Nokkaya](https://github.com/Nokkaya)
- 🌐 网站: [https://nokkaya.github.io/](https://nokkaya.github.io/)

---

## 🙏 致谢

- 灵感来源于经典数独游戏
- 使用 Vue 3 爱心打造
- 部署于 GitHub Pages

---

**祝你玩得开心！** 🎉