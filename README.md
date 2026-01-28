# Sudoku Master - WeChat Mini Program

A minimalist Sudoku game built with WeChat Mini Program, featuring complete Sudoku algorithm, three difficulty levels, and smart hints.

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
- **Minimalist Aesthetic** - Pure white background, clean and elegant
- **Monochrome Palette** - Black board with white numbers, timeless sophistication
- **Refined Typography** - Carefully selected fonts and letter spacing
- **Thoughtful Spacing** - Generous white space for visual breathing room

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

## 🎨 Design Highlights

### Visual Identity
The design embraces a "less is more" philosophy with:
- **Pure white canvas** - Distraction-free gaming environment
- **Bold black accents** - High-contrast elements for clarity
- **Subtle gray tones** - Sophisticated hierarchy and depth
- **SVG vector graphics** - Crisp icons at any resolution

### Interface Elements
- **Number Board**: Black background with white numerical display
- **Input Keypad**: Clean, pressable buttons with subtle shadows
- **Action Buttons**: Minimalist icons with refined typography
- **Timer Display**: Monospace font for precise timing feel

### Interaction Design
- **Selection Highlights** - Connected row, column, and box highlight
- **Touch Feedback** - Visual response on button presses
- **Smooth Transitions** - Animated state changes throughout

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