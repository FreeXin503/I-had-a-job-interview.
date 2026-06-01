// pages/prep/prep.js
const app = getApp();

Page({
  data: {
    experience: 'graduate',
    style: 'standard',
    voiceGender: 'female',
    selectedJob: 'Java工程师',
    resumeMode: 'no-resume',
    resumeUploaded: false,
    resumeFileName: '',
    resumeFileId: '',
    pointsBalance: 20,
    availableMinutes: 2,
    showTimeline: true // 是否显示关卡时间轴
  },

  onLoad() {
    const pointsBalance = app.globalData.pointsBalance;
    const config = wx.getStorageSync('interviewConfig') || {};
    const gender = config.voiceGender || 'female';
    const showTimeline = config.showTimeline !== undefined ? config.showTimeline : true;
    this.setData({
      pointsBalance: pointsBalance,
      availableMinutes: Math.floor(pointsBalance / 10),
      voiceGender: gender,
      showTimeline: showTimeline
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

  // 选择面试官性别
  selectVoiceGender(e) {
    this.setData({
      voiceGender: e.currentTarget.dataset.value
    });
  },

  // 切换进度轴启用状态
  toggleTimeline(e) {
    const value = e.currentTarget.dataset.value === 'true';
    this.setData({
      showTimeline: value
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
      voiceGender: this.data.voiceGender,
      job: this.data.selectedJob,
      resumeMode: this.data.resumeMode,
      resumeFileId: this.data.resumeFileId,
      showTimeline: this.data.showTimeline // 存入关卡进度条选项
    };

    wx.setStorageSync('interviewConfig', interviewConfig);

    // 跳转到提示页面
    wx.navigateTo({
      url: '/pages/tips/tips'
    });
  }
})
