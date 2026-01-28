// index.js
Page({
  data: {
    modes: [
      { id: 'easy', name: '简单', holes: 30 },
      { id: 'medium', name: '中等', holes: 40 },
      { id: 'hard', name: '困难', holes: 50 }
    ],
    selectedMode: 1
  },

  onLoad() {
    // 页面加载
  },

  // 选择难度
  selectMode(e) {
    this.setData({
      selectedMode: e.currentTarget.dataset.index
    });
  },

  // 开始游戏
  startGame() {
    const mode = this.data.modes[this.data.selectedMode];
    wx.navigateTo({
      url: `/pages/game/game?difficulty=${mode.holes}&mode=${mode.id}`
    });
  }
})