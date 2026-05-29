// pages/interview/interview.js
const app = getApp();
const recorderManager = wx.getRecorderManager();

Page({
  data: {
    interviewId: '',
    currentQuestion: null,
    isRecording: false,
    isAISpeaking: false,
    waveActive: false,
    dialogues: [],
    duration: 0,
    timerText: '00:00',
    timerInterval: null,
    audioContext: null
  },

  onLoad() {
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
  },

  // 初始化面试
  initInterview() {
    // 直接初始化，不显示弹窗
    this.setData({
      currentQuestion: {
        text: '您好，欢迎参加面试。请先做一个简单的自我介绍。'
      }
    });

    this.addDialogue('ai', '您好，欢迎参加面试。请先做一个简单的自我介绍。');
    this.startTimer();
  },

  // 初始化录音器
  initRecorder() {
    recorderManager.onStart(() => {
      console.log('录音开始');
      this.setData({ 
        isRecording: true,
        waveActive: true
      });
    });

    recorderManager.onStop((res) => {
      console.log('录音结束', res);
      this.setData({ 
        isRecording: false,
        waveActive: false
      });
      
      // 检查录音文件
      if (res.tempFilePath) {
        this.handleRecordingComplete(res.tempFilePath, res.duration);
      } else {
        wx.showToast({
          title: '录音失败，请重试',
          icon: 'none'
        });
      }
    });

    recorderManager.onError((err) => {
      console.error('录音错误', err);
      this.setData({ 
        isRecording: false,
        waveActive: false
      });
      wx.showToast({
        title: '录音出错：' + err.errMsg,
        icon: 'none',
        duration: 2000
      });
    });
  },

  // 开始录音
  startRecording() {
    // 先检查录音权限
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.record']) {
          // 已授权，直接开始录音
          this.doStartRecording();
        } else {
          // 未授权，请求授权
          wx.authorize({
            scope: 'scope.record',
            success: () => {
              this.doStartRecording();
            },
            fail: () => {
              wx.showModal({
                title: '需要录音权限',
                content: '请允许使用麦克风进行录音，否则无法进行面试',
                confirmText: '去设置',
                success: (modalRes) => {
                  if (modalRes.confirm) {
                    wx.openSetting();
                  }
                }
              });
            }
          });
        }
      }
    });
  },

  // 执行录音
  doStartRecording() {
    try {
      recorderManager.start({
        duration: 60000, // 最长60秒
        sampleRate: 16000,
        numberOfChannels: 1,
        encodeBitRate: 48000,
        format: 'mp3',
        frameSize: 10
      });
      
      console.log('开始录音');
    } catch (err) {
      console.error('启动录音失败', err);
      wx.showToast({
        title: '启动录音失败',
        icon: 'none'
      });
    }
  },

  // 停止录音
  stopRecording() {
    recorderManager.stop();
  },

  // 处理录音完成
  handleRecordingComplete(tempFilePath, duration) {
    console.log('录音文件路径:', tempFilePath);
    console.log('录音时长:', duration, 'ms');
    
    // 检查录音时长
    if (duration < 500) {
      wx.showToast({
        title: '录音时间太短',
        icon: 'none'
      });
      return;
    }
    
    // 显示上传提示
    wx.showLoading({ title: '上传中...' });
    
    // 上传录音文件到服务器
    wx.uploadFile({
      url: 'http://localhost:3000/api/interview/upload-audio', // 后端API地址
      filePath: tempFilePath,
      name: 'audio',
      formData: {
        interviewId: this.data.interviewId || 'test',
        duration: duration
      },
      success: (uploadRes) => {
        console.log('上传成功', uploadRes);
        
        if (uploadRes.statusCode === 200) {
          const data = JSON.parse(uploadRes.data);
          
          // 显示识别提示
          wx.showLoading({ title: '识别中...' });
          
          // 调用语音识别API
          this.recognizeSpeech(data.audioUrl);
        } else {
          wx.hideLoading();
          wx.showToast({
            title: '上传失败',
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        console.error('上传失败', err);
        wx.hideLoading();
        
        // 如果后端未启动，使用模拟数据
        wx.showToast({
          title: '后端未连接，使用模拟数据',
          icon: 'none',
          duration: 2000
        });
        
        // 使用模拟数据
        setTimeout(() => {
          this.useMockData();
        }, 2000);
      }
    });
  },

  // 语音识别
  recognizeSpeech(audioUrl) {
    wx.request({
      url: 'http://localhost:3000/api/interview/recognize',
      method: 'POST',
      data: {
        audioUrl: audioUrl,
        interviewId: this.data.interviewId || 'test'
      },
      success: (res) => {
        wx.hideLoading();
        
        if (res.statusCode === 200 && res.data.text) {
          const recognizedText = res.data.text;
          this.addDialogue('user', recognizedText);
          
          // 获取AI回复
          this.getAIResponse(recognizedText);
        } else {
          wx.showToast({
            title: '识别失败',
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        console.error('识别失败', err);
        wx.hideLoading();
        
        // 使用模拟数据
        this.useMockData();
      }
    });
  },

  // 获取AI回复
  getAIResponse(userText) {
    this.setData({ 
      isAISpeaking: true,
      waveActive: true 
    });
    
    wx.request({
      url: 'http://localhost:3000/api/interview/next-question',
      method: 'POST',
      data: {
        interviewId: this.data.interviewId || 'test',
        userAnswer: userText
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data.question) {
          const nextQuestion = res.data.question;
          this.addDialogue('ai', nextQuestion);
          
          // 模拟AI说话结束
          setTimeout(() => {
            this.setData({ 
              isAISpeaking: false,
              waveActive: false 
            });
          }, 2000);
        } else {
          this.useMockAIResponse();
        }
      },
      fail: (err) => {
        console.error('获取AI回复失败', err);
        this.useMockAIResponse();
      }
    });
  },

  // 使用模拟数据（后端未连接时）
  useMockData() {
    const mockTexts = [
      '我是一名应届毕业生，主修计算机科学，熟悉Java开发。',
      '我做过一个电商项目，使用Spring Boot和Vue.js开发。',
      '我的优势是学习能力强，能快速掌握新技术。',
      '我希望能在贵公司学习成长，为团队做出贡献。'
    ];
    
    const randomText = mockTexts[Math.floor(Math.random() * mockTexts.length)];
    this.addDialogue('user', randomText);
    
    // 模拟AI回复
    this.useMockAIResponse();
  },

  // 使用模拟AI回复
  useMockAIResponse() {
    this.setData({ 
      isAISpeaking: true,
      waveActive: true 
    });
    
    const mockQuestions = [
      '很好，请介绍一下你做过的项目经验。',
      '在项目中遇到过什么技术难题吗？如何解决的？',
      '你对我们公司有什么了解？为什么想加入我们？',
      '你有什么问题想问我吗？'
    ];
    
    const randomQuestion = mockQuestions[Math.floor(Math.random() * mockQuestions.length)];
    
    setTimeout(() => {
      this.addDialogue('ai', randomQuestion);
      
      setTimeout(() => {
        this.setData({ 
          isAISpeaking: false,
          waveActive: false 
        });
      }, 2000);
    }, 1000);
  },

  // 添加对话
  addDialogue(type, text) {
    const dialogues = this.data.dialogues;
    dialogues.push({ type, text });
    this.setData({ dialogues });
  },

  // 开始计时
  startTimer() {
    const interval = setInterval(() => {
      const duration = this.data.duration + 1;
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      const timerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      
      this.setData({
        duration: duration,
        timerText: timerText
      });
    }, 1000);

    this.setData({ timerInterval: interval });
  },

  // 结束面试
  endInterview() {
    wx.showModal({
      title: '确认结束',
      content: '确定要结束面试吗？',
      success: (res) => {
        if (res.confirm) {
          wx.redirectTo({
            url: '/pages/report/report?id=mock'
          });
        }
      }
    });
  }
})
