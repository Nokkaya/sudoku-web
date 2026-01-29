<template>
  <div class="app" :class="currentTheme">
    <!-- 排行榜弹窗 -->
    <Transition name="fade">
      <div v-if="showRecordsModal" class="modal-overlay" @click="showRecordsModal = false">
        <div class="modal records-modal" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">最佳记录</h3>
            <button class="close-btn" @click="showRecordsModal = false">×</button>
          </div>
          <div class="records-list">
            <div v-for="mode in modes" :key="mode.id" class="record-item">
              <div class="record-info">
                <span class="record-name">{{ mode.name }}</span>
                <span class="record-stars">
                  <span class="dot" v-for="n in mode.dots" :key="n" :class="{ filled: true }"></span>
                </span>
              </div>
              <span class="record-time">
                {{ formatRecordTime(records[mode.id]) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 自定义确认弹窗 -->
    <Transition name="fade">
      <div v-if="showExitConfirm" class="modal-overlay" @click="showExitConfirm = false">
        <div class="modal" @click.stop>
          <div class="modal-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 class="modal-title">返回主菜单？</h3>
          <p class="modal-text">游戏进度已自动保存，确定要返回吗？</p>
          <div class="modal-actions">
            <button class="modal-btn modal-btn-secondary" @click="showExitConfirm = false">取消</button>
            <button class="modal-btn modal-btn-primary" @click="exitToMenu">确定</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 设置弹窗 (主题选择) -->
    <Transition name="fade">
      <div v-if="showSettingsModal" class="modal-overlay" @click="showSettingsModal = false">
        <div class="modal settings-modal" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">设置</h3>
            <button class="close-btn" @click="showSettingsModal = false">×</button>
          </div>

          <div class="settings-section">
            <p class="section-label">主题风格</p>
            <div class="theme-grid">
              <div v-for="theme in themes" :key="theme.id" class="theme-item"
                :class="{ active: currentTheme === theme.id }" @click="setTheme(theme.id)">
                <div class="theme-preview" :style="{ background: theme.previewBg }">
                  <div class="theme-accent" :style="{ background: theme.previewAccent }"></div>
                </div>
                <span class="theme-name">{{ theme.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 难度选择弹窗 -->
    <Transition name="fade">
      <div v-if="showDifficultyModal" class="modal-overlay" @click="showDifficultyModal = false">
        <div class="modal difficulty-modal" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">选择难度</h3>
            <button class="close-btn" @click="showDifficultyModal = false">×</button>
          </div>
          <div class="mode-list">
            <div v-for="(mode, index) in modes" :key="mode.id" class="mode-item"
              :class="{ active: selectedMode === index }" @click="selectModeAndStart(index)">
              <div class="mode-icon">
                <span class="dot" v-for="n in mode.dots" :key="n"></span>
              </div>
              <div class="mode-info">
                <span class="mode-name">{{ mode.name }}</span>
                <span class="mode-desc">{{ mode.holes }} 个空格</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 挂作弊菜单 -->
    <Transition name="fade">
      <div v-if="showCheatMenu" class="modal-overlay" @click="showCheatMenu = false">
        <div class="modal cheat-modal" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title" style="color: #d63031">DEV MODE</h3>
            <button class="close-btn" @click="showCheatMenu = false">×</button>
          </div>
          <div class="cheat-actions">
            <button class="cheat-btn" @click="toggleInfiniteHints">
              {{ infiniteHintsEnabled ? '关闭无限提示' : '开启无限提示' }}
            </button>
            <button class="cheat-btn" @click="instantWin">
              一键填充 (通关)
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 首页视图 -->
    <div v-if="!gameStarted" class="home">
      <div class="container">
        <!-- Logo区域 -->
        <!-- Logo区域 -->
        <div class="logo-section">
          <div class="logo-wrapper">
            <div class="logo-bg">
              <span class="logo-number">9</span>
            </div>
            <div class="logo-accent"></div>
          </div>
          <h1 class="title">SUDOKU</h1>
        </div>

        <!-- 主菜单 (垂直布局) -->
        <div class="main-menu">
          <button class="menu-btn primary" @click="showDifficultyModal = true">
            新游戏
          </button>

          <button v-if="hasSavedGame" class="menu-btn secondary" @click="continueGame">
            继续游戏
          </button>

          <button class="menu-btn secondary" @click="openRecords">
            <span class="btn-icon">🏆</span> 排行榜
          </button>

          <button class="menu-btn secondary" @click="showSettingsModal = true">
            <span class="btn-icon">🎨</span> 设置
          </button>
        </div>
      </div>
    </div>

    <!-- 游戏视图 -->
    <div v-else class="game" :class="{ 'excel-layout': isExcelMode }">
      <!-- Excel Mode Structure -->
      <div v-if="isExcelMode" class="excel-wrapper">
        <!-- Title Bar -->
        <div class="excel-title-bar">
          <div class="excel-title-text">Book1 - Excel</div>
          <div class="excel-window-controls">
            <span>─</span>
            <span>□</span>
            <span class="close-x" @click="confirmExit">×</span>
          </div>
        </div>

        <!-- Ribbon -->
        <div class="excel-ribbon">
          <div class="ribbon-tabs">
            <div class="ribbon-tab active">Home</div>
            <div class="ribbon-tab">Insert</div>
            <div class="ribbon-tab">Page Layout</div>
            <div class="ribbon-tab">Formulas</div>
            <div class="ribbon-tab">Data</div>
            <div class="ribbon-tab">Review</div>
            <div class="ribbon-tab">View</div>
          </div>
          <div class="ribbon-toolbar">
            <div class="ribbon-group">
              <div class="ribbon-btn large" @click="restart">
                <span class="icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </span>
                <span class="label">Paste</span>
              </div>
            </div>
            <div class="ribbon-divider"></div>
            <div class="ribbon-group">
              <div class="ribbon-row">
                <select class="ribbon-select">
                  <option>Calibri</option>
                </select>
                <select class="ribbon-select small">
                  <option>11</option>
                </select>
              </div>
              <div class="ribbon-row">
                <div class="ribbon-btn small bold">B</div>
                <div class="ribbon-btn small italic">I</div>
                <div class="ribbon-btn small underline">U</div>
              </div>
            </div>
            <div class="ribbon-divider"></div>
            <div class="ribbon-group game-info-group">
              <div class="game-info-item">
                <span class="info-label">难度</span>
                <span class="info-value">{{ currentModeName }}</span>
              </div>
              <div class="game-info-item">
                <span class="info-label">时间</span>
                <span class="info-value timer-display">{{ formatTime(timer) }}</span>
              </div>
            </div>
            <div class="ribbon-divider"></div>
            <div class="ribbon-group">
              <div class="ribbon-btn large" @click="useHint">
                <span class="icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </span>
                <span class="label">Hint ({{ hints }})</span>
              </div>
              <div class="ribbon-btn large" @click="showSettingsModal = true">
                <span class="icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <span class="label">Settings</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Formula Bar -->
        <div class="excel-formula-bar">
          <div class="name-box">{{ getExcelCellAddress() }}</div>
          <div class="formula-icon">fx</div>
          <div class="formula-input">{{ getExcelCellValue() }}</div>
        </div>

        <!-- Sheet Area -->
        <div class="excel-sheet-area">
          <div class="excel-corner-header">◢</div>
          <div class="excel-col-headers">
            <div v-for="col in 11" :key="col" class="col-header"
              :class="{ active: isExcelColActive(col) }">
              {{ String.fromCharCode(64 + col) }}
            </div>
          </div>
          <div class="excel-row-headers">
            <div v-for="row in 15" :key="row" class="row-header"
              :class="{ active: isExcelRowActive(row) }">
              {{ row }}
            </div>
          </div>

          <!-- Excel Grid with Sudoku embedded -->
          <div class="excel-grid-content">
            <div class="excel-grid">
              <div v-for="row in 15" :key="'r' + row" class="excel-row">
                <div v-for="col in 11" :key="'c' + col" class="excel-cell"
                  :class="getSudokuCellClass(row, col)"
                  @click="handleExcelCellClick(row, col)">
                  {{ getSudokuCellValue(row, col) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Excel底部状态栏 -->
        <div class="excel-status-bar">
          <div class="status-left">
            <div class="sheet-tabs">
              <div class="sheet-nav-btn">◄</div>
              <div class="sheet-tab active">
                <svg viewBox="0 0 16 16" width="11" height="11" style="margin-right: 6px;">
                  <rect x="2" y="2" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5"/>
                  <line x1="2" y1="6" x2="14" y2="6" stroke="currentColor" stroke-width="1.5"/>
                  <line x1="6" y1="2" x2="6" y2="14" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                Sheet1
              </div>
              <div class="sheet-nav-btn">►</div>
            </div>
          </div>
          <div class="status-right">
            <div class="status-info">准备就绪</div>
            <div class="zoom-control">
              <span class="zoom-btn">－</span>
              <div class="zoom-slider">
                <div class="zoom-track"></div>
              </div>
              <span class="zoom-btn">＋</span>
              <span class="zoom-percent">100%</span>
            </div>
          </div>
        </div>

        <!-- Excel模式通关弹窗 -->
        <div class="completed-overlay" v-if="isComplete">
          <div class="completed-modal">
            <h2 class="completed-title">恭喜通关</h2>
            <p class="completed-subtitle">你完成了数独挑战！</p>

            <div v-if="isNewRecord" class="new-record-badge">
              <span>🏆 新纪录!</span>
            </div>

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

      <div class="container" :class="{ 'excel-hidden': isExcelMode }">
        <!-- 返回按钮 -->
        <button class="back-btn-float" @click="confirmExit" v-if="!isExcelMode">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
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
                <div v-for="(cell, colIdx) in row" :key="colIdx" class="cell" :class="getCellClass(rowIdx, colIdx)"
                  @click="selectCell(rowIdx, colIdx)">
                  <span v-if="cell !== 0">{{ cell }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 数字键盘 -->
        <div class="number-pad" v-if="!isComplete">
          <button v-for="num in nums" :key="num" class="num-btn" @click="inputNumber(num)">
            {{ num }}
          </button>
          <button class="num-btn clear-btn" @click="clearCell">
            <span class="erase-icon"></span>
          </button>
        </div>

        <!-- 功能按钮 -->
        <div class="actions" v-if="!isComplete">
          <button class="action-btn" @click="useHint">
            <span class="hint-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round">
                <path d="M9 18h6" />
                <path d="M10 22h4" />
                <path
                  d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
              </svg>
            </span>
            提示
          </button>
          <button class="action-btn" @click="restart">
            <span class="restart-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
            </span>
            重来
          </button>
        </div>

        <!-- 通关弹窗 -->
        <div class="completed-overlay" v-if="isComplete">
          <div class="completed-modal">
            <h2 class="completed-title">恭喜通关</h2>
            <p class="completed-subtitle">你完成了数独挑战！</p>

            <div v-if="isNewRecord" class="new-record-badge">
              <span>🏆 新纪录!</span>
            </div>

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
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
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
const hasSavedGame = ref(false)
const selectedMode = ref(2)
const board = ref([])
const originalBoard = ref([])
const solution = ref([])
const selectedCell = ref(null)
const timer = ref(0)
const hints = ref(3)
const isComplete = ref(false)
const isNewRecord = ref(false)
const records = ref({})
const showRecordsModal = ref(false)
const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9]

// 主题系统
const themes = [
  { id: 'theme-default', name: '简洁清新', previewBg: '#f0f2f5', previewAccent: '#00b894' },
  { id: 'theme-macaron', name: '马卡龙', previewBg: '#fff0f5', previewAccent: '#fdcb6e' },
  { id: 'theme-dark', name: '暗黑模式', previewBg: '#121212', previewAccent: '#00b894' },
  { id: 'theme-excel', name: '摸鱼模式', previewBg: '#107C41', previewAccent: '#ffffff' }
]
const currentTheme = ref('theme-default')
const showSettingsModal = ref(false)
const showDifficultyModal = ref(false)

// 作弊系统
const CHEAT_CODE = '1145141919810'
const inputSequence = ref([]) // Stores { val: number, time: number }
const showCheatMenu = ref(false)
const infiniteHintsEnabled = ref(false)

// 计算属性
const currentModeName = computed(() => modes[selectedMode.value].name)
const currentDifficulty = computed(() => modes[selectedMode.value].holes)
const isExcelMode = computed(() => currentTheme.value === 'theme-excel')

let timerInterval = null

// 计时器
const startTimer = () => {
  stopTimer() // Prevent multiple intervals
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
  isNewRecord.value = false
  hints.value = 3
  stopTimer()
  startTimer()
}

const selectModeAndStart = (index) => {
  selectedMode.value = index
  initGame()
  gameStarted.value = true
  showDifficultyModal.value = false
}

// Keep for compatibility if needed, but UI uses selectModeAndStart
const startNewGame = () => {
  showDifficultyModal.value = true
}

const continueGame = () => {
  loadSavedGame()
  gameStarted.value = true
}

// 存档功能
const saveGame = () => {
  if (isComplete.value) {
    localStorage.removeItem('sudoku_web_save')
    hasSavedGame.value = false
    return
  }

  const gameState = {
    board: board.value,
    originalBoard: originalBoard.value,
    // solution: solution.value, // Solution not stored in reactive state to avoid lag, but needed for restore?
    // Actually Miniprogram logic separated it. For Web, saving it is fine or we recreate it?
    // Miniprogram saved it.
    solution: solution.value,
    difficulty: currentDifficulty.value,
    modeId: modes[selectedMode.value].id,
    selectedModeIndex: selectedMode.value,
    timer: timer.value,
    hints: hints.value
  }
  localStorage.setItem('sudoku_web_save', JSON.stringify(gameState))
  hasSavedGame.value = true
}

const loadSavedGame = () => {
  const saved = localStorage.getItem('sudoku_web_save')
  if (saved) {
    const state = JSON.parse(saved)
    board.value = state.board
    originalBoard.value = state.originalBoard
    solution.value = state.solution
    selectedMode.value = state.selectedModeIndex || 2
    timer.value = state.timer
    hints.value = state.hints
    // Resume timer handled by gameStarted watcher or manual start?
    // gameStarted is set to true in continueGame
    startTimer()
  }
}

// 自动保存
watch([board, timer, hints], () => {
  if (gameStarted.value && !isComplete.value) {
    saveGame()
  }
}, { deep: true })

onMounted(() => {
  const saved = localStorage.getItem('sudoku_web_save')
  hasSavedGame.value = !!saved
  loadRecords()

  // Load Theme
  const savedTheme = localStorage.getItem('sudoku_theme')
  if (savedTheme && themes.some(t => t.id === savedTheme)) {
    currentTheme.value = savedTheme
  }
})

const setTheme = (id) => {
  currentTheme.value = id
  localStorage.setItem('sudoku_theme', id)
}

const showExitConfirm = ref(false)

const confirmExit = () => {
  showExitConfirm.value = true
}

const exitToMenu = () => {
  saveGame() // Save on exit
  showExitConfirm.value = false
  gameStarted.value = false
  timer.value = 0
  hints.value = 3
  selectedCell.value = null
  stopTimer()

  // Refresh save state
  const saved = localStorage.getItem('sudoku_web_save')
  hasSavedGame.value = !!saved
}

const selectCell = (row, col) => {
  if (originalBoard.value[row][col] !== 0) {
    return
  }
  selectedCell.value = { row, col }
}

const inputNumber = (num) => {
  // 即使没选中格子，也记录输入用于检测作弊码
  trackInput(num)

  if (!selectedCell.value) {
    return
  }

  const { row, col } = selectedCell.value
  board.value[row][col] = num
  checkComplete()
}

const trackInput = (num) => {
  const now = Date.now()
  inputSequence.value.push({ val: num, time: now })

  // 保持队列长度不超过作弊码长度
  if (inputSequence.value.length > CHEAT_CODE.length) {
    inputSequence.value.shift()
  }

  // 检测作弊码
  if (inputSequence.value.length === CHEAT_CODE.length) {
    const sequenceStr = inputSequence.value.map(i => i.val).join('')
    if (sequenceStr === CHEAT_CODE) {
      const startTime = inputSequence.value[0].time
      // 10秒内
      if (now - startTime <= 10000) {
        showCheatMenu.value = true
        // 清空队列防止重复触发
        inputSequence.value = []
      }
    }
  }
}

// 作弊功能
const toggleInfiniteHints = () => {
  infiniteHintsEnabled.value = !infiniteHintsEnabled.value
  if (infiniteHintsEnabled.value) {
    hints.value = 999
  } else {
    hints.value = 3
  }
  showCheatMenu.value = false
}

const instantWin = () => {
  // 填充所有格子为解答
  if (!solution.value || solution.value.length === 0) return

  // 深度复制 solution 到 board
  board.value = JSON.parse(JSON.stringify(solution.value))

  // 触发完成检查
  checkComplete()
  showCheatMenu.value = false
}

const clearCell = () => {
  trackInput(0) // 0 represents Clear/X key for cheat code
  if (!selectedCell.value) return

  const { row, col } = selectedCell.value
  board.value[row][col] = 0
}

const useHint = () => {
  if (hints.value <= 0) return

  const hint = sudoku.getHint(board.value)
  if (!hint) return

  board.value[hint.row][hint.col] = hint.value

  // 提示消耗
  if (!infiniteHintsEnabled.value) {
    hints.value--
  }

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
    checkNewRecord()
  }
}

// 记录相关
const loadRecords = () => {
  const saved = localStorage.getItem('sudoku_records')
  if (saved) {
    try {
      records.value = JSON.parse(saved)
    } catch (e) {
      records.value = {}
    }
  }
}

const formatRecordTime = (time) => {
  if (time === undefined || time === null) return '--:--'
  return formatTime(time)
}

const checkNewRecord = () => {
  const modeId = modes[selectedMode.value].id
  const currentBest = records.value[modeId]

  if (currentBest === undefined || timer.value < currentBest) {
    records.value[modeId] = timer.value
    localStorage.setItem('sudoku_records', JSON.stringify(records.value))
    isNewRecord.value = true
  }
}

const openRecords = () => {
  loadRecords()
  showRecordsModal.value = true
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

// Excel模式：数独棋盘从B3开始(第3行第2列)到J11结束(第11行第10列)
const SUDOKU_START_ROW = 3
const SUDOKU_START_COL = 2

const isSudokuCell = (excelRow, excelCol) => {
  return excelRow >= SUDOKU_START_ROW && excelRow < SUDOKU_START_ROW + 9 &&
         excelCol >= SUDOKU_START_COL && excelCol < SUDOKU_START_COL + 9
}

const getSudokuCellValue = (excelRow, excelCol) => {
  // 第13-14行：数字键盘区域（右移一列，从D列开始）
  if (excelRow === 13) {
    if (excelCol >= 4 && excelCol <= 8) {
      return excelCol - 3  // 1, 2, 3, 4, 5
    }
  }
  if (excelRow === 14) {
    if (excelCol >= 4 && excelCol <= 7) {
      return excelCol - 3 + 5  // 6, 7, 8, 9
    }
    if (excelCol === 8) {
      return '×'
    }
  }

  // 数独单元格
  if (!isSudokuCell(excelRow, excelCol)) return ''

  const sudokuRow = excelRow - SUDOKU_START_ROW
  const sudokuCol = excelCol - SUDOKU_START_COL
  const value = board.value[sudokuRow]?.[sudokuCol]

  return value === 0 ? '' : value
}

const getSudokuCellClass = (excelRow, excelCol) => {
  const classes = ['excel-cell']

  // 第13-14行：数字键盘区域（右移一列）
  if (excelRow === 13 && excelCol >= 4 && excelCol <= 8) {
    classes.push('keypad-cell')
    if (!isComplete.value) classes.push('clickable')
    return classes.join(' ')
  }
  if (excelRow === 14 && excelCol >= 4 && excelCol <= 8) {
    classes.push('keypad-cell')
    if (excelCol === 8) classes.push('clear-key')
    if (!isComplete.value) classes.push('clickable')
    return classes.join(' ')
  }

  // 数独单元格
  if (!isSudokuCell(excelRow, excelCol)) {
    return classes.join(' ')
  }

  const sudokuRow = excelRow - SUDOKU_START_ROW
  const sudokuCol = excelCol - SUDOKU_START_COL

  classes.push('sudoku-cell')

  const cell = board.value[sudokuRow][sudokuCol]
  const original = originalBoard.value[sudokuRow][sudokuCol]

  if (original !== 0) classes.push('original')
  if (cell !== 0) classes.push('filled')
  if (cell === 0) classes.push('empty')

  if (selectedCell.value &&
      selectedCell.value.row === sudokuRow &&
      selectedCell.value.col === sudokuCol) {
    classes.push('selected')
  } else if (selectedCell.value) {
    const { row: selRow, col: selCol } = selectedCell.value
    if (selRow === sudokuRow || selCol === sudokuCol ||
        Math.floor(selRow / 3) === Math.floor(sudokuRow / 3) &&
        Math.floor(selCol / 3) === Math.floor(sudokuCol / 3)) {
      classes.push('highlight')
    }
  }

  // 3x3宫格边界
  if ((sudokuCol + 1) % 3 === 0 && sudokuCol < 8) classes.push('thick-right')
  if ((sudokuRow + 1) % 3 === 0 && sudokuRow < 8) classes.push('thick-bottom')

  return classes.join(' ')
}

const handleExcelCellClick = (excelRow, excelCol) => {
  // 处理数字键盘点击（右移一列）
  if (!isComplete.value) {
    if (excelRow === 13 && excelCol >= 4 && excelCol <= 8) {
      inputNumber(excelCol - 3)  // 1-5
      return
    }
    if (excelRow === 14 && excelCol >= 4 && excelCol <= 8) {
      if (excelCol === 8) {
        clearCell()  // 删除键
      } else {
        inputNumber(excelCol - 3 + 5)  // 6-9
      }
      return
    }
  }

  // 处理数独单元格点击
  if (!isSudokuCell(excelRow, excelCol)) return

  const sudokuRow = excelRow - SUDOKU_START_ROW
  const sudokuCol = excelCol - SUDOKU_START_COL

  if (originalBoard.value[sudokuRow][sudokuCol] !== 0) {
    return
  }
  selectedCell.value = { row: sudokuRow, col: sudokuCol }
}

const getExcelCellAddress = () => {
  if (!selectedCell.value) return 'A1'

  const excelCol = selectedCell.value.col + SUDOKU_START_COL
  const excelRow = selectedCell.value.row + SUDOKU_START_ROW

  return `${String.fromCharCode(64 + excelCol)}${excelRow}`
}

const getExcelCellValue = () => {
  if (!selectedCell.value) return ''

  const value = board.value[selectedCell.value.row]?.[selectedCell.value.col]
  return value === 0 ? '' : value
}

const isExcelColActive = (col) => {
  if (!selectedCell.value) return false
  return col === selectedCell.value.col + SUDOKU_START_COL
}

const isExcelRowActive = (row) => {
  if (!selectedCell.value) return false
  return row === selectedCell.value.row + SUDOKU_START_ROW
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

<style>
:root {
  /* 基础颜色 - 默认主题 (简洁清新) */
  --bg-primary: #f0f2f5;
  --bg-card: #ffffff;
  --bg-input: #f1f2f6;
  /* 次级背景，用于输入框、次级按钮 */

  --text-main: #2d3436;
  --text-scnd: #636e72;
  --text-tertiary: #b2bec3;
  /* 弱提示文本、未选中圆点 */
  --text-inverse: #ffffff;
  /* 深色背景下的文字 */

  --accent: #00b894;
  --accent-hover: #00a085;
  --border: #dfe6e9;

  /* 状态颜色 */
  --danger-color: #d63031;
  --warning-color: #fdcb6e;
  --success-color: #00b894;

  /* 游戏元素 */
  --cell-bg: #2d3436;
  --cell-text: #faf9f7;
  --cell-original: rgba(250, 249, 247, 0.4);
  --cell-border: #4a5568;
  --cell-border-thick: #faf9f7;
  --cell-highlight: rgba(250, 249, 247, 0.08);

  /* 按钮与UI */
  --btn-primary-bg: #2d3436;
  --btn-primary-text: #ffffff;

  /* 视觉效果 */
  --shadow-sm: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.12);
  --shadow-lg: 0 16px 48px rgba(0, 0, 0, 0.18);
  --shadow-lg: 0 16px 48px rgba(0, 0, 0, 0.18);
  --modal-overlay: rgba(0, 0, 0, 0.6);
  --bg-image: none;
  --bg-size: auto;

  --radius-sm: 12px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --radius-xl: 32px;

  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

/* 马卡龙主题 */
.theme-macaron {
  --bg-primary: #fff0f5;
  --bg-card: #ffffff;
  --bg-input: #fff5f8;

  --text-main: #6c5ce7;
  --text-scnd: #a29bfe;
  --text-tertiary: #dfe6e9;
  --text-inverse: #ffffff;

  --accent: #fdcb6e;
  --accent-hover: #e1b12c;
  --border: #ffeaa7;

  --cell-bg: #74b9ff;
  --cell-text: #ffffff;
  --cell-original: rgba(255, 255, 255, 0.6);
  --cell-border: #a29bfe;
  --cell-border-thick: #ffffff;
  --cell-highlight: rgba(255, 255, 255, 0.2);

  --btn-primary-bg: #fdcb6e;
  --btn-primary-text: #6c5ce7;

  --shadow-sm: 0 4px 12px rgba(108, 92, 231, 0.1);
  --shadow-md: 0 8px 24px rgba(108, 92, 231, 0.15);
  --shadow-lg: 0 16px 48px rgba(108, 92, 231, 0.2);
  --modal-overlay: rgba(108, 92, 231, 0.4);
}

/* 暗黑主题 */
.theme-dark {
  --bg-primary: #121212;
  --bg-card: #1e1e1e;
  --bg-input: #2d2d2d;

  --text-main: #e0e0e0;
  --text-scnd: #a0a0a0;
  --text-tertiary: #636e72;
  --text-inverse: #121212;

  --accent: #00b894;
  --accent-hover: #00a085;
  --border: #333333;

  --cell-bg: #000000;
  --cell-text: #e0e0e0;
  --cell-original: #888888;
  --cell-border: #333333;
  --cell-border-thick: #666666;
  --cell-highlight: #222222;

  --btn-primary-bg: #00b894;
  --btn-primary-text: #ffffff;

  --shadow-sm: 0 4px 12px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 16px 48px rgba(0, 0, 0, 0.6);
  --modal-overlay: rgba(0, 0, 0, 0.8);
}
</style>

<style scoped>
.app {
  min-height: 100vh;
  background-color: var(--bg-primary);
  background-image: var(--bg-image);
  background-size: var(--bg-size);
  color: var(--text-main);
  font-family: var(--font-family);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.home,
.game {
  min-height: 100vh;
  padding: 40px 20px;
}

.game {
  padding-top: 80px;
}

.container {
  max-width: 480px;
  margin: 0 auto;
}

/* 首页样式 */
.logo-section {
  text-align: center;
  margin-bottom: 48px;
  position: relative;
  transition: margin-bottom 0.3s;
}

.logo-wrapper {
  display: inline-block;
  position: relative;
  margin-bottom: 16px;
}

.logo-bg {
  width: 120px;
  height: 120px;
  background: var(--btn-primary-bg);
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-lg);
  transition: background 0.3s;
}

.logo-number {
  font-size: 80px;
  font-weight: 700;
  color: var(--btn-primary-text);
  line-height: 1;
}

/* 主菜单样式 */
.main-menu {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.menu-btn {
  width: 100%;
  padding: 16px 20px;
  border-radius: 16px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: none;
}

.menu-btn:active {
  transform: scale(0.98);
}

.menu-btn.primary {
  background: var(--btn-primary-bg);
  color: var(--btn-primary-text);
  box-shadow: var(--shadow-btn);
}

.menu-btn.primary:hover {
  background: var(--accent-hover);
  transform: translateY(-2px);
}

.menu-btn.secondary {
  background: var(--bg-card);
  color: var(--text-main);
  border: 2px solid var(--border);
}

.menu-btn.secondary:hover {
  background: var(--border);
  transform: translateY(-2px);
}

.menu-row {
  display: flex;
  gap: 16px;
}

.menu-btn.icon-btn {
  flex: 1;
  background: var(--bg-card);
  color: var(--text-main);
  border: 1px solid var(--border);
  font-size: 16px;
  padding: 14px;
}

.menu-btn.icon-btn:hover {
  background: var(--border);
}

.btn-icon {
  font-size: 20px;
}

/* 设置弹窗 (主题选择) */
.settings-modal {
  width: 90%;
  max-width: 400px;
}

.settings-section {
  margin-top: 20px;
  text-align: left;
}

.theme-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.theme-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  border: 2px solid var(--border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s;
  background: var(--bg-card);
}

.theme-item:hover {
  border-color: var(--accent);
  background: var(--bg-primary);
}

.theme-item.active {
  border-color: var(--accent);
  background: var(--bg-primary);
  box-shadow: 0 0 0 2px var(--accent);
}

.theme-preview {
  width: 100%;
  height: 60px;
  border-radius: 8px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
  position: relative;
  overflow: hidden;
}

.theme-accent {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  box-shadow: var(--shadow-sm);
}

.theme-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main);
}


.logo-accent {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 24px;
  height: 24px;
  background: var(--accent);
  border-radius: 50%;
  border: 4px solid var(--bg-primary);
  transition: background 0.3s, border-color 0.3s;
}

.title {
  font-size: 36px;
  font-weight: 700;
  letter-spacing: 6px;
  color: var(--text-main);
  margin-bottom: 0;
}

.section-label {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 4px;
  color: var(--text-scnd);
  text-transform: uppercase;
  margin-bottom: 16px;
}

.mode-section {
  margin-bottom: 24px;
}

.mode-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mode-item {
  display: flex;
  align-items: center;
  padding: 14px 18px;
  background: var(--bg-card);
  border-radius: 12px;
  border: 2px solid var(--bg-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.mode-item:hover {
  border-color: var(--border);
}

.mode-item.active {
  background: var(--btn-primary-bg);
  border-color: var(--btn-primary-bg);
}

.mode-icon {
  display: flex;
  gap: 3px;
  margin-right: 12px;
  width: 40px;
  align-items: center;
}

.mode-icon .dot {
  width: 6px;
  height: 6px;
  background: var(--text-scnd);
  border-radius: 50%;
  transition: all 0.2s ease;
}

.mode-item.active .dot {
  background: var(--accent);
}

.mode-info {
  flex: 1;
}

.mode-name {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 2px;
}

.mode-item.active .mode-name {
  color: var(--btn-primary-text);
}

.mode-desc {
  font-size: 12px;
  color: var(--text-scnd);
}

.mode-item.active .mode-desc {
  color: rgba(255, 255, 255, 0.7);
}

.check-icon {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border);
  border-radius: 50%;
  transition: all 0.2s ease;
}

.mode-item.active .check-icon {
  background: var(--accent);
  border-color: var(--accent);
}

/* 按钮组样式 */
.button-group {
  display: flex;
  gap: 16px;
  margin-top: 32px;
}

.start-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 16px 20px;
  background: var(--btn-primary-bg);
  color: var(--btn-primary-text);
  border: none;
  border-radius: var(--radius-lg);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: var(--shadow-md);
  transition: all 0.2s ease;
}

.start-btn:hover {
  background: #1a1a1a;
  transform: translateY(-2px);
}

.continue-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 16px 20px;
  background: #ffffff;
  color: #2d3436;
  border: 2px solid #2d3436;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.continue-btn:hover {
  background: #f1f2f6;
  transform: translateY(-2px);
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

.header-left,
.header-right {
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
  background: var(--bg-card);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main);
}

.back-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--bg-card);
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
  background: var(--bg-card);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
}

.back-btn-float svg {
  width: 24px;
  height: 24px;
  color: var(--text-main);
}

.back-btn-float:hover {
  background: var(--border);
  transform: scale(1.05);
}

/* 自定义弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--modal-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 32px;
  max-width: 360px;
  width: 100%;
  text-align: center;
  box-shadow: var(--shadow-lg);
}

.modal-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  background: var(--bg-input);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-icon svg {
  width: 32px;
  height: 32px;
  color: var(--accent);
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-main);
  margin: 0 0 8px;
}

.modal-text {
  font-size: 15px;
  color: var(--text-scnd);
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

/* 排行榜弹窗 */
.records-modal {
  max-width: 320px;
  padding: 24px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-header .modal-title {
  margin: 0;
  font-size: 20px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: var(--text-tertiary);
  cursor: pointer;
  padding: 4px;
  line-height: 1;
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.record-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: var(--bg-input);
  border-radius: var(--radius-sm);
}

.record-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.record-name {
  font-size: 14px;
  font-weight: 600;
  color: #2d3436;
}

.record-stars {
  display: flex;
  gap: 2px;
}

.record-stars .dot {
  width: 4px;
  height: 4px;
  background: var(--text-tertiary);
  border-radius: 50%;
}

.record-stars .dot.filled {
  background: #00b894;
}

.record-time {
  font-family: 'SF Mono', monospace;
  font-weight: 700;
  color: #00b894;
  font-size: 16px;
}

/* 作弊菜单 */
.cheat-modal {
  border: 4px solid var(--danger-color);
}

.cheat-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cheat-btn {
  padding: 16px;
  background: var(--btn-primary-bg);
  color: var(--btn-primary-text);
  border: none;
  border-radius: var(--radius-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.cheat-btn:hover {
  background: var(--danger-color);
}

.new-record-badge {
  display: inline-block;
  background: var(--warning-color);
  color: #ffffff;
  font-weight: 700;
  font-size: 14px;
  padding: 6px 12px;
  border-radius: 20px;
  margin-bottom: 24px;
  animation: bounce 1s infinite;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

@keyframes bounce {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-4px);
  }
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
  background: var(--btn-primary-bg);
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
  color: var(--cell-text);
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
  color: var(--text-scnd);
}

.hint-count {
  font-size: 24px;
  font-weight: 700;
  color: var(--accent);
}

/* 棋盘样式 */
.board-container {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.board {
  position: relative;
  background: var(--cell-bg);
  border-radius: 20px;
  padding: 8px;
  box-shadow: var(--shadow-lg);
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
  background: var(--cell-border-thick);
}

.border-v {
  position: absolute;
  top: 0;
  height: 100%;
  width: 3px;
  background: var(--cell-border-thick);
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
  font-size: 28px;
  font-weight: 600;
  color: var(--cell-text);
  border-right: 1px solid var(--cell-border);
  border-bottom: 1px solid var(--cell-border);
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
  border-right: 2px solid var(--cell-border-thick);
}

.cell:last-of-type {
  border-right: none;
}

.row:nth-child(3n) .cell {
  border-bottom: 2px solid var(--cell-border-thick);
}

.row:last-of-type .cell {
  border-bottom: none;
}

.cell.original {
  color: var(--cell-original);
}

.cell.filled:not(.original) {
  color: var(--accent);
}

.cell.empty {
  color: transparent;
}

.cell.selected {
  background: var(--accent) !important;
}

.cell.selected span {
  color: #ffffff !important;
}

.cell.highlight:not(.selected) {
  background: var(--cell-highlight);
}

/* 数字键盘 */
.number-pad {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  padding: 24px;
  background: var(--bg-card);
  border-radius: 20px;
  margin-bottom: 20px;
  box-shadow: var(--shadow-md);
}

.num-btn {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  border: none;
  border-radius: 12px;
  font-size: 24px;
  font-weight: 600;
  color: var(--text-main);
  cursor: pointer;
  transition: all 0.2s ease;
}

.num-btn:hover {
  background: var(--btn-primary-bg);
  color: var(--btn-primary-text);
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
  background: var(--bg-card);
  border: none;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-main);
  cursor: pointer;
  box-shadow: 0 4px 16rpx rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: var(--bg-primary);
}

.hint-icon svg {
  color: var(--accent);
}

.restart-icon svg {
  color: var(--text-main);
}

.hint-icon {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hint-icon svg {
  width: 100%;
  height: 100%;
  color: var(--accent);
}

.restart-icon {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.restart-icon svg {
  width: 100%;
  height: 100%;
  color: var(--text-main);
}

/* 完成弹窗 */
.completed-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--modal-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.completed-modal {
  background: var(--bg-card);
  padding: 48px 40px;
  border-radius: var(--radius-lg);
  text-align: center;
  max-width: 400px;
  box-shadow: var(--shadow-xl);
}

.completed-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--accent);
  margin-bottom: 8px;
}

.completed-subtitle {
  font-size: 16px;
  color: var(--text-scnd);
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
  color: var(--text-main);
  font-family: 'SF Mono', monospace;
}

.stat-label {
  font-size: 14px;
  color: var(--text-scnd);
  margin-top: 6px;
}

.completed-btn {
  width: 100%;
  padding: 18px;
  background: var(--btn-primary-bg);
  border: none;
  border-radius: var(--radius-xl);
  font-size: 18px;
  font-weight: 600;
  color: var(--btn-primary-text);
  cursor: pointer;
  box-shadow: var(--shadow-btn);
}

/* 响应式 */
@media (max-width: 480px) {
  .cell {
    width: 38px;
    height: 38px;
    font-size: 26px;
  }

  .num-btn {
    width: 48px;
    height: 48px;
    font-size: 20px;
  }
}
</style>

<style>
/* 摸鱼模式 (Excel) 完整样式覆盖 */
.theme-excel {
  --bg-primary: #f8f9fa;
  --bg-card: #ffffff;
  --bg-input: #ffffff;
  --text-main: #212529;
  --text-scnd: #495057;
  --text-tertiary: #adb5bd;
  --text-inverse: #ffffff;
  --accent: #107C41;
  --accent-hover: #0c5d31;
  --border: #d1d1d1;
  --cell-bg: #ffffff;
  --cell-text: #000000;
  --cell-original: #000000;
  --cell-border: #d0d7de;
  --cell-border-thick: #217346;
  --cell-highlight: rgba(33, 115, 70, 0.1);
  --btn-primary-bg: #107C41;
  --btn-primary-text: #ffffff;
  --shadow-sm: none;
  --shadow-md: 0 1px 2px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 2px 4px rgba(0, 0, 0, 0.1);
  --modal-overlay: rgba(0, 0, 0, 0.2);
  --radius-sm: 0;
  --radius-md: 0;
  --radius-lg: 0;
  --radius-xl: 0;
  --font-family: 'Segoe UI', 'Calibri', 'Arial', sans-serif;
  --excel-header-bg: #f8f9fa;
  --excel-header-border: #d4d4d4;
  --excel-selection-border: #107C41;
  --excel-ribbon-bg: #f3f2f1;
}

/* Excel Layout Styling */
.excel-layout {
  padding: 0 !important;
  background: #fff !important;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.excel-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.excel-title-bar {
  background: #107C41;
  color: white;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  position: relative;
}

.excel-title-text {
  font-weight: 400;
}

.excel-window-controls {
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
}

.excel-window-controls span {
  padding: 5px 15px;
  cursor: pointer;
  transition: background 0.2s;
}

.excel-window-controls span:hover {
  background: rgba(255, 255, 255, 0.1);
}

.excel-window-controls .close-x:hover {
  background: #e81123;
}

/* Ribbon */
.excel-ribbon {
  background: var(--excel-ribbon-bg);
  border-bottom: 1px solid #d1d1d1;
}

.ribbon-tabs {
  display: flex;
  padding-left: 10px;
  background: #f3f2f1;
}

.ribbon-tab {
  padding: 5px 15px;
  font-size: 14px;
  color: #444;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.2s;
}

.ribbon-tab:hover {
  background: rgba(0, 0, 0, 0.05);
}

.ribbon-tab.active {
  color: #107C41;
  border-bottom-color: #107C41;
  font-weight: 600;
  background: white;
}

.ribbon-toolbar {
  height: 90px;
  background: white;
  display: flex;
  padding: 5px;
  align-items: center;
}

.ribbon-group {
  display: flex;
  flex-direction: column;
  padding: 0 10px;
  border-right: 1px solid #ddd;
  height: 100%;
  align-items: center;
  justify-content: center;
}

.ribbon-row {
  display: flex;
  gap: 5px;
  margin: 2px 0;
}

.ribbon-divider {
  width: 1px;
  height: 80px;
  background: #ddd;
  margin: 0 5px;
}

.ribbon-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5px;
  cursor: pointer;
  border-radius: 3px;
  min-width: 40px;
  transition: background 0.2s;
}

.ribbon-btn:hover {
  background: #f0f0f0;
}

.ribbon-btn.large {
  flex-direction: column;
  padding: 8px;
}

.ribbon-btn.large .icon {
  width: 24px;
  height: 24px;
  margin-bottom: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ribbon-btn.large .icon svg {
  width: 20px;
  height: 20px;
  color: #107C41;
}

.ribbon-btn.large .label {
  font-size: 11px;
  color: #666;
  text-align: center;
}

.ribbon-btn.small {
  padding: 3px 8px;
  min-width: 28px;
  height: 24px;
  font-size: 12px;
  font-weight: 600;
}

.ribbon-btn.small.bold {
  font-family: 'Times New Roman', serif;
}

.ribbon-btn.small.italic {
  font-style: italic;
}

.ribbon-btn.small.underline {
  text-decoration: underline;
}

.ribbon-select {
  padding: 2px 5px;
  border: 1px solid #d1d1d1;
  font-size: 12px;
  background: white;
  cursor: pointer;
}

.ribbon-select.small {
  width: 50px;
}

/* Ribbon游戏信息组 */
.ribbon-group.game-info-group {
  gap: 8px;
  padding: 0 15px;
}

.game-info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.info-label {
  font-size: 10px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 16px;
  font-weight: 700;
  color: #107C41;
}

.timer-display {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  letter-spacing: 1px;
  font-size: 18px;
}

/* Formula Bar */
.excel-formula-bar {
  display: flex;
  height: 28px;
  border-bottom: 1px solid #d1d1d1;
  align-items: center;
  background: white;
  padding: 2px;
}

.name-box {
  width: 60px;
  border-right: 1px solid #d1d1d1;
  padding: 0 10px;
  font-size: 12px;
  font-family: inherit;
  display: flex;
  align-items: center;
  height: 100%;
  background: white;
  color: #000;
}

.formula-icon {
  width: 30px;
  color: #a0a0a0;
  font-style: italic;
  font-weight: bold;
  text-align: center;
  font-family: serif;
}

.formula-input {
  flex: 1;
  height: 100%;
  line-height: 24px;
  padding-left: 5px;
  font-size: 13px;
  color: #000;
}

/* Sheet Area */
.excel-sheet-area {
  flex: 1;
  display: grid;
  grid-template-columns: 40px 1fr;
  grid-template-rows: 24px 1fr;
  background: #e6e6e6;
  overflow: hidden;
}

.excel-corner-header {
  background: #f8f9fa;
  border-right: 1px solid #d1d1d1;
  border-bottom: 1px solid #d1d1d1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
  cursor: default;
  user-select: none;
}

.excel-col-headers {
  display: flex;
  background: #f8f9fa;
  border-bottom: 1px solid #d1d1d1;
}

.col-header {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #d1d1d1;
  font-size: 12px;
  color: #444;
  font-weight: 500;
  min-width: 0;
  background: #f8f9fa;
  cursor: default;
  user-select: none;
}

.excel-row-headers {
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
  border-right: 1px solid #d1d1d1;
}

.row-header {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #d1d1d1;
  font-size: 12px;
  color: #444;
  font-weight: 500;
  background: #f8f9fa;
  cursor: default;
  user-select: none;
  min-height: 0;
}

.col-header.active,
.row-header.active {
  background: #e1f5fe;
  color: #107C41;
  font-weight: bold;
}

.excel-grid-content {
  background: white;
  position: relative;
  overflow: hidden;
}

.excel-hidden {
  display: none !important;
}

/* Excel网格 */
.excel-grid {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.excel-row {
  display: flex;
  flex: 1;
  min-height: 0;
}

.excel-cell {
  flex: 1;
  min-width: 0;
  border-right: 1px solid #d0d7de;
  border-bottom: 1px solid #d0d7de;
  background: white;
  font-size: 12px;
  font-family: 'Calibri', 'Arial', sans-serif;
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: cell;
  user-select: none;
}

.excel-cell:hover {
  background: #f5f5f5;
}

/* 数独单元格特殊样式 */
.excel-cell.sudoku-cell {
  font-size: 24px;
  font-weight: 400;
  background: white;
  cursor: pointer;
}

.excel-cell.sudoku-cell.original {
  font-weight: 700;
  color: #217346;
}

.excel-cell.sudoku-cell.filled:not(.original) {
  color: #000;
  font-weight: 400;
}

.excel-cell.sudoku-cell.empty {
  background: white;
}

.excel-cell.sudoku-cell.selected {
  outline: 2px solid #107C41 !important;
  outline-offset: -2px;
  background: white !important;
  z-index: 10;
  position: relative;
}

.excel-cell.sudoku-cell.highlight {
  background: #e8f5e9 !important;
}

.excel-cell.sudoku-cell:hover:not(.selected) {
  background: #f0f0f0 !important;
}

/* 3x3宫格边界 */
.excel-cell.thick-right {
  border-right: 2px solid #217346;
}

.excel-cell.thick-bottom {
  border-bottom: 2px solid #217346;
}

/* Excel底部状态栏 */
.excel-status-bar {
  height: 24px;
  background: #f3f2f1;
  border-top: 1px solid #d1d1d1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
  color: #444;
}

.status-left {
  display: flex;
  align-items: center;
  height: 100%;
}

.sheet-tabs {
  display: flex;
  align-items: center;
  height: 100%;
  gap: 2px;
  padding-left: 8px;
}

.sheet-nav-btn {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 10px;
  user-select: none;
}

.sheet-nav-btn:hover {
  background: rgba(0, 0, 0, 0.05);
}

.sheet-tab {
  display: flex;
  align-items: center;
  padding: 0 12px;
  height: 100%;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  font-size: 11px;
  cursor: pointer;
  user-select: none;
  color: #444;
  transition: all 0.15s;
}

.sheet-tab:hover {
  background: rgba(0, 0, 0, 0.03);
}

.sheet-tab.active {
  background: white;
  border-bottom-color: #107C41;
  font-weight: 600;
  color: #107C41;
}

.status-right {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-right: 8px;
  height: 100%;
}

.status-info {
  font-size: 11px;
  color: #666;
}

.zoom-control {
  display: flex;
  align-items: center;
  gap: 6px;
}

.zoom-btn {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  color: #666;
  font-size: 14px;
}

.zoom-btn:hover {
  color: #107C41;
}

.zoom-slider {
  width: 60px;
  height: 12px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.zoom-track {
  width: 100%;
  height: 2px;
  background: #d1d1d1;
  position: relative;
}

.zoom-track::after {
  content: '';
  position: absolute;
  left: 0;
  top: -3px;
  width: 8px;
  height: 8px;
  background: #107C41;
  border-radius: 50%;
  left: 50%;
}

.zoom-percent {
  font-size: 11px;
  color: #666;
  min-width: 32px;
  text-align: right;
}

/* 数字键盘单元格 */
.excel-cell.keypad-cell {
  background: #f0f8ff;
  border: 1px solid #b3d9ff;
  font-size: 20px;
  font-weight: 700;
  color: #0078d4;
  cursor: pointer;
  transition: all 0.15s;
  user-select: none;
}

.excel-cell.keypad-cell:hover {
  background: #d9edff;
  border-color: #0078d4;
  transform: scale(1.05);
}

.excel-cell.keypad-cell:active {
  background: #c2e0ff;
  transform: scale(0.95);
}

.excel-cell.keypad-cell.clear-key {
  background: #fff0f0;
  border-color: #ffcccc;
  color: #d63031;
  font-size: 28px;
}

.excel-cell.keypad-cell.clear-key:hover {
  background: #ffe0e0;
  border-color: #d63031;
}

/* 移动端优化 */
@media (max-width: 480px) {
  .excel-input-panel {
    bottom: 30px;
    right: 8px;
  }

  .input-panel-btn {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }

  .input-panel-grid {
    gap: 5px;
    padding: 6px;
  }

  .excel-cell.sudoku-cell {
    font-size: 20px;
  }

  .zoom-control {
    display: none;
  }

  .status-info {
    display: none;
  }
}
</style>
