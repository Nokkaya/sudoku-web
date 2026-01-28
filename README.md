# Sudoku Master - WeChat Mini Program

A vibrant and refreshing Sudoku game built with WeChat Mini Program, featuring complete Sudoku algorithm, three difficulty levels, and smart hints.

![Sudoku Master](https://img.shields.io/badge/WeChat_Mini_Program-Sudoku-blue?style=for-the-badge&logo=wechat)
![GitHub stars](https://img.shields.io/github/stars/Nokkaya/sudoku-wechat?style=for-the-badge)
![GitHub license](https://img.shields.io/github/license/Nokkaya/sudoku-wechat?style=for-the-badge)

## ✨ Features

### Core Functionality
- **Smart Sudoku Algorithm** - Auto-generate valid puzzles with unique solutions
- **Three Difficulty Levels** - Easy (30 holes), Medium (40 holes), Hard (50 holes)
- **Hint System** - 3 hints per game to help you progress
- **Timer** - Precisely track your completion time
- **Real-time Validation** - Check number validity instantly

### Design Philosophy
- **Vibrant Palette** - Refreshing blue and green color scheme
- **Vibrant Energy** - Dynamic gradient buttons with youthful spirit
- **Soft Contrast** - Deep charcoal board with fresh green highlights
- **Clean Background** - Subtle light gray for comfortable gaming

### User Experience
- **Smooth Animations** - Fluid transitions for all interactions
- **Smart Highlighting** - Row, column, and box联动 highlight on cell selection
- **Responsive Layout** - Adapt to various screen sizes
- **Intuitive Controls** - Virtual number pad for quick input

## 🚀 Quick Start

### Requirements
- WeChat Developer Tools (latest version)
- WeChat Base Library 2.19.0+ (recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Nokkaya/sudoku-wechat.git
   cd sudoku-wechat
   ```

2. **Import in WeChat DevTools**
   - Open WeChat Developer Tools
   - Click "+" to add a new project
   - Select the `sudoku-wechat` folder
   - Click "Import"

3. **Build and Run**
   - Click the "Compile" button in WeChat DevTools
   - Preview in simulator or real device

## 📁 Project Structure

```
sudoku-wechat/
├── app.js              # App entry file
├── app.json            # App configuration
├── project.config.json # WeChat DevTools configuration
├── images/
│   └── logo.svg        # SVG brand logo
├── utils/
│   └── sudoku.js       # Core Sudoku algorithm
└── pages/
    ├── index/          # Home page module
    │   ├── index.js    # Home page logic
    │   ├── index.wxml  # Home page template
    │   └── index.wxss  # Home page styles
    └── game/           # Game page module
        ├── game.js     # Game logic
        ├── game.wxml   # Game template
        └── game.wxss   # Game styles
```

## 🎮 How to Play

### Select Difficulty
1. Open the mini program
2. Choose your difficulty (Easy / Medium / Hard)
3. Tap "Start Game" to begin

### Game Controls
- **Select Cell**: Tap any empty cell to select
- **Input Number**: Tap numbers on the bottom keypad
- **Clear Cell**: Use the erase button to remove numbers
- **Get Hint**: Tap "Hint" to fill the current cell
- **Restart**: Tap "Restart" to start a new game

### Winning Conditions
Fill all cells with numbers that follow Sudoku rules:
- Each row contains 1-9 exactly once
- Each column contains 1-9 exactly once
- Each 3x3 box contains 1-9 exactly once

## 🎨 Design System

### Color Palette

| Color | Hex Code | Usage |
|-------|----------|-------|
| Vibrant Blue | `#0066FF` | Primary buttons, selection, active states |
| Fresh Green | `#00D68F` | User numbers, indicators, success states |
| Charcoal | `#2D3436` | Game board background |
| Light Gray | `#F8F9FA` | Page background |
| Pure White | `#FFFFFF` | Cards, containers |
| Soft Red | `#FFE8E8` | Erase button background |

### Design Philosophy
- **Refreshment** - Blue-green gradient brings youthful energy
- **Contrast** - Deep charcoal board with fresh green highlights
- **Comfort** - Light gray background reduces eye strain
- **Clarity** - Bold typography with generous spacing

### Visual Highlights
- **Start Button** - Dynamic blue-to-green gradient with shadow
- **Game Board** - Warm charcoal with clear white grid lines
- **User Numbers** - Vibrant green for instant visual distinction
- **Erase Button** - Soft red background for clear differentiation

## 🛠 Tech Stack

- **Framework**: WeChat Mini Program (Native)
- **Algorithm**: Backtracking algorithm for puzzle generation
- **Styles**: WXML + WXSS
- **Logic**: JavaScript (ES6+)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork this project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Changelog

### v1.2.0 (2026-01-28)
- **Color Refresh** - Vibrant blue and green color scheme
- **Dynamic Gradient** - Blue-to-green gradient on primary button
- **Enhanced Board** - Warm charcoal instead of stark black
- **Fresh Highlights** - Green accent for user-inputted numbers
- **Comfortable Background** - Light gray #F8F9FA instead of pure white
- **Soft Interactions** - Subtle shadows and smooth transitions

### v1.1.0 (2026-01-28)
- **UI Redesign** - Complete minimalist redesign
- **Removed** - All gradient backgrounds, emoji icons
- **Added** - SVG vector logo, pure CSS icons
- **Improved** - Black and white color scheme
- **Enhanced** - Typography and spacing

### v1.0.0 (2026-01-28)
- Initial release
- Complete Sudoku game functionality
- Three difficulty modes
- Hint system
- Timer functionality
- Beautiful UI design

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- WeChat Mini Program Documentation
- Classic backtracking algorithm for Sudoku generation

## 📧 Contact

- **GitHub**: [@Nokkaya](https://github.com/Nokkaya)
- **Repository**: [sudoku-wechat](https://github.com/Nokkaya/sudoku-wechat)

---

**Enjoy the game!**

*Challenge your logic, master the grid.*