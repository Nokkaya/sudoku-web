# Sudoku Master - Web Version

A beautiful and elegant Sudoku game built with Vue 3 + Vite.

![Vue](https://img.shields.io/badge/Vue-3.4-4FC08D?style=flat-square&logo=vue.js)
![Vite](https://img.shields.io/badge/Vite-7.3.1-646CFF?style=flat-square&logo=vite)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

**🌐 Play Online: [https://nokkaya.github.io/sudoku-web/](https://nokkaya.github.io/sudoku-web/)**

---

## 📱 WeChat Miniprogram

This project now includes the source code for the WeChat Miniprogram version, perfectly replicating the Web UI and experience.

- **Perfect Replicate** - 1:1 restoration of the beautiful Web UI
- **Native Experience** - Fast startup and smooth interaction
- **Grid Keypad** - Optimized number input experience
- **State Saving** - Auto-save progress on exit

Source code is located in the `miniprogram/` directory. Import it into WeChat Developer Tools to run.

---

## ✨ Features

- 🎮 **Complete Sudoku Experience** - Full-featured game with smart controls
- 📱 **Responsive Design** - Perfect on mobile, tablet, and desktop
- 🎨 **Warm Minimalist UI** - Clean and comfortable visual design
- ⏱️ **Timer & Statistics** - Track your solve time
- 💡 **Smart Hints** - Get help when stuck
- 🌙 **Three Difficulty Levels** - Easy, Medium, Hard
- 🚀 **Fast Loading** - Optimized performance with smooth animations
- 🔄 **Quick Restart** - Jump back to menu anytime

---

## 🚀 Quick Start

### Install Dependencies

```bash
npm install
```

### Development Mode

```bash
npm run dev
```

Then open http://localhost:5173 in your browser

### Build for Production

```bash
npm run build
```

The built files will be in the `docs/` directory, ready for GitHub Pages deployment.

---

## 📁 Project Structure

```
sudoku-web/
├── index.html          # Entry HTML
├── package.json        # Project configuration
├── vite.config.js      # Vite configuration
├── miniprogram/        # Miniprogram Source [NEW]
│   ├── components/     # Components
│   ├── pages/          # Pages
│   ├── utils/          # Utilities
│   ├── app.js          # App Logic
│   ├── app.json        # App Config
│   └── app.wxss        # Global Styles
└── src/
    ├── main.js         # Application entry point
    ├── App.vue         # Main component (all logic & styles)
    ├── assets/
    │   └── styles.css  # Global styles
    └── utils/
        └── sudoku.js   # Sudoku generation algorithm
```

---

## 🛠️ Tech Stack

- **Vue 3** - Progressive JavaScript Framework
- **Composition API** - Modern component logic organization
- **Vite 6** - Next-generation frontend build tool
- **CSS3** - Pure CSS, no framework dependencies
- **WeChat Miniprogram** - Native Miniprogram development (WXML/WXSS/JS/WXS)
- **GitHub Pages** - Free static site hosting

---

## 🎮 How to Play

1. **Select Difficulty** - Choose from Easy, Medium, or Hard
2. **Tap a Cell** - Click/tap to select an empty cell
3. **Enter a Number** - Use the number pad at the bottom (1-9)
4. **Use Eraser** - Remove incorrect numbers
5. **Get Hints** - Use hints when stuck (limited to 3)
6. **Complete the Puzzle** - Fill all cells to win!

---

## 📝 Sudoku Rules

Classic Sudoku rules are simple:

- ✅ Each row must contain numbers 1-9 without repetition
- ✅ Each column must contain numbers 1-9 without repetition
- ✅ Each 3×3 box must contain numbers 1-9 without repetition

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

- 🐛 Report bugs
- 💡 Suggest new features
- 🔧 Submit pull requests
- 📖 Improve documentation

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Nokkaya**

- � GitHub: [@Nokkaya](https://github.com/Nokkaya)
- 🌐 Website: [https://nokkaya.github.io/](https://nokkaya.github.io/)

---

## 🙏 Acknowledgments

- Inspired by classic Sudoku games
- Built with love using Vue 3
- Deployed on GitHub Pages

---

**Enjoy the game!** 🎉
