// pages/jobSelector/jobSelector.ts
Page({
  data: {
    activeCategory: 'hot',
    selectedJob: 'Java工程师',
    categories: [
      { key: 'hot', name: '热门高薪推荐' },
      { key: 'tech', name: '技术开发' },
      { key: 'product', name: '产品运营' },
      { key: 'design', name: '设计创意' },
      { key: 'market', name: '市场销售' },
      { key: 'finance', name: '金融财务' }
    ],
    jobsDatabase: {
      hot: ['Java工程师', 'AI产品经理', '新媒体运营', '基金经理', '数据分析师', '律师'],
      tech: ['Java工程师', '前端开发工程师', 'Python工程师', 'Android开发', 'iOS开发', '测试工程师'],
      product: ['产品经理', '产品运营', '用户运营', '内容运营', '活动运营', '数据运营'],
      design: ['UI设计师', 'UX设计师', '平面设计师', '视觉设计师', '交互设计师', '动画设计师'],
      market: ['市场专员', '销售经理', '商务拓展', '渠道经理', '品牌经理', '公关经理'],
      finance: ['会计', '财务分析师', '审计师', '税务专员', '投资顾问', '风控专员']
    },
    positions: [] as string[]
  },

  onLoad() {
    this.loadPositions('hot');
  },

  // 选择分类
  selectCategory(e: any) {
    const key = e.currentTarget.dataset.key;
    this.setData({ activeCategory: key });
    this.loadPositions(key);
  },

  // 加载岗位列表
  loadPositions(category: string) {
    const positions = this.data.jobsDatabase[category] || [];
    this.setData({ positions });
  },

  // 选择岗位
  selectJob(e: any) {
    const job = e.currentTarget.dataset.job;
    this.setData({ selectedJob: job });
    
    // 返回上一页并传递选中的岗位
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    if (prevPage) {
      prevPage.setData({ selectedJob: job });
    }
    
    wx.navigateBack();
  },

  // 搜索输入
  onSearchInput(e: any) {
    const keyword = e.detail.value.toLowerCase();
    
    if (!keyword) {
      this.loadPositions(this.data.activeCategory);
      return;
    }

    // 搜索所有分类中的岗位
    const allPositions: string[] = [];
    Object.values(this.data.jobsDatabase).forEach((positions: any) => {
      positions.forEach((pos: string) => {
        if (pos.toLowerCase().includes(keyword) && !allPositions.includes(pos)) {
          allPositions.push(pos);
        }
      });
    });

    this.setData({ positions: allPositions });
  }
})
