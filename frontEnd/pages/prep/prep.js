// pages/prep/prep.js
const app = getApp();

Page({
  data: {
    experience: 'graduate',
    style: 'standard',
    selectedJob: 'Java工程师',
    resumeMode: 'no-resume',
    resumeUploaded: false,
    resumeFileName: '',
    resumeFileId: '',
    pointsBalance: 20,
    availableMinutes: 2
  },

  onLoad() {
    const pointsBalance = app.globalData.pointsBalance;
    this.setData({
      pointsBalance: pointsBalance,
      availableMinutes: Math.floor(pointsBalance / 10)
    });
  },

  // 选择经验
  selectExperience(e) {
    this.setData({
      experience: e.currentTarget.dataset.value
    });
  },

  // 选择风格
  selectStyle(e) {
    this.setData({
      style: e.currentTarget.dataset.value
    });
  },

  // 显示岗位选择器
  showJobSelector() {
    wx.navigateTo({
      url: '/pages/jobSelector/jobSelector'
    });
  },

  // 选择简历模式
  selectResumeMode(e) {
    this.setData({
      resumeMode: e.currentTarget.dataset.value
    });
  },

  // 选择简历文件
  chooseResume() {
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success: (res) => {
        const file = res.tempFiles[0];
        this.setData({
          resumeUploaded: true,
          resumeFileName: file.name
        });
        wx.showToast({
          title: '上传成功',
          icon: 'success'
        });
      }
    });
  },

  // 进入面试
  enterInterview() {
    if (this.data.resumeMode === 'use-resume' && !this.data.resumeUploaded) {
      wx.showToast({
        title: '请先上传简历',
        icon: 'none'
      });
      return;
    }

    if (this.data.pointsBalance < 10) {
      wx.showModal({
        title: '积分不足',
        content: '您的积分不足，请先充值',
        confirmText: '去充值',
        success: (res) => {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/mine/mine'
            });
          }
        }
      });
      return;
    }

    // 保存面试配置
    const interviewConfig = {
      experience: this.data.experience,
      style: this.data.style,
      job: this.data.selectedJob,
      resumeMode: this.data.resumeMode,
      resumeFileId: this.data.resumeFileId
    };

    wx.setStorageSync('interviewConfig', interviewConfig);

    // 跳转到提示页面
    wx.navigateTo({
      url: '/pages/tips/tips'
    });
  }
})
