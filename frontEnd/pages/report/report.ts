// pages/report/report.ts
const app = getApp<IAppOption>();

Page({
  data: {
    interviewId: '',
    report: {
      score: 0,
      rating: '',
      duration: 0,
      percentile: 0,
      evaluation: {
        professional: '',
        logic: '',
        adaptability: '',
        performance: ''
      },
      questionAnalysis: []
    } as any
  },

  onLoad(options: any) {
    const id = options.id;
    if (id) {
      this.setData({ interviewId: id });
      this.loadReport(id);
    }
  },

  // 加载报告
  loadReport(id: string) {
    wx.showLoading({ title: '加载中...' });

    wx.request({
      url: `${app.globalData.apiBaseUrl}/interview/${id}/report`,
      header: {
        'Authorization': `Bearer ${app.globalData.token}`
      },
      success: (res: any) => {
        if (res.data.code === 200) {
          const report = res.data.data;
          
          // 计算百分位
          const percentile = Math.floor((report.score / 100) * 75);
          report.percentile = percentile;
          
          this.setData({ report });
        } else {
          wx.showToast({
            title: res.data.message || '加载失败',
            icon: 'none'
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

  // 返回首页
  backToHome() {
    wx.switchTab({
      url: '/pages/home/home'
    });
  },

  // 分享报告
  shareReport() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  }
})
