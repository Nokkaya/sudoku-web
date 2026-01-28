<template>
  <div class="app">
    <!-- 自定义确认弹窗 -->
    <Transition name="fade">
      <div v-if="showExitConfirm" class="modal-overlay" @click="showExitConfirm = false">
        <div class="modal" @click.stop>
          <div class="modal-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <h3 class="modal-title">返回主菜单？</h3>
          <p class="modal-text">当前游戏进度将丢失，确定要返回吗？</p>
          <div class="modal-actions">
            <button class="modal-btn modal-btn-secondary" @click="showExitConfirm = false">取消</button>
            <button class="modal-btn modal-btn-primary" @click="exitToMenu">确定</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 首页视图 -->
    <div v-if="!gameStarted" class="home">
      <div class="container">
        <!-- Logo区域 -->
        <div class="logo-section">
          <div class="logo-wrapper">
            <div class="logo-bg">
              <span class="logo-number">9</span>
            </div>
            <div class="logo-accent"></div>
          </div>
          <h1 class="title">SUDOKU</h1>
          <p class="subtitle">数独大师</p>
        </div>

        <!-- 难度选择 -->
        <div class="mode-section">
          <p class="section-label">选择难度</p>
          <div class="mode-list">
            <div 
              v-for="(mode, index) in modes" 
              :key="mode.id"
              class="mode-item"
              :class="{ active: selectedMode === index }"
              @click="selectedMode = index"
            >
              <div class="mode-icon">
                <span class="dot" v-for="n in mode.dots" :key="n"></span>
              </div>
              <div class="mode-info">
                <span class="mode-name">{{ mode.name }}</span>
                <span class="mode-desc">{{ mode.holes }} 个空格</span>
              </div>
              <div class="mode-check">
                <span class="check-icon"></span>
              </div>
            </div>
          </div>
        </div>

        <!-- 开始按钮 -->
        <button class="start-btn" @click="startGame">
          开始游戏
          <span class="arrow-icon"></span>
        </button>
      </div>
    </div>

    <!-- 游戏视图 -->
    <div v-else class="game">
      <div class="container">
        <!-- 返回按钮 -->
        <button class="back-btn-float" @click="confirmExit">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        
        <!-- 顶部信息栏 -->
        <div class="header">
          <div class="header-left">
            <span class="mode-tag">{{ currentModeName }}</span>
          </div>
          
          <div class="header-center">
            <div class="timer-wrapper">
              <span class="timer">{{ formatTime(timer) }}</span>
            </div>
          </div>
          
          <div class="header-right">
            <span class="hint-label">提示</span>
            <span class="hint-count">{{ hints }}</span>
          </div>
        </div>

        <!-- 棋盘 -->
        <div class="board-container">
          <div class="board">
            <!-- 3x3边框 -->
            <div class="grid-borders">
              <div class="border-h" style="top: 33.33%"></div>
              <div class="border-h" style="top: 66.66%"></div>
              <div class="border-v" style="left: 33.33%"></div>
              <div class="border-v" style="left: 66.66%"></div>
            </div>
            
            <!-- 9x9格子 -->
            <div class="cells">
              <div v-for="(row, rowIdx) in board" :key="rowIdx" class="row">
                <div 
                  v-for="(cell, colIdx) in row" 
                  :key="colIdx"
                  class="cell"
                  :class="getCellClass(rowIdx, colIdx)"
                  @click="selectCell(rowIdx, colIdx)"
                >
                  <span v-if="cell !== 0">{{ cell }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 数字键盘 -->
        <div class="number-pad" v-if="!isComplete">
          <button 
            v-for="num in nums" 
            :key="num"
            class="num-btn"
            @click="inputNumber(num)"
          >
            {{ num }}
          </button>
          <button class="num-btn clear-btn" @click="clearCell">
            <span class="erase-icon"></span>
          </button>
        </div>

        <!-- 功能按钮 -->
        <div class="actions" v-if="!isComplete">
          <button class="action-btn" @click="useHint">
            <span class="hint-icon"></span>
            提示
          </button>
          <button class="action-btn" @click="restart">
            <span class="restart-icon">
              <span class="restart-arrow"></span>
            </span>
            重来
          </button>
        </div>

        <!-- 通关弹窗 -->
        <div class="completed-overlay" v-if="isComplete">
          <div class="completed-modal">
            <h2 class="completed-title">恭喜通关</h2>
            <p class="completed-subtitle">你完成了数独挑战！</p>
            <div class="completed-stats">
              <div class="stat-item">
                <span class="stat-value">{{ formatTime(timer) }}</span>
                <span class="stat-label">用时</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ hints }}</span>
                <span class="stat-label">剩余提示</span>
              </div>
            </div>
            <button class="completed-btn" @click="restart">再玩一局</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import sudoku from './utils/sudoku.js'

// 模式定义
const modes = [
  { id: 'easy-plus', name: '简单+', holes: 25, dots: 1 },
  { id: 'easy', name: '简单', holes: 35, dots: 2 },
  { id: 'medium', name: '中等', holes: 45, dots: 3 },
  { id: 'hard', name: '困难', holes: 55, dots: 4 },
  { id: 'hard-plus', name: '困难+', holes: 65, dots: 5 }
]

// 响应式状态
const gameStarted = ref(false)
const selectedMode = ref(2)
const board = ref([])
const originalBoard = ref([])
const solution = ref([])
const selectedCell = ref(null)
const timer = ref(0)
const hints = ref(3)
const isComplete = ref(false)
const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9]

// 计算属性
const currentModeName = computed(() => modes[selectedMode.value].name)
const currentDifficulty = computed(() => modes[selectedMode.value].holes)

let timerInterval = null

// 计时器
const startTimer = () => {
  timer.value = 0
  timerInterval = setInterval(() => {
    timer.value++
  }, 1000)
}

const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 游戏逻辑
const initGame = () => {
  const puzzle = sudoku.createPuzzle(currentDifficulty.value)
  board.value = puzzle.map(row => [...row])
  originalBoard.value = puzzle.map(row => [...row])
  solution.value = sudoku.solution
  selectedCell.value = null
  isComplete.value = false
  hints.value = 3
  stopTimer()
  startTimer()
}

const startGame = () => {
  initGame()
  gameStarted.value = true
}

const showExitConfirm = ref(false)

const confirmExit = () => {
  showExitConfirm.value = true
}

const exitToMenu = () => {
  showExitConfirm.value = false
  gameStarted.value = false
  timer.value = 0
  hints.value = 3
  selectedCell.value = null
}

const selectCell = (row, col) => {
  if (originalBoard.value[row][col] !== 0) {
    return
  }
  selectedCell.value = { row, col }
}

const inputNumber = (num) => {
  if (!selectedCell.value) {
    return
  }
  
  const { row, col } = selectedCell.value
  board.value[row][col] = num
  checkComplete()
}

const clearCell = () => {
  if (!selectedCell.value) return
  
  const { row, col } = selectedCell.value
  board.value[row][col] = 0
}

const useHint = () => {
  if (hints.value <= 0) return
  
  const hint = sudoku.getHint(board.value)
  if (!hint) return
  
  board.value[hint.row][hint.col] = hint.value
  hints.value--
  
  if (!selectedCell.value) {
    selectedCell.value = { row: hint.row, col: hint.col }
  }
  
  checkComplete()
}

const checkComplete = () => {
  // 检查是否还有空格
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board.value[row][col] === 0) {
        return
      }
    }
  }
  
  // 验证答案
  if (sudoku.checkWin(board.value)) {
    stopTimer()
    isComplete.value = true
  }
}

const getCellClass = (row, col) => {
  const classes = []
  const cell = board.value[row][col]
  const original = originalBoard.value[row][col]
  
  if (original !== 0) classes.push('original')
  if (cell !== 0) classes.push('filled')
  if (cell === 0) classes.push('empty')
  
  if (selectedCell.value && 
      selectedCell.value.row === row && 
      selectedCell.value.col === col) {
    classes.push('selected')
  } else if (selectedCell.value) {
    const { row: selRow, col: selCol } = selectedCell.value
    if (selRow === row || selCol === col || 
        Math.floor(selRow / 3) === Math.floor(row / 3) &&
        Math.floor(selCol / 3) === Math.floor(col / 3)) {
      classes.push('highlight')
    }
  }
  
  return classes.join(' ')
}

const restart = () => {
  if (isComplete.value) {
    gameStarted.value = false
    isComplete.value = false
  } else {
    initGame()
  }
}

// 生命周期
onUnmounted(() => {
  stopTimer()
})
</script>

<style scoped>
.app {
  min-height: 100vh;
}

.home, .game {
  min-height: 100vh;
  padding: 60px 24px;
}

.container {
  max-width: 480px;
  margin: 0 auto;
}

/* 首页样式 */
.logo-section {
  text-align: center;
  margin-bottom: 60px;
}

.logo-wrapper {
  display: inline-block;
  position: relative;
  margin-bottom: 24px;
}

.logo-bg {
  width: 120px;
  height: 120px;
  background: #2d3436;
  border-radius: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 16rpx 48rpx rgba(45, 52, 54, 0.15);
}

.logo-number {
  font-size: 80px;
  font-weight: 700;
  color: #faf9f7;
  line-height: 1;
}

.logo-accent {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 24px;
  height: 24px;
  background: #00b894;
  border-radius: 50%;
  border: 4px solid #faf9f7;
}

.title {
  font-size: 36px;
  font-weight: 700;
  letter-spacing: 6px;
  color: #2d3436;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 18px;
  color: #636e72;
  letter-spacing: 2px;
}

.section-label {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 4px;
  color: #b2bec3;
  text-transform: uppercase;
  margin-bottom: 16px;
}

.mode-section {
  margin-bottom: 40px;
}

.mode-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mode-item {
  display: flex;
  align-items: center;
  padding: 20px 24px;
  background: #ffffff;
  border-radius: 16px;
  border: 2px solid #f1f2f6;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mode-item:hover {
  border-color: #dfe6e9;
}

.mode-item.active {
  background: #2d3436;
  border-color: #2d3436;
}

.mode-icon {
  display: flex;
  gap: 4px;
  margin-right: 16px;
}

.mode-icon .dot {
  width: 8px;
  height: 8px;
  background: #b2bec3;
  border-radius: 50%;
}

.mode-icon .dot.active {
  background: #00b894;
}

.mode-info {
  flex: 1;
}

.mode-name {
  display: block;
  font-size: 18px;
  font-weight: 600;
  color: #2d3436;
  margin-bottom: 2px;
}

.mode-item.active .mode-name {
  color: #ffffff;
}

.mode-desc {
  font-size: 14px;
  color: #636e72;
}

.mode-item.active .mode-desc {
  color: rgba(255, 255, 255, 0.7);
}

.check-icon {
  width: 20px;
  height: 20px;
  border: 2px solid #dfe6e9;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.mode-item.active .check-icon {
  background: #00b894;
  border-color: #00b894;
}

.start-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px;
  background: #2d3436;
  color: #ffffff;
  border: none;
  border-radius: 32px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 8px 24rpx rgba(45, 52, 54, 0.25);
  transition: all 0.2s ease;
}

.start-btn:hover {
  background: #1a1a1a;
}

.arrow-icon {
  width: 20px;
  height: 20px;
  margin-left: 12px;
  position: relative;
}

.arrow-icon::before,
.arrow-icon::after {
  content: '';
  position: absolute;
  background: #ffffff;
  border-radius: 2px;
}

.arrow-icon::before {
  width: 14px;
  height: 3px;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
}

.arrow-icon::after {
  width: 3px;
  height: 14px;
  top: 50%;
  right: 0;
  transform: translateY(-50%) rotate(45deg);
}

/* 游戏页样式 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-left, .header-right {
  width: 120px;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.mode-tag {
  display: inline-block;
  padding: 10px 16px;
  background: #ffffff;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #2d3436;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #ffffff;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  margin-right: 12px;
  transition: all 0.2s ease;
}

.back-btn-float {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: #ffffff;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
}

.back-btn-float svg {
  width: 24px;
  height: 24px;
  color: #2d3436;
}

.back-btn-float:hover {
  background: #dfe6e9;
  transform: scale(1.05);
}

/* 自定义弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal {
  background: #ffffff;
  border-radius: 24px;
  padding: 32px;
  max-width: 360px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  background: #ffeaa7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-icon svg {
  width: 32px;
  height: 32px;
  color: #fdcb6e;
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  color: #2d3436;
  margin: 0 0 8px;
}

.modal-text {
  font-size: 15px;
  color: #636e72;
  margin: 0 0 28px;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.modal-btn {
  flex: 1;
  padding: 14px 24px;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-btn-secondary {
  background: #f1f2f6;
  color: #2d3436;
}

.modal-btn-secondary:hover {
  background: #dfe6e9;
}

.modal-btn-primary {
  background: #00b894;
  color: #ffffff;
}

.modal-btn-primary:hover {
  background: #00a085;
}

/* 弹窗动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.back-btn svg {
  width: 20px;
  height: 20px;
  color: #2d3436;
}

.back-btn:hover {
  background: #dfe6e9;
}

.timer-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #2d3436;
  border-radius: 16px;
}

.timer-icon {
  width: 20px;
  height: 20px;
  border: 2px solid #faf9f7;
  border-bottom-color: transparent;
  border-radius: 50%;
  margin-right: 8px;
}

.timer {
  font-size: 24px;
  font-weight: 600;
  color: #faf9f7;
  font-family: 'SF Mono', monospace;
}

.header-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
}

.hint-label {
  font-size: 14px;
  font-weight: 500;
  color: #b2bec3;
}

.hint-count {
  font-size: 24px;
  font-weight: 700;
  color: #00b894;
}

/* 棋盘样式 */
.board-container {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.board {
  position: relative;
  background: #2d3436;
  border-radius: 20px;
  padding: 8px;
  box-shadow: 0 16px 60px rgba(45, 52, 54, 0.2);
}

.grid-borders {
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  bottom: 8px;
  pointer-events: none;
}

.border-h {
  position: absolute;
  left: 0;
  width: 100%;
  height: 3px;
  background: #faf9f7;
}

.border-v {
  position: absolute;
  top: 0;
  height: 100%;
  width: 3px;
  background: #faf9f7;
}

.cells {
  display: flex;
  flex-direction: column;
}

.row {
  display: flex;
}

.cell {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 600;
  color: #faf9f7;
  border-right: 1px solid #4a5568;
  border-bottom: 1px solid #4a5568;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cell:last-of-type {
  border-right: none;
}

.row:last-of-type .cell {
  border-bottom: none;
}

.cell:nth-child(3n) {
  border-right: 2px solid #faf9f7;
}

.cell:last-of-type {
  border-right: none;
}

.row:nth-child(3n) .cell {
  border-bottom: 2px solid #faf9f7;
}

.row:last-of-type .cell {
  border-bottom: none;
}

.cell.original {
  color: rgba(250, 249, 247, 0.4);
}

.cell.filled:not(.original) {
  color: #00b894;
}

.cell.empty {
  color: transparent;
}

.cell.selected {
  background: #00b894 !important;
}

.cell.selected span {
  color: #ffffff !important;
}

.cell.highlight:not(.selected) {
  background: rgba(250, 249, 247, 0.08);
}

/* 数字键盘 */
.number-pad {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  padding: 24px;
  background: #ffffff;
  border-radius: 20px;
  margin-bottom: 20px;
  box-shadow: 0 8px 32rpx rgba(0, 0, 0, 0.06);
}

.num-btn {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f2f6;
  border: none;
  border-radius: 12px;
  font-size: 24px;
  font-weight: 600;
  color: #2d3436;
  cursor: pointer;
  transition: all 0.2s ease;
}

.num-btn:hover {
  background: #2d3436;
  color: #faf9f7;
}

.num-btn:active {
  transform: scale(0.92);
}

.clear-btn {
  background: #ffeaea;
}

.erase-icon {
  width: 20px;
  height: 20px;
  position: relative;
}

.erase-icon::before,
.erase-icon::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 18px;
  height: 3px;
  background: #ff6b6b;
  border-radius: 2px;
}

.erase-icon::before {
  transform: translate(-50%, -50%) rotate(-45deg);
}

.erase-icon::after {
  transform: translate(-50%, -50%) rotate(45deg);
}

/* 功能按钮 */
.actions {
  display: flex;
  gap: 16px;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  background: #ffffff;
  border: none;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
  color: #2d3436;
  cursor: pointer;
  box-shadow: 0 4px 16rpx rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #f1f2f6;
}

.hint-icon {
  width: 24px;
  height: 24px;
  border: 3px solid #00b894;
  border-radius: 50%;
  position: relative;
}

.hint-icon::after {
  content: '';
  position: absolute;
  bottom: -6px;
  right: 4px;
  width: 3px;
  height: 10px;
  background: #00b894;
  border-radius: 2px;
}

.restart-icon {
  width: 22px;
  height: 22px;
  border: 3px solid #2d3436;
  border-top-color: transparent;
  border-right-color: transparent;
  border-radius: 50%;
  position: relative;
}

.restart-arrow {
  position: absolute;
  top: 2px;
  right: 4px;
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 7px solid #2d3436;
}

/* 完成弹窗 */
.completed-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(45, 52, 54, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.completed-modal {
  background: #faf9f7;
  padding: 48px 40px;
  border-radius: 24px;
  text-align: center;
  max-width: 400px;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.2);
}

.completed-title {
  font-size: 32px;
  font-weight: 700;
  color: #00b894;
  margin-bottom: 8px;
}

.completed-subtitle {
  font-size: 16px;
  color: #636e72;
  margin-bottom: 32px;
}

.completed-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 32px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 36px;
  font-weight: 700;
  color: #2d3436;
  font-family: 'SF Mono', monospace;
}

.stat-label {
  font-size: 14px;
  color: #b2bec3;
  margin-top: 6px;
}

.completed-btn {
  width: 100%;
  padding: 18px;
  background: #2d3436;
  border: none;
  border-radius: 32px;
  font-size: 18px;
  font-weight: 600;
  color: #faf9f7;
  cursor: pointer;
  box-shadow: 0 8px 24rpx rgba(45, 52, 54, 0.25);
}

/* 响应式 */
@media (max-width: 480px) {
  .cell {
    width: 38px;
    height: 38px;
    font-size: 20px;
  }
  
  .num-btn {
    width: 48px;
    height: 48px;
    font-size: 20px;
  }
}
</style>