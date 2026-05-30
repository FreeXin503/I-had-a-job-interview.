// pages/interview/interview.ts
const app = getApp<IAppOption>();
const recorderManager = wx.getRecorderManager();

Page({
  data: {
    interviewId: '',
    currentQuestion: null as any,
    isRecording: false,
    isAISpeaking: false,
    dialogues: [] as any[],
    duration: 0,
    timerInterval: null as any,
    audioContext: null as any,
    voiceGender: 'female',
    activeInterviewer: 'female',
    femaleName: '王雅琪 (资深HR)',
    maleName: '张睿达 (技术主考官)',
    speakFrame: false
  },

  // 内部定时器
  speakInterval: null as any,

  onLoad() {
    const config = wx.getStorageSync('interviewConfig') || {};
    const gender = config.voiceGender || 'female';
    this.setData({
      voiceGender: gender,
      activeInterviewer: gender
    });
    this.initInterview();
    this.initRecorder();
  },

  onUnload() {
    if (this.data.timerInterval) {
      clearInterval(this.data.timerInterval);
    }
    if (this.data.audioContext) {
      this.data.audioContext.destroy();
    }
    this.stopSpeakingAnimation();
  },

  // 开始嘴巴张开闭合动画
  startSpeakingAnimation() {
    if (this.speakInterval) {
      clearInterval(this.speakInterval);
    }
    this.setData({ speakFrame: true });
    this.speakInterval = setInterval(() => {
      this.setData({
        speakFrame: !this.data.speakFrame
      });
    }, 250); // 每250毫秒张合一次
  },

  // 停止嘴巴动画
  stopSpeakingAnimation() {
    if (this.speakInterval) {
      clearInterval(this.speakInterval);
      this.speakInterval = null;
    }
    this.setData({ speakFrame: false });
  },

  // 切换面试官角色
  switchInterviewer() {
    const nextInterviewer = this.data.activeInterviewer === 'female' ? 'male' : 'female';
    this.setData({
      activeInterviewer: nextInterviewer
    });
    
    // 更新本地配置中的性别，这样后续的问题请求也会自动使用新声音！
    const config = wx.getStorageSync('interviewConfig') || {};
    config.voiceGender = nextInterviewer;
    wx.setStorageSync('interviewConfig', config);

    wx.showToast({
      title: '已切换为：' + (nextInterviewer === 'female' ? this.data.femaleName : this.data.maleName),
      icon: 'none',
      duration: 1500
    });
  },

  // 初始化面试
  async initInterview() {
    wx.showLoading({ title: '初始化中...' });

    try {
      const config = wx.getStorageSync('interviewConfig');
      
      // 创建面试会话
      const createRes = await this.createInterview(config);
      const interviewId = createRes.id;
      
      this.setData({ interviewId });

      // 开始面试
      const startRes = await this.startInterview(interviewId);
      
      this.setData({
        currentQuestion: startRes.question
      });

      // 添加到对话列表
      this.addDialogue('ai', startRes.question.text);

      // 播放语音
      if (startRes.question.audioUrl) {
        this.playAudio(startRes.question.audioUrl);
      }

      // 开始计时
      this.startTimer();

      wx.hideLoading();
    } catch (error) {
      wx.hideLoading();
      wx.showToast({
        title: '初始化失败',
        icon: 'none'
      });
    }
  },

  // 创建面试会话
  createInterview(config: any): Promise<any> {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${app.globalData.apiBaseUrl}/interview/create`,
        method: 'POST',
        header: {
          'Authorization': `Bearer ${app.globalData.token}`
        },
        data: config,
        success: (res: any) => {
          if (res.data.code === 200) {
            resolve(res.data.data);
          } else {
            reject(res.data.message);
          }
        },
        fail: reject
      });
    });
  },

  // 开始面试
  startInterview(interviewId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${app.globalData.apiBaseUrl}/interview/${interviewId}/start`,
        method: 'POST',
        header: {
          'Authorization': `Bearer ${app.globalData.token}`
        },
        success: (res: any) => {
          if (res.data.code === 200) {
            resolve(res.data.data);
          } else {
            reject(res.data.message);
          }
        },
        fail: reject
      });
    });
  },

  // 初始化录音器
  initRecorder() {
    recorderManager.onStart(() => {
      console.log('录音开始');
      this.setData({ isRecording: true });
    });

    recorderManager.onStop((res) => {
      console.log('录音结束', res);
      this.setData({ isRecording: false });
      this.handleRecordingComplete(res.tempFilePath);
    });
  },

  // 开始录音
  startRecording() {
    wx.authorize({
      scope: 'scope.record',
      success: () => {
        recorderManager.start({
          format: 'mp3'
        });
      },
      fail: () => {
        wx.showModal({
          title: '需要录音权限',
          content: '请允许使用麦克风进行录音',
          success: (res) => {
            if (res.confirm) {
              wx.openSetting();
            }
          }
        });
      }
    });
  },

  // 停止录音
  stopRecording() {
    recorderManager.stop();
  },

  // 处理录音完成
  async handleRecordingComplete(tempFilePath: string) {
    wx.showLoading({ title: '识别中...' });

    try {
      // 上传音频并转文字
      const text = await this.speechToText(tempFilePath);
      
      // 添加到对话列表
      this.addDialogue('user', text);

      // 提交答案
      await this.submitAnswer(text);

      // 获取下一个问题
      await this.getNextQuestion();

      wx.hideLoading();
    } catch (error) {
      wx.hideLoading();
      wx.showToast({
        title: '识别失败',
        icon: 'none'
      });
    }
  },

  // 语音转文字
  speechToText(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: `${app.globalData.apiBaseUrl}/agent/speech-to-text`,
        filePath,
        name: 'audio',
        header: {
          'Authorization': `Bearer ${app.globalData.token}`
        },
        success: (res) => {
          const data = JSON.parse(res.data);
          if (data.code === 200) {
            resolve(data.data.text);
          } else {
            reject(data.message);
          }
        },
        fail: reject
      });
    });
  },

  // 提交答案
  submitAnswer(answerText: string): Promise<any> {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${app.globalData.apiBaseUrl}/interview/${this.data.interviewId}/submit-answer`,
        method: 'POST',
        header: {
          'Authorization': `Bearer ${app.globalData.token}`
        },
        data: {
          questionId: this.data.currentQuestion.id,
          answerText
        },
        success: (res: any) => {
          if (res.data.code === 200) {
            resolve(res.data.data);
          } else {
            reject(res.data.message);
          }
        },
        fail: reject
      });
    });
  },

  // 获取下一个问题
  async getNextQuestion() {
    try {
      const res: any = await new Promise((resolve, reject) => {
        wx.request({
          url: `${app.globalData.apiBaseUrl}/interview/${this.data.interviewId}/next-question`,
          header: {
            'Authorization': `Bearer ${app.globalData.token}`
          },
          success: resolve,
          fail: reject
        });
      });

      if (res.data.code === 200) {
        const question = res.data.data;
        this.setData({ currentQuestion: question });
        this.addDialogue('ai', question.text);

        if (question.audioUrl) {
          this.playAudio(question.audioUrl);
        }
      }
    } catch (error) {
      console.error('获取问题失败', error);
    }
  },

  // 播放音频
  playAudio(url: string) {
    const audioContext = wx.createInnerAudioContext();
    audioContext.src = url;
    audioContext.play();

    this.setData({
      isAISpeaking: true,
      audioContext
    });
    this.startSpeakingAnimation();

    audioContext.onEnded(() => {
      this.setData({ isAISpeaking: false });
      this.stopSpeakingAnimation();
    });

    audioContext.onError(() => {
      this.setData({ isAISpeaking: false });
      this.stopSpeakingAnimation();
    });
  },

  // 添加对话
  addDialogue(type: string, text: string) {
    const dialogues = this.data.dialogues;
    dialogues.push({ type, text });
    this.setData({ dialogues });
  },

  // 开始计时
  startTimer() {
    const interval = setInterval(() => {
      this.setData({
        duration: this.data.duration + 1
      });
    }, 1000);

    this.setData({ timerInterval: interval });
  },

  // 结束面试
  endInterview() {
    wx.showModal({
      title: '确认结束',
      content: '确定要结束面试吗？',
      success: async (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '生成报告中...' });

          try {
            await this.endInterviewRequest();
            wx.hideLoading();
            
            wx.redirectTo({
              url: `/pages/report/report?id=${this.data.interviewId}`
            });
          } catch (error) {
            wx.hideLoading();
            wx.showToast({
              title: '结束失败',
              icon: 'none'
            });
          }
        }
      }
    });
  },

  // 结束面试请求
  endInterviewRequest(): Promise<any> {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${app.globalData.apiBaseUrl}/interview/${this.data.interviewId}/end`,
        method: 'POST',
        header: {
          'Authorization': `Bearer ${app.globalData.token}`
        },
        success: (res: any) => {
          if (res.data.code === 200) {
            resolve(res.data.data);
          } else {
            reject(res.data.message);
          }
        },
        fail: reject
      });
    });
  }
})
