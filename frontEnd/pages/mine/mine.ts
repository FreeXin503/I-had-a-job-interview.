// pages/mine/mine.ts
const app = getApp<IAppOption>();

Page({
  data: {
    pointsBalance: 20,
    mockInterviewCount: 0,
    resumeOptimizationCount: 0
  },

  onShow() {
    this.loadUserStats();
  },

  // 加载用户统计数据
  loadUserStats() {
    this.setData({
      pointsBalance: app.globalData.pointsBalance,
      mockInterviewCount: app.globalData.mockInterviewCount,
      resumeOptimizationCount: app.globalData.resumeOptimizationCount
    });
  },

  // 充值
  recharge() {
    wx.showModal({
      title: '充值积分',
      content: '请联系客服进行积分充值\n客服电话：400-888-9999',
      showCancel: false
    });
  },

  // 简历管理
  goToResumeMgr() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  // 面试记录
  goToReports() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  // 联系客服
  contactService() {
    wx.showModal({
      title: '联系客服',
      content: '客服电话：400-888-9999\n工作时间：9:00-18:00',
      showCancel: false
    });
  },

  // 设置
  goToSettings() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  }
})
