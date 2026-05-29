// pages/tips/tips.ts
Page({
  data: {
    progress: 0
  },

  onLoad() {
    this.startProgress();
  },

  startProgress() {
    const interval = setInterval(() => {
      let progress = this.data.progress + Math.floor(Math.random() * 10) + 5;
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        setTimeout(() => {
          wx.redirectTo({
            url: '/pages/interview/interview'
          });
        }, 500);
      }
      
      this.setData({ progress });
    }, 200);
  }
})
