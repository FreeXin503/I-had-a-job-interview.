// pages/report/report.js
const app = getApp();

Page({
  data: {
    interviewId: '',
    durationMinutes: 3,
    report: {
      score: 85,
      rating: '良好',
      duration: 180,
      percentile: 75,
      evaluation: {
        professional: '在核心技术领域展现了扎实的基础知识。',
        logic: '回答过程逻辑清晰，条理分明。',
        adaptability: '面对追问能够保持沉稳，应对有方。',
        performance: '语言流畅，表述清晰，整体表现良好。'
      },
      questionAnalysis: [
        {
          questionOrder: 1,
          questionText: '请做一个简单的自我介绍。',
          breakdown: '考察候选人的基本表达能力和自我认知。',
          strategy: '简短介绍教育背景、核心技能与求职意向。',
          bestExample: '我是XX大学计算机专业应届毕业生，熟悉Java开发，有多个项目经验。'
        }
      ]
    }
  },

  onLoad(options) {
    const id = options.id;
    if (id) {
      this.setData({ 
        interviewId: id,
        durationMinutes: Math.floor(this.data.report.duration / 60)
      });
    }
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
