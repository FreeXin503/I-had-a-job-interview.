// pages/home/home.js
const app = getApp();

Page({
  data: {
    recentRecords: [],
    activeInterviewer: 'female',
    femaleName: '王雅琪 (资深HR)',
    maleName: '张睿达 (技术主考官)'
  },

  onLoad() {
    this.loadRecentRecords();
  },

  onShow() {
    this.loadRecentRecords();
    this.syncInterviewer();
  },

  // 同步当前选中的面试官
  syncInterviewer() {
    const config = wx.getStorageSync('interviewConfig') || {};
    const gender = config.voiceGender || 'female';
    this.setData({
      activeInterviewer: gender
    });
  },

  // 切换面试官
  switchInterviewer() {
    const next = this.data.activeInterviewer === 'female' ? 'male' : 'female';
    this.setData({ activeInterviewer: next });
    
    const config = wx.getStorageSync('interviewConfig') || {};
    config.voiceGender = next;
    wx.setStorageSync('interviewConfig', config);

    wx.showToast({
      title: '已切换为：' + (next === 'female' ? this.data.femaleName : this.data.maleName),
      icon: 'none',
      duration: 1500
    });
  },

  // 加载最近记录
  loadRecentRecords() {
    // 模拟数据
    this.setData({
      recentRecords: [
        {
          id: '1',
          jobTitle: 'Java工程师',
          experience: '应届',
          style: '标准模式',
          date: '2026/05/28',
          score: 90
        }
      ]
    });
  },

  // 开始模拟面试
  startMockInterview() {
    wx.navigateTo({
      url: '/pages/prep/prep'
    });
  },

  // 简历优化
  startResumeOpt() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  // 查看全部记录
  viewAllRecords() {
    wx.switchTab({
      url: '/pages/mine/mine'
    });
  },

  // 查看报告
  viewReport(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/report/report?id=${id}`
    });
  }
})
