// game.js
const sudoku = require('../../utils/sudoku.js');

Page({
  data: {
    board: [],        // 当前盘面（用户填写的）
    originalBoard: [], // 初始盘面（不可修改）
    solution: [],      // 正确答案
    difficulty: 40,
    selectedCell: null, // 当前选中的格子
    modeName: '中等',
    timer: 0,
    timerInterval: null,
    hints: 3,  // 提示次数
    isComplete: false,
    nums: [1, 2, 3, 4, 5, 6, 7, 8, 9]
  },

  onLoad(options) {
    const difficulty = parseInt(options.difficulty) || 40;
    const modeName = options.mode || 'medium';
    
    this.setData({
      difficulty: difficulty,
      modeName: modeName === 'easy' ? '简单' : modeName === 'hard' ? '困难' : '中等'
    });
    
    this.initGame();
  },

  onUnload() {
    if (this.data.timerInterval) {
      clearInterval(this.data.timerInterval);
    }
  },

  // 初始化游戏
  initGame() {
    const board = sudoku.createPuzzle(this.data.difficulty);
    const originalBoard = board.map(row => [...row]);
    
    this.setData({
      board: board,
      originalBoard: originalBoard,
      solution: sudoku.solution,
      selectedCell: null,
      isComplete: false,
      timer: 0,
      hints: 3
    });

    // 启动计时器
    if (this.data.timerInterval) {
      clearInterval(this.data.timerInterval);
    }
    this.data.timerInterval = setInterval(() => {
      this.setData({
        timer: this.data.timer + 1
      });
    }, 1000);
  },

  // 选中格子
  selectCell(e) {
    const { row, col } = e.currentTarget.dataset;
    // 不能选中初始固定的格子
    if (this.data.originalBoard[row][col] !== 0) {
      return;
    }
    this.setData({
      selectedCell: { row, col }
    });
  },

  // 输入数字
  inputNumber(e) {
    if (!this.data.selectedCell) {
      wx.showToast({
        title: '请先选择格子',
        icon: 'none'
      });
      return;
    }

    const { row, col } = this.data.selectedCell;
    const num = e.currentTarget.dataset.num;
    
    const newBoard = this.data.board;
    newBoard[row][col] = num;
    
    this.setData({
      board: newBoard
    });

    // 检查是否完成
    this.checkComplete();
  },

  // 清除选中格子
  clearCell() {
    if (!this.data.selectedCell) return;
    
    const { row, col } = this.data.selectedCell;
    const newBoard = this.data.board;
    newBoard[row][col] = 0;
    
    this.setData({
      board: newBoard
    });
  },

  // 获取提示
  useHint() {
    if (this.data.hints <= 0) {
      wx.showToast({
        title: '没有提示次数了',
        icon: 'none'
      });
      return;
    }

    const hint = sudoku.getHint(this.data.board);
    if (!hint) return;

    const newBoard = this.data.board;
    newBoard[hint.row][hint.col] = hint.value;
    
    this.setData({
      board: newBoard,
      hints: this.data.hints - 1
    });

    wx.showToast({
      title: '提示已使用',
      icon: 'success'
    });

    this.checkComplete();
  },

  // 检查是否完成
  checkComplete() {
    // 检查是否还有空格
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (this.data.board[row][col] === 0) {
          return;
        }
      }
    }

    // 验证答案
    if (sudoku.checkWin(this.data.board)) {
      clearInterval(this.data.timerInterval);
      
      this.setData({
        isComplete: true
      });

      const minutes = Math.floor(this.data.timer / 60);
      const seconds = this.data.timer % 60;
      const timeStr = `${minutes}分${seconds}秒`;

      wx.showModal({
        title: '恭喜通关',
        content: `用时：${timeStr}\n提示剩余：${this.data.hints}次`,
        showCancel: false,
        confirmText: '再玩一局',
        success: (res) => {
          if (res.confirm) {
            this.initGame();
          }
        }
      });
    }
  },

  // 重新开始
  restart() {
    wx.showModal({
      title: '确认',
      content: '确定要重新开始吗？',
      success: (res) => {
        if (res.confirm) {
          const board = this.data.originalBoard.map(row => [...row]);
          this.setData({
            board: board,
            timer: 0,
            hints: 3,
            isComplete: false
          });
          
          if (this.data.timerInterval) {
            clearInterval(this.data.timerInterval);
          }
          this.data.timerInterval = setInterval(() => {
            this.setData({
              timer: this.data.timer + 1
            });
          }, 1000);
        }
      }
    });
  },

  // 格式化时间
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  },

  // 获取格子样式
  getCellClass(row, col) {
    const cell = this.data.board[row][col];
    const original = this.data.originalBoard[row][col];
    const isOriginal = original !== 0;
    const isSelected = this.data.selectedCell && 
                       this.data.selectedCell.row === row && 
                       this.data.selectedCell.col === col;
    const inSameRow = this.data.selectedCell && this.data.selectedCell.row === row;
    const inSameCol = this.data.selectedCell && this.data.selectedCell.col === col;
    const inSameBox = this.data.selectedCell && 
                      Math.floor(this.data.selectedCell.row / 3) === Math.floor(row / 3) &&
                      Math.floor(this.data.selectedCell.col / 3) === Math.floor(col / 3);
    
    let classes = ['cell'];
    if (isOriginal) classes.push('original');
    if (isSelected) classes.push('selected');
    else if (inSameRow || inSameCol || inSameBox) classes.push('highlight');
    if (cell === 0) classes.push('empty');
    
    return classes.join(' ');
  }
})