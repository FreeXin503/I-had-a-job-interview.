// pages/interview/interview.js
const app = getApp();
const recorderManager = wx.getRecorderManager();

// 面试官问题库（按轮次循环）
const AI_QUESTIONS = [
  '您好，欢迎参加面试。请先做一个简单的自我介绍。',
  '请介绍一下您做过的印象最深的项目经验。',
  '您在工作中遇到过最大的技术挑战是什么？如何解决的？',
  '您如何看待团队合作？有没有和同事产生分歧的经历，如何处理的？',
  '您对未来三到五年的职业规划是怎样的？',
  '您为什么想加入我们公司？对我们有什么了解？',
  '您有什么问题想问我们吗？'
];

const JOB_FIRST_QUESTIONS = {
  'Java工程师': '您好，欢迎参加Java工程师的面试。请先做一个自我介绍，并聊聊你在Java开发方面的核心技术栈和最近的项目经验。',
  '前端开发工程师': '您好，欢迎参加前端开发工程师的面试。请先做一个自我介绍，并聊聊你最擅长的前端技术栈以及你近期主导的核心项目。',
  '产品经理': '您好，欢迎参加产品经理的面试。请先做一个自我介绍，并介绍一下你主导过最具代表性的一款产品，以及你在其中的核心贡献。'
};

Page({
  data: {
    interviewId: '',
    currentQuestion: null,
    questionIndex: 0,
    isRecording: false,
    isAISpeaking: false,
    waveActive: false,
    dialogues: [],
    duration: 0,
    timerText: '00:00',
    timerInterval: null,
    voiceGender: 'female',
    activeInterviewer: 'female',
    femaleName: '王雅琪 (资深HR)',
    maleName: '张睿达 (技术主考官)',
    speakFrame: false
  },

  // 内部状态（不放 data 避免频繁 setData）
  speakInterval: null,
  audioContext: null,

  onLoad() {
    // 双重保障：启动时强制配置微信音频环境，防止静音与非扬声器播放
    if (wx.setInnerAudioOption) {
      wx.setInnerAudioOption({
        obeyMuteSwitch: false,
        speakerOn: true,
        success: () => console.log('面试房初始化设置音频参数成功：防静音、使用扬声器'),
        fail: (e) => console.warn('面试房初始化设置音频参数失败:', e)
      });
    }

    const config = wx.getStorageSync('interviewConfig') || {};
    const gender = config.voiceGender || 'female';
    this.setData({
      voiceGender: gender,
      activeInterviewer: gender,
      experience: config.experience || 'graduate',
      style: config.style || 'standard',
      jobTitle: config.job || 'Java工程师'
    });
    this.initRecorder();
    this.startTimer();
    this.checkRecordPermission();
    // 延迟一点让页面先渲染，再播放开场白
    setTimeout(() => {
      this.askQuestion(0);
    }, 500);
  },

  onUnload() {
    if (this.data.timerInterval) {
      clearInterval(this.data.timerInterval);
    }
    if (this.audioContext) {
      this.audioContext.destroy();
      this.audioContext = null;
    }
    this.stopSpeakingAnimation();
    recorderManager.stop();
  },

  // ────────────────────────────────────────
  // 面试官提问（核心流程）
  // ────────────────────────────────────────
  askQuestion(index) {
    const config = wx.getStorageSync('interviewConfig') || {};
    const jobTitle = config.job || 'Java工程师';
    let text = '';
    if (index === 0) {
      text = JOB_FIRST_QUESTIONS[jobTitle] || '您好，欢迎参加面试。请先做一个简单的自我介绍。';
    } else {
      text = AI_QUESTIONS[index % AI_QUESTIONS.length];
    }
    this.addDialogue('ai', text);
    this.setData({ questionIndex: index });
    // 播放面试官语音 TTS
    this.playTTS(text);
  },

  // ────────────────────────────────────────
  // TTS 语音播放
  // ────────────────────────────────────────
  playTTS(text) {
    // 先停掉上一次的音频
    if (this.audioContext) {
      this.audioContext.stop();
      this.audioContext.destroy();
      this.audioContext = null;
    }

    this.setData({ isAISpeaking: true });
    this.startSpeakingAnimation();

    // 调用后端 TTS 接口
    const gender = this.data.voiceGender || 'female';
    const style = (wx.getStorageSync('interviewConfig') || {}).style || 'standard';

    wx.request({
      url: `${app.globalData.apiBaseUrl}/interview/tts`,
      method: 'POST',
      data: { text, gender, style },
      success: (res) => {
        if (res.statusCode === 200 && res.data && res.data.audioUrl) {
          this._playAudioUrl(res.data.audioUrl);
        } else {
          // TTS 接口不可用，只做动画，2秒后结束
          this._simulateSpeaking(text.length * 80);
        }
      },
      fail: () => {
        // 网络不通，只做动画
        this._simulateSpeaking(text.length * 80);
      }
    });
  },

  // 播放音频 URL
  _playAudioUrl(url) {
    // 销毁旧的播放实例，防止内存溢出和音频重叠
    if (this.audioContext) {
      try {
        this.audioContext.stop();
        this.audioContext.destroy();
      } catch (e) {
        console.error('销毁上一个音频失败:', e);
      }
      this.audioContext = null;
    }

    console.log('正在缓存并播放面试官语音, 远程 URL:', url);
    
    // 设置全局音频选项（防静音、强行使用扬声器）
    if (wx.setInnerAudioOption) {
      wx.setInnerAudioOption({
        obeyMuteSwitch: false,
        speakerOn: true,
        success: () => console.log('播放时设置音频参数成功：防静音、使用扬声器'),
        fail: (e) => console.warn('播放时设置音频参数失败:', e)
      });
    }

    // 针对安卓和苹果双重优化：先下载到手机本地，再进行播放，彻底解决流式解码不兼容导致的静音问题
    wx.downloadFile({
      url: url,
      success: (downloadRes) => {
        if (downloadRes.statusCode === 200) {
          const localPath = downloadRes.tempFilePath;
          console.log('语音文件极速缓存成功，本地路径:', localPath);

          const ctx = wx.createInnerAudioContext();
          ctx.src = localPath;
          ctx.autoplay = true;
          ctx.obeyMuteSwitch = false; 
          this.audioContext = ctx;

          ctx.onPlay(() => {
            console.log('面试官语音实际播放中...');
          });

          ctx.onEnded(() => {
            console.log('面试官语音播放正常结束');
            this.setData({ isAISpeaking: false });
            this.stopSpeakingAnimation();
          });

          ctx.onError((err) => {
            console.error('本地音频播放失败，详细错误:', err);
            this.setData({ isAISpeaking: false });
            this.stopSpeakingAnimation();
            this._simulateSpeaking(3000);
          });

          ctx.play();
        } else {
          console.warn('语音下载失败，尝试直接在线播放...', downloadRes);
          this._playOnlineAudioUrl(url);
        }
      },
      fail: (err) => {
        console.warn('极速缓存失败，降级为直接在线播放...', err);
        this._playOnlineAudioUrl(url);
      }
    });
  },

  // 备用降级方案：在线直接播放
  _playOnlineAudioUrl(url) {
    const ctx = wx.createInnerAudioContext();
    ctx.src = url;
    ctx.autoplay = true;
    ctx.obeyMuteSwitch = false;
    this.audioContext = ctx;

    ctx.onPlay(() => {
      console.log('面试官在线语音实际播放中...');
    });

    ctx.onEnded(() => {
      this.setData({ isAISpeaking: false });
      this.stopSpeakingAnimation();
    });

    ctx.onError((err) => {
      console.error('在线音频播放失败', err);
      this.setData({ isAISpeaking: false });
      this.stopSpeakingAnimation();
      this._simulateSpeaking(3000);
    });

    ctx.play();
  },

  // 无音频时模拟说话动画
  _simulateSpeaking(durationMs) {
    const ms = Math.max(1500, Math.min(durationMs, 6000));
    setTimeout(() => {
      this.setData({ isAISpeaking: false });
      this.stopSpeakingAnimation();
    }, ms);
  },

  // ────────────────────────────────────────
  // 嘴巴动画
  // ────────────────────────────────────────
  startSpeakingAnimation() {
    if (this.speakInterval) clearInterval(this.speakInterval);
    this.setData({ speakFrame: true });
    this.speakInterval = setInterval(() => {
      this.setData({ speakFrame: !this.data.speakFrame });
    }, 250);
  },

  stopSpeakingAnimation() {
    if (this.speakInterval) {
      clearInterval(this.speakInterval);
      this.speakInterval = null;
    }
    this.setData({ speakFrame: false });
  },

  // ────────────────────────────────────────
  // 切换面试官
  // ────────────────────────────────────────
  switchInterviewer() {
    const next = this.data.activeInterviewer === 'female' ? 'male' : 'female';
    this.setData({ activeInterviewer: next, voiceGender: next });
    const config = wx.getStorageSync('interviewConfig') || {};
    config.voiceGender = next;
    wx.setStorageSync('interviewConfig', config);
    wx.showToast({
      title: '已切换为：' + (next === 'female' ? this.data.femaleName : this.data.maleName),
      icon: 'none',
      duration: 1500
    });
  },

  // ────────────────────────────────────────
  // 录音
  // ────────────────────────────────────────
  hasRecordPermission: false,
  isRecordingStarted: false,

  checkRecordPermission() {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.record'] === true) {
          this.hasRecordPermission = true;
        } else if (res.authSetting['scope.record'] === undefined) {
          wx.authorize({
            scope: 'scope.record',
            success: () => {
              this.hasRecordPermission = true;
            }
          });
        }
      }
    });
  },

  initRecorder() {
    recorderManager.onStart(() => {
      console.log('[录音] 开始');
      this.setData({ isRecording: true, waveActive: true });
      // 如果在开始录音前，用户已经提前松手了，立即停止录音以避免卡死
      if (!this.isRecordingStarted) {
        console.log('[录音] 启动时检测到已提前松手，立即停止');
        recorderManager.stop();
      }
    });

    recorderManager.onStop((res) => {
      console.log('[录音] 结束', res);
      this.setData({ isRecording: false, waveActive: false });
      this.isRecordingStarted = false;
      if (res.tempFilePath) {
        this.handleRecordingComplete(res.tempFilePath, res.duration);
      } else {
        wx.showToast({ title: '录音失败，请重试', icon: 'none' });
      }
    });

    recorderManager.onError((err) => {
      console.error('[录音] 错误', err);
      this.setData({ isRecording: false, waveActive: false });
      this.isRecordingStarted = false;
      wx.showToast({ title: '录音出错：' + (err.errMsg || ''), icon: 'none' });
    });
  },

  startRecording() {
    // 强制停止并释放播放器占用的硬件音频焦点，彻底杜绝第一次录音时 operatesRecorder:fail:audio 冲突！
    if (this.audioContext) {
      try {
        this.audioContext.stop();
        this.audioContext.destroy();
      } catch (e) {
        console.error('释放播放器焦点出错:', e);
      }
      this.audioContext = null;
    }
    this.setData({ isAISpeaking: false });
    this.stopSpeakingAnimation();

    if (this.hasRecordPermission) {
      // 已经有授权，100%同步立即录音，防止异步延迟导致松手事件先触发
      this.doStartRecording();
    } else {
      // 没授权，我们异步检查并授权
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.record'] === true) {
            this.hasRecordPermission = true;
            this.doStartRecording();
          } else if (res.authSetting['scope.record'] === false) {
            wx.showModal({
              title: '需要录音权限',
              content: '请在设置中允许使用麦克风',
              confirmText: '去设置',
              success: (r) => { if (r.confirm) wx.openSetting(); }
            });
          } else {
            wx.authorize({
              scope: 'scope.record',
              success: () => {
                this.hasRecordPermission = true;
                wx.showToast({ title: '授权成功，请重新长按说话', icon: 'none' });
              },
              fail: () => {
                wx.showModal({
                  title: '需要录音权限',
                  content: '请允许使用麦克风进行面试',
                  confirmText: '去设置',
                  success: (r) => { if (r.confirm) wx.openSetting(); }
                });
              }
            });
          }
        }
      });
    }
  },

  doStartRecording() {
    try {
      this.isRecordingStarted = true;
      recorderManager.start({
        duration: 60000,
        sampleRate: 16000,
        numberOfChannels: 1,
        format: 'wav'
      });
    } catch (err) {
      console.error('[录音] 启动失败', err);
      this.isRecordingStarted = false;
      wx.showToast({ title: '启动录音失败', icon: 'none' });
    }
  },

  stopRecording() {
    this.isRecordingStarted = false;
    recorderManager.stop();
  },

  // ────────────────────────────────────────
  // 处理录音完成 → 识别 → 回复
  // ────────────────────────────────────────
  handleRecordingComplete(tempFilePath, duration) {
    if (duration < 500) {
      wx.showToast({ title: '说话时间太短，请重试', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '识别中...' });

    // 上传录音到后端做语音识别
    wx.uploadFile({
      url: `${app.globalData.apiBaseUrl}/interview/upload-audio`,
      filePath: tempFilePath,
      name: 'audio',
      formData: { 
        duration: String(duration),
        history: JSON.stringify(this.data.dialogues),
        experience: this.data.experience || 'graduate',
        style: this.data.style || 'standard',
        jobTitle: this.data.jobTitle || 'Java工程师'
      },
      success: (uploadRes) => {
        wx.hideLoading();
        try {
          const result = JSON.parse(uploadRes.data);
          // 后端返回识别到的文字
          const recognizedText = result.text || result.recognizedText;
          
          if (!recognizedText || 
              recognizedText === '无法识别或用户没有说话' || 
              recognizedText === '语音解析失败，请确保录音格式为 WAV 格式') {
            wx.showToast({ title: '未听清声音，请重新按住说话', icon: 'none', duration: 2500 });
            return;
          }
          
          this.onUserAnswered(recognizedText, result.nextQuestion);
        } catch (e) {
          console.error('解析识别结果失败:', e);
          wx.showToast({ title: '识别失败，请重试', icon: 'none' });
        }
      },
      fail: (err) => {
        wx.hideLoading();
        console.error('[上传] 失败', err);
        wx.showToast({ title: '网络连接失败，请重试', icon: 'none' });
      }
    });
  },

  // 用户回答完成后的流程
  onUserAnswered(text, nextQuestion) {
    this.addDialogue('user', text);
    // 稍等片刻，面试官再提下一个动态思考产生的问题
    setTimeout(() => {
      this.addDialogue('ai', nextQuestion);
      this.playTTS(nextQuestion);
    }, 800);
  },

  // 按对话轮次返回模拟答案（真实感强）
  _getMockAnswer() {
    const answers = [
      '您好！我叫李明，本科毕业于计算机科学专业，有两年前端开发经验，熟悉 Vue、React 和微信小程序。',
      '我印象最深的项目是一个 SaaS 管理后台，我负责整体前端架构，首屏加载时间从 5 秒优化到了 1.2 秒。',
      '最大的挑战是处理复杂的状态管理，我通过引入 Pinia 并拆分模块，最终解决了数据流混乱的问题。',
      '我非常重视团队合作。曾经和同事对技术选型有分歧，我主动整理了对比文档，大家一起讨论后达成了共识。',
      '我希望三年内成为资深前端工程师，深入工程化和性能优化方向，长期目标是技术负责人。',
      '我对贵公司 AI 方向的布局非常感兴趣，希望能参与到真正有影响力的产品中，和团队一起成长。',
      '我想了解一下团队目前的技术栈和未来的产品方向，以及新人入职的成长路径是怎样的？'
    ];
    const idx = this.data.dialogues.filter(d => d.type === 'user').length;
    return answers[idx % answers.length];
  },

  // ────────────────────────────────────────
  // 对话 & 计时
  // ────────────────────────────────────────
  addDialogue(type, text) {
    const dialogues = this.data.dialogues.concat([{ type, text }]);
    this.setData({ dialogues });
  },

  startTimer() {
    const interval = setInterval(() => {
      const d = this.data.duration + 1;
      const mm = String(Math.floor(d / 60)).padStart(2, '0');
      const ss = String(d % 60).padStart(2, '0');
      this.setData({ duration: d, timerText: `${mm}:${ss}` });
    }, 1000);
    this.setData({ timerInterval: interval });
  },

  // ────────────────────────────────────────
  // 结束面试
  // ────────────────────────────────────────
  endInterview() {
    wx.showModal({
      title: '确认结束',
      content: '确定要结束面试吗？',
      success: (res) => {
        if (res.confirm) {
          wx.redirectTo({ url: '/pages/report/report?id=mock' });
        }
      }
    });
  }
})
