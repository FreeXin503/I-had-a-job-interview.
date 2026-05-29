// pages/home/home.ts
const app = getApp<IAppOption>();

Page({
  data: {
    recentRecords: [] as any[]
  },

  onLoad() {
    this.loadRecentRecords();
  },

  onShow() {
    this.loadRecentRecords();
  },

  // 加载最近记录
  loadRecentRecords() {
    wx.showLoading({ title: '加载中...' });
    
    wx.request({
      url: `${app.globalData.apiBaseUrl}/interview/recent`,
      header: {
        'Authorization': `Bearer ${app.globalData.token}`
      },
      success: (res: any) => {
        if (res.data.code === 200) {
          this.setData({
            recentRecords: res.data.data || []
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        });
      },
      complete: () => {
        wx.hideLoading();
      }
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
  viewReport(e: any) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/report/report?id=${id}`
    });
  }
})
