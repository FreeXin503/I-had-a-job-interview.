// app.ts
App<IAppOption>({
  globalData: {
    userInfo: null,
    token: '',
    apiBaseUrl: 'http://10.148.148.74:3000/api',
    pointsBalance: 20,
    mockInterviewCount: 0,
    resumeOptimizationCount: 0
  },

  onLaunch() {
    console.log('面了个试小程序启动');
    
    // 检查登录状态
    const token = wx.getStorageSync('token');
    if (token) {
      this.globalData.token = token;
      this.getUserInfo();
    }

    // 加载用户统计数据
    this.loadUserStats();
  },

  // 获取用户信息
  getUserInfo() {
    wx.request({
      url: `${this.globalData.apiBaseUrl}/user/info`,
      header: {
        'Authorization': `Bearer ${this.globalData.token}`
      },
      success: (res: any) => {
        if (res.data.code === 200) {
          this.globalData.userInfo = res.data.data;
        }
      }
    });
  },

  // 加载用户统计数据
  loadUserStats() {
    const stats = wx.getStorageSync('userStats');
    if (stats) {
      this.globalData.pointsBalance = stats.pointsBalance || 20;
      this.globalData.mockInterviewCount = stats.mockInterviewCount || 0;
      this.globalData.resumeOptimizationCount = stats.resumeOptimizationCount || 0;
    }
  },

  // 保存用户统计数据
  saveUserStats() {
    wx.setStorageSync('userStats', {
      pointsBalance: this.globalData.pointsBalance,
      mockInterviewCount: this.globalData.mockInterviewCount,
      resumeOptimizationCount: this.globalData.resumeOptimizationCount
    });
  }
})
