// pages/prep/prep.ts
const app = getApp<IAppOption>();

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
    pointsBalance: 20
  },

  onLoad() {
    this.setData({
      pointsBalance: app.globalData.pointsBalance
    });
  },

  // 选择经验
  selectExperience(e: any) {
    this.setData({
      experience: e.currentTarget.dataset.value
    });
  },

  // 选择风格
  selectStyle(e: any) {
    this.setData({
      style: e.currentTarget.dataset.value
    });
  },

  // 选择面试官性别
  selectVoiceGender(e: any) {
    this.setData({
      voiceGender: e.currentTarget.dataset.value
    });
  },

  // 显示岗位选择器
  showJobSelector() {
    wx.navigateTo({
      url: '/pages/jobSelector/jobSelector'
    });
  },

  // 选择简历模式
  selectResumeMode(e: any) {
    this.setData({
      resumeMode: e.currentTarget.dataset.value
    });
  },

  // 选择简历文件
  chooseResume() {
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      extension: ['pdf', 'doc', 'docx'],
      success: (res) => {
        const file = res.tempFiles[0];
        this.uploadResume(file);
      }
    });
  },

  // 上传简历
  uploadResume(file: any) {
    wx.showLoading({ title: '上传中...' });

    wx.uploadFile({
      url: `${app.globalData.apiBaseUrl}/resume/upload`,
      filePath: file.path,
      name: 'file',
      header: {
        'Authorization': `Bearer ${app.globalData.token}`
      },
      success: (res) => {
        const data = JSON.parse(res.data);
        if (data.code === 200) {
          this.setData({
            resumeUploaded: true,
            resumeFileName: file.name,
            resumeFileId: data.data.fileId
          });
          wx.showToast({
            title: '上传成功',
            icon: 'success'
          });
        } else {
          wx.showToast({
            title: data.message || '上传失败',
            icon: 'none'
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '上传失败',
          icon: 'none'
        });
      },
      complete: () => {
        wx.hideLoading();
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
      resumeFileId: this.data.resumeFileId
    };

    wx.setStorageSync('interviewConfig', interviewConfig);

    // 跳转到提示页面
    wx.navigateTo({
      url: '/pages/tips/tips'
    });
  }
})
