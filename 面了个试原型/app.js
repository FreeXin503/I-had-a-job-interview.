/**
 * '面了个试' AI Mock Interview H5 Core Logic Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Categorised Positions Database
  const jobsDatabase = {
    hot: {
      name: "热门高薪推荐",
      positions: ["Java工程师", "AI产品经理", "新媒体运营", "基金经理", "数据分析师", "律师"]
    },
    hotel: {
      name: "酒店/旅游",
      positions: ["酒店前台", "礼仪/迎宾/接待", "客房服务员", "酒店经理", "酒店前厅经理", "客房经理", "民宿管家", "旅游顾问", "导游", "旅游产品经理", "讲解员", "计调", "票务员"]
    },
    energy: {
      name: "能源/环保/农业",
      positions: ["环境工程师", "新能源开发", "水质检测员", "环保技术员", "农业技术推广", "园艺师", "地质勘探员"]
    },
    consult: {
      name: "咨询/翻译/法律",
      positions: ["管理咨询顾问", "英语翻译", "日语翻译", "法律顾问", "合规专家", "知识产权代理人", "专利代理师"]
    },
    finance: {
      name: "金融",
      positions: ["基金经理", "证券分析师", "理财顾问", "信贷审批员", "精算师", "风险控制专员", "柜面业务员"]
    },
    medical: {
      name: "医疗健康",
      positions: ["临床医生", "护士", "药剂师", "医疗器械销售", "健康管理师", "心理咨询师", "医药研发员"]
    },
    car: {
      name: "汽车",
      positions: ["汽车研发工程师", "汽车销售", "汽车维修工", "自动驾驶标定", "整车测试员", "汽车配件开发"]
    },
    trade: {
      name: "采购/贸易",
      positions: ["采购专员", "外贸业务员", "报关员", "采购经理", "单证员", "供应链专员", "报检员"]
    },
    logistics: {
      name: "物流/仓储/司机",
      positions: ["仓库管理员", "快递员", "货运司机", "物流调度员", "供应链分析师", "跨境物流专员"]
    },
    market: {
      name: "市场/公关/广告",
      positions: ["市场策划专员", "公关经理", "广告媒介策划", "活动执行", "品牌公关", "文案策划", "SEO优化师"]
    },
    media: {
      name: "直播/影视/传媒",
      positions: ["带货主播", "视频剪辑师", "新媒体运营", "影视编导", "摄像师", "直播运营", "媒介公关"]
    },
    estate: {
      name: "房地产/建筑",
      positions: ["置业顾问", "室内设计师", "土木工程师", "造价工程师", "项目经理", "物业客服", "测绘工程师"]
    }
  };

  // 2. Customized Questions Pool by Job
  const questionsPool = {
    "Java工程师": [
      {
        question: "作为应届生肯定有过课程相关的小组开发经历，能不能和我说话你在某次Java相关的小组作业中，是怎么和队友配合完成模块开发的？",
        userAnswerText: "好的，谢谢面试官。在大学期间，我们有一次电商系统的大型Java课程设计。我作为小组的后端负责人，积极与前端同学每日对接需求与接口文档。我们使用Git来进行代码的版本管理，规定大家在下班前必须提交并解决冲突。面对关键核心字段，我们和数据库团队共同明确表结构 and 字段规范。遇到有些队员开发进度较慢的情况，我也会主动配合他们联调补位。最后我们的系统通过了各种测试，在上线展示时零Bug通过，整体作业得到了优秀成绩。",
        parsedBreakdown: "属于行为面试问题，旨在考察候选人的团队协作能力、真实Java开发实践经验。重点关注职责划分、沟通流程、危机处理及项目质量保障。",
        parsedStrategy: "建议先明确自身角色（如后端负责人），说明与队友的接口约定与联调流程，如何分摊任务及快速补位，最后用具体的数据或成果来例证开发效果。",
        parsedBestExample: "“我在Java课程小组作业中担任后端负责人。我和前端约定每日定时对齐接口文档，并对关键字段设计规范，模块代码使用Git版本控制，最终按时完成任务，零Bug上线，小组作业获92分。”"
      },
      {
        question: "具体说一下你在小组作业中的角色和负责的模块。",
        userAnswerText: "我在电商系统小组开发中主要负责的是订单模块和第三方支付对接模块。在技术选型上，我们统一使用 Spring Boot + SSM 核心框架来快速搭建。为了保证订单生成的高性能与幂等性，我在订单接口中引入了业务逻辑防重机制。同时，我负责对接了微信支付的官方SDK，完成了订单支付回调以及订单状态机异步驱动流转的闭环。在本地开发时，我也负责了数据库联接池的优化，最终开发出的接口在本地压力测试下表现稳定，响应均在150毫秒以内。",
        parsedBreakdown: "属于深度追问类问题，旨在过滤简历水分。考察候选人对自己编写代码模块的参与深度、功能全貌和技术选型的底层认知。",
        parsedStrategy: "建议精准切入所负责的业务（如订单或支付模块），并罗列使用的核心技术栈（如Spring Boot + Redis），说明模块的技术难点和自己是如何亲手解决的。",
        parsedBestExample: "“我在Java电商系统小组作业中负责订单核心模块，用Spring Boot实现订单生成、状态机变更、以及微信支付接口对接，同时用Redis缓存商品热点库存，大幅提升高并发抢购下的响应速度。”"
      },
      {
        question: "刚刚你提到了小组作业，那在你们使用Java开发的过程中，肯定会涉及到一些框架的应用。我们知道Spring框架是Java后端开发的绝对核心，你能不能给我讲讲Spring IoC的核心原理，以及它在实际开发中能帮我们解决什么问题？",
        userAnswerText: "好的，面试官。Spring IoC（控制反转）是Spring框架最核心的理念之一。它的核心原理是把原先我们自己手动 new 对象的控制权，反转让渡给 Spring 的 IoC 容器。IoC 容器底层主要通过反射机制（Reflection）、工厂设计模式（Factory Pattern）以及 XML 配置或注解解析来实现对象的生命周期管理。在实际开发中，它最大的作用是实现组件的完全解耦。比如我们在写业务层 Service 时不需要强依赖底层的 Dao 具体类，而是通过依赖注入（DI）由容器在运行时装配。这避免了硬编码，使代码在做单元测试和后期扩展时极其简单，极大提高了团队的协同开发效率。",
        parsedBreakdown: "属于底层技术核心问题。考察候选人对Spring核心理念（控制反转）的掌握广度，检验其是对底层源码和设计模式有所理解，还是仅会调包使用。",
        parsedStrategy: "要清晰解释‘控制反转（IoC）’是把对象的生命周期与依赖关系托管给Spring容器。再结合实际项目阐明由于IoC的使用，极大地降低了组件之间的强耦合，实现松耦合，便于测试与系统扩展。",
        parsedBestExample: "“Spring IoC核心是控制反转，将原本手动new对象的控制权交给Spring Container管理，底层依靠反射加工厂模式实现依赖注入（DI）。这帮我们彻底解耦了Service和Dao层，降低开发维护成本，提升团队并行开发效率。”"
      }
    ],
    "AI产品经理": [
      {
        question: "作为AI产品经理，你如何评估一个AI模型的落地可行性，以及如何与算法团队配合推进产品研发？",
        userAnswerText: "在评估落地可行性时，我主要从业务场景契合度、数据资源可获得性、算法准确率上限以及推理计算成本四个维度进行考量。与算法团队配合时，我不会直接抛出一个含糊的产品指标，而是建立科学的指标评测集。我们会将产品业务目标拆解为算法指标，比如将内容推荐转化率拆解为召回率和精确率，采用每日敏捷站会和白板推演，快速探索基线（Baseline）模型，并在早期介入数据集特征标注，确保工程与算法目标对齐。",
        parsedBreakdown: "考察AI产品经理的技术敏感度与算法团队的协作常识。重点考核数据工程、模型基线建立及端到端交付的协作经验。",
        parsedStrategy: "说明从场景、数据、算力、成本多维度系统性分析的框架，并具体表述如何用数据评测集去对齐产品目标与算法模型，避免盲目定指标。",
        parsedBestExample: "“我主要从场景契合度、数据壁垒、算法精度及推理成本四维评估可行性。通过建立严密的数据集评测标准，将产品转化率拆解为精确率指标，与算法团队快速迭代Baseline，避免目标不对齐导致的研发失控。”"
      },
      {
        question: "具体说说你主导过的AI产品或大模型应用项目，你主要负责的角色是什么？",
        userAnswerText: "我曾主导过一款大模型智能客服助手的产品设计。在这个项目中，我担任端到端的产品负责人。我主导了基于RAG（检索增强生成）的技术路线规划，设计了针对企业内部知识库的向量检索与大模型重写的混合链条。我重点解决了模型幻觉问题，通过引入双重过滤校验（Guardrails）机制，使得大模型的回答置信度从75%提升至95%以上。同时，我负责设计了人机协同系统的无缝交互流转界面，支持AI在置信度过低时自动流转为人工客服跟进。",
        parsedBreakdown: "考察候选人在大模型时代下真实的业务落地经验，关注RAG（检索增强生成）、幻觉控制以及人机协同流转设计能力。",
        parsedStrategy: "建议选择高可信度的技术热点（如RAG、Agents）来介绍，结合具体的业务痛点（如幻觉、召回不准）并给出具体的量化优化数据（如置信度提升百分比）。",
        parsedBestExample: "“我负责大模型客服RAG平台研发。通过引入混合检索及前端知识召回校验链，将模型幻觉率压降至5%以下，并首创人机协同漏斗交互，实现置信度过低一键转人工，大幅保障企业级交付质量。”"
      },
      {
        question: "当用户体验与模型推理延迟（Latency）产生冲突时，你通常会采取什么产品策略来优化用户体验？",
        userAnswerText: "大模型推理延迟是普遍痛点。从产品策略上，我通常会采用三种方式：第一，采用流式传输（Streaming）进行打字机特效渲染，让用户能第一秒看到首Token输出，极大降低感知等待；第二，在前端设计富有情感和科技感的微加载与动态占位符提示，或在后台执行意图识别的并行处理；第三，从模型层，协同算法同学针对高频简单场景进行大模型蒸馏（Distillation）出小参数模型，甚至使用端侧轻量化模型，做到冷启动瞬间响应。",
        parsedBreakdown: "考察面对工程技术瓶颈时，产品经理的变通交互设计能力与技术优化思路。考验是否兼具产品美学与工程思维。",
        parsedStrategy: "从前端“障眼法”交互（流式传输、微动效）与后端/模型层“硬直优化”（并行处理、模型蒸馏、端侧模型）两方面递进阐述。",
        parsedBestExample: "“当推理延迟与体验冲突，我通过前端流式Stream渲染消除首字等待，结合多轮并行意图识别进行异步预加载。同时协同算法对简单高频任务进行轻量级蒸馏，软硬兼施保障响应时间控制在500ms以内。”"
      }
    ],
    "新媒体运营": [
      {
        question: "在新媒体平台（如小红书、抖音）运营中，你通常是如何规划选题并提高爆款产出率的？",
        userAnswerText: "我规划选题的核心是一套“黄金三角法则”：结合社会热点、挖掘用户痛点、契合账号定位。我每天会花2小时监测行业头部爆词和爆款笔记，进行拆解分析。在选题策划上，我建立了自己的“选题弹药库”。爆款的产出不是玄学，而是精细化的灰度测试。我们会针对同一个选题，制作三种不同的封面和前3秒钩子（Hooks），在小范围粉丝群或灰度池进行测试，选取CTR（点击率）表现最好的进行全网分发，以此来提高起量率。",
        parsedBreakdown: "考查候选人选题规划的系统方法论和数据驱动意识。检验其是靠灵感拼运气还是有爆款拆解套路与测图流程。",
        parsedStrategy: "提出爆款选题法则，强调数据监测与竞品拆解。并阐述对前3秒黄金钩子和灰度CTR测试的重视，展现专业的新媒体矩阵运营方法。",
        parsedBestExample: "“我基于热点、痛点、定位三法则构建选题库。每日深度复盘大盘爆词，利用AB测试对笔记封面、3秒钩子在灰度池进行点击率测试，筛选极佳CTR数据后全网放大，爆款起量率提升了40%。”"
      },
      {
        question: "具体分享一个你从0到1做起或者成功实现大幅涨粉的账号运营案例？",
        userAnswerText: "我曾主导过一个职场技能类垂直账号从小透明到20万粉丝的涨粉项目。冷启动阶段，我通过深度用户画像分析，锁定了“刚入职3年的职场小白”为目标人群。在内容格式上，首创了“1分钟搞定复杂Excel/PPT”的超省时保姆级短视频定位。通过设计强烈的视觉冲突封面和“你绝对不知道的Excel黑科技”前置痛点，我们第一周就产出了一条播放量超百万的爆款，涨粉3万。随后，我建立了社群运营阵地，设计免费资料裂变机制，将热度持续锁在私域里，最终在3个月内完成了从0到20万粉的跃迁。",
        parsedBreakdown: "考核具体的冷启动运营落地成果。关注目标受众画像、产品内容形态定义、爆款引流以及精细化转化路径。",
        parsedStrategy: "用具体的定位策略（如超省时保姆级）、创新的内容呈现、具体的爆款机制和清晰的量化结果（如3个月从0到20万）进行系统化复盘。",
        parsedBestExample: "“我曾从零打造20万粉职场大号。锁定入职3年职场人群，首创1分钟痛点教学。通过爆款视频+社群免费资料裂变链条，冷启动首周打造百万级播放，涨粉3万，三个月构建起20万的高粘性粉丝矩阵。”"
      },
      {
        question: "如何进行数据回盘？你最关注的核心数据指标有哪些，如何针对指标下滑做策略调整？",
        userAnswerText: "数据回盘是我的核心日常。我重点关注的指标漏斗包括：点击率（CTR，反映标题封面吸引力）、5秒留存率（反映开头钩子强弱）、完播率（反映内容价值与节奏）以及互动率（赞藏评分享，反映共鸣感）。当发现数据下滑时，我会立刻拆解：如果播放量骤降，先排查是否违规被限流；若点击率下滑，迅速更换三版备用封面与标题；若留存差，则精简开头，将干货前置；若互动低，则在视频结尾处设计“投票选择”或“评论区领资料”的互动钩子引发用户热烈探讨。",
        parsedBreakdown: "考察候选人的数据漏斗分析思维和基于反馈快速调整账号策略的敏捷应变能力。",
        parsedStrategy: "清晰列举运营漏斗核心指标（CTR、5秒留存、完播率、互动率），针对各项数据指标的异常，给出具体的“对症下药”式调整方法。",
        parsedBestExample: "“我聚焦数据漏斗管理，重点监控CTR、留存、完播与互动。点击低即优化标题与头图，留存低则将核心痛点干货前置，完播低则压缩时长，互动低则设计痛点争议性结尾，实现数据驱动的动态自愈。”"
      }
    ],
    "酒店前台": [
      {
        question: "在酒店前台工作中，如果遇到客人因为房间卫生或排队过久而产生情绪问题，你通常会如何处理？",
        userAnswerText: "我通常会遵循“先处理心情，再处理事情”的原则。第一步，我会先诚恳道歉，并递上一杯温水，主动将客人引导至休息区就坐，避免客人的负面情绪在大厅里蔓延影响其他宾客；第二步，我会迅速核查原因，如果是因为排队久，我会加快办理，如果是因为卫生，我会在征得客人同意后，为客人免费升级一档行政房型并致送双人早餐；第三步，在客人入住半小时后，致电客房询问体验，确保客人感到自己被极致地重视与尊重。",
        parsedBreakdown: "考核酒店服务行业中极为核心的危机公关与对客安抚素养。考核同理心与问题处理的灵活性。",
        parsedStrategy: "明确“情绪安抚+危机隔离+痛点处理+后续回访跟踪”的四步走黄金流程，给出升级房型、送礼品或免单的灵活授权策略。",
        parsedBestExample: "“我遵循情绪先导原则，诚恳致歉并送温水，带客人至休息区隔离不良情绪。迅速协调升级为行政房型并致送早餐作为补偿，入住半小时后电话回访，用极致的真诚将客户抱怨化解为五星好评。”"
      },
      {
        question: "能具体分享一次你妥善处理过棘手客户投诉或突发状况的真实经历吗？",
        userAnswerText: "有一次在国庆黄金周满房的深夜，一位带着婴儿的台胞外宾因为房间靠近马路噪音大，非常焦急地到前台要求换房，但当时酒店所有房型已完全预订满。看着疲惫的母亲和啼哭的婴儿，我首先将客人带到安静的前台会客室倒上暖茶。随后，我立刻排查所有预离未到房源，并联系了一位本地常客，解释了有带婴儿的母亲面临的困难，成功帮该常客调换到了更高级的套房，从而空出了一间极其安静的内侧花园房给台胞。客人感动万分，在退房时写下了一封长长的感谢信，后来成为了酒店的忠实年卡会员。",
        parsedBreakdown: "考查候选人在极限业务场景下的危机管理、资源调度以及临场决断魄力。检验其是否具有真正的服务艺术。",
        parsedStrategy: "通过“黄金周满房”的极限冲突切入，展示极其充实的对客沟通技巧、熟客资源调度、充满人情味的问题解决思路，以及最终出色的转化成果。",
        parsedBestExample: "“国庆满房深夜，我面对携婴外宾因噪音要求换房的危机，在无房可换的极端情况下，通过灵活沟通一位本地熟客成功完成三方房源调度，调换出内侧花园静音房。不仅圆满解决危机，更转化出一位高价值白金会员。”"
      },
      {
        question: "作为前台，如何向办理入住的散客推荐酒店的会员卡或升级房型服务，谈谈你的技巧？",
        userAnswerText: "我推荐会员卡和房型升级的核心是“场景化痛点置换”和“超值账单对比”。在办理入住时，我会通过敏锐的观察，根据客人是商务出差还是家庭亲子游来切入。如果是商旅客人，我会说：‘哥，您看您今天住2晚，如果现在加80元升级行政房，不仅可以免费使用27楼的行政酒廊，免费洗衣，享受延迟退房到下午4点，还能直接积双倍积分，算下来能帮您省下近300元的差旅消费开支呢！’我不会生硬推销，而是把升级带来的利益点同客人的痛点精准挂钩，让客人觉得这笔开销是绝对的‘超值划算’。",
        parsedBreakdown: "考查前台的销售转化能力。关注场景化推荐、利益痛点挖掘和对比算账技巧，这是衡量优秀前台价值的关键指标。",
        parsedStrategy: "建议使用场景定位（商旅与亲子）、利益点场景化对比（行政酒廊、洗衣、积分）来阐述推销话术，体现专业又体面的推销水平。",
        parsedBestExample: "“我采用场景化痛点植入与对比算账法进行转化。精准捕捉商旅需求，将升级行政房同免费酒廊、免费洗衣、延迟退房等商旅痛点挂钩，列对比账单给客户看，化推销为帮客户省钱，房型升级率始终保持前三。”"
      }
    ],
    "通用": [
      {
        question: "请结合您的过往经历，简短做一下自我介绍，重点说说你的优势以及你为什么适合你所选择的这个面试岗位？",
        userAnswerText: "面试官您好！非常高兴今天能有这个机会跟您进行交流。针对我今天申请的这个岗位，我主要有以下三个维度的核心优势：第一是扎实的专业素养和技术积累，在校期间和过往实践中我投入了大量精力钻研该领域的核心知识与底层逻辑；第二是出色的团队协作与项目交付能力，我能快速融入团队并积极配合伙伴进行资源调度与模块攻关；第三是强烈的工作热情与持续学习的驱动力。我有信心能够快速融入企业并为团队创造真实业务价值。",
        parsedBreakdown: "考察候选人的基础自我认知与岗位匹配度。评估语言表达流畅度与核心优势提炼逻辑。",
        parsedStrategy: "建议先表达问候，然后用三段式（专业技能、项目实践、学习态度）进行核心优势提炼，表达对岗位的向往与胜任信心。",
        parsedBestExample: "“我是今天的候选人。我具备扎实的专业积累、出色的项目攻关和交付能力以及自驱的学习热情。我能迅速融入团队并以高标准完成职责，非常期待能加入贵团队贡献力量。”"
      },
      {
        question: "在您过往的工作或项目开发经历中，如果遇到与同事或合作伙伴在技术方案、业务逻辑上产生严重分歧时，你通常会如何处理？",
        userAnswerText: "面对意见分歧，我首先会提醒自己保持冷静和客观，绝不在带有主观情绪的状态下做决策。第二，我会遵循‘数据与事实说话’的原则。我会将分歧的两种方案分别列出其优缺点、上线成本、性能开销以及潜在的安全风险，整理成对比表格。第三，我们会进行团队白板探讨，如果仍然无法达成一致，我会请教团队技术专家或项目负责人，从全局和高维度视角的架构规划上来协助定夺。一旦团队敲定了最终决策，不论我之前持有何种意见，我都会100%全力以赴执行，确保项目进度按期推进。",
        parsedBreakdown: "属于经典的行为面试题。旨在评估候选人的沟通合作素养、妥协艺术、解决冲突的方法论以及对最终决策的执行力。",
        parsedStrategy: "提出冷静安抚、数据对比分析、团队架构会签、100%无条件服从最终决策并全力执行的流程框架。",
        parsedBestExample: "“我面对分歧时遵循冷静沟通与事实说话原则。用数据和指标列出对比表进行客观白板推演。协商无果则寻求上级或专家高维判定。一旦最终决策敲定，不论是否符合我个人预期，我都将100%全力配合执行。”"
      },
      {
        question: "谈谈你的未来职业规划。在未来的1-3年内，你在专业技能和职业发展上有什么具体的规划和学习目标？",
        userAnswerText: "我对自己的未来1-3年规划非常清晰。在第1年，我的核心目标是迅速熟悉公司的业务流程、底层技术框架和团队的开发协作规范，争取做到能够独立担当核心复杂模块的开发，成为团队里靠谱的‘交付主力’；在第2到第3年，我希望在纵向上继续深挖底层专业深度，向高级资深专家靠拢，攻克系统中的各种性能瓶颈和架构难题。同时，在横向上我也会学习一些系统规划、项目管理和跨部门沟通知识，争取能够作为项目核心接口人带领小组攻坚，实现从单一技术人员向复合型交付专家的蜕变。",
        parsedBreakdown: "考察候选人的职业自驱力、稳定性以及对于未来成长曲线是否有着明确和理性的思考。",
        parsedStrategy: "按时间轴分阶段表述（第一年打基础独当一面、第二至三年纵深研究并开始带团队），将成长目标同公司业务贡献紧密结合。",
        parsedBestExample: "“我未来规划清晰：第1年深耕业务逻辑与团队架构规范，做到独立承担核心模块；第2-3年纵深钻研底层机制成为领域专家，横向扩充项目调度与跨部门沟通，努力向能带领团队攻坚的骨干人才转化。”"
      }
    ]
  };

  // 3. Global App States
  const state = {
    currentView: 'home',
    experience: 'graduate',
    style: 'standard',
    job: 'Java工程师',
    resumeMode: 'no-resume',
    resumeUploaded: false,
    resumeFileName: '',
    interviewTime: 0,
    interviewTimerInterval: null,
    currentQuestionIndex: 0,
    isInterviewerSpeaking: false,
    isUserAnswering: false,
    questionsList: [],
    
    // Upgraded Statistics state tracking
    pointsBalance: 20, // Replicates 20 remaining points from first image
    mockInterviewCount: 3, // Replicates 3 simulated interviews
    resumeOptimizationCount: 0 // Replicates 0 resume optimizations
  };

  // DOM Elements
  const DOM = {
    statusBarTime: document.getElementById('statusBarTime'),
    views: {
      home: document.getElementById('view-home'),
      mine: document.getElementById('view-mine'),
      prep: document.getElementById('view-prep'),
      call: document.getElementById('view-call'),
      generating: document.getElementById('view-generating'),
      report: document.getElementById('view-report'),
      tips: document.getElementById('view-tips'),
      jobSelector: document.getElementById('view-job-selector'),
      resumeMgr: document.getElementById('view-resume-mgr'),
      pointsMall: document.getElementById('view-points-mall'),
      settings: document.getElementById('view-settings'),
      resumeOpt: document.getElementById('view-resume-opt')
    },
    navItems: document.querySelectorAll('.nav-item'),
    bottomNav: document.getElementById('appBottomNav'),
    
    // Home View
    startMockBtn: document.getElementById('startMockBtn'),
    startResumeOptBtn: document.getElementById('startResumeOptBtn'),
    historyRecordCard: document.getElementById('historyRecordCard'),
    viewAllRecordsBtn: document.getElementById('viewAllRecordsBtn'),
    
    // Prep View
    prepBackBtn: document.getElementById('prepBackBtn'),
    experienceGroup: document.getElementById('experienceSelectGroup'),
    styleGroup: document.getElementById('styleSelectGroup'),
    jobTrigger: document.getElementById('jobSelectTrigger'),
    selectedJobText: document.getElementById('selectedJobText'),
    resumeOptionGroup: document.getElementById('resumeOptionGroup'),
    resumeUploadWidget: document.getElementById('resumeUploadWidget'),
    uploadPlaceholder: document.getElementById('uploadPlaceholderContent'),
    uploadProgress: document.getElementById('uploadProgressDetail'),
    uploadFileName: document.getElementById('uploadingFileName'),
    uploadPct: document.getElementById('uploadingPct'),
    uploadFill: document.getElementById('uploadingProgressFill'),
    uploadStatus: document.getElementById('uploadStatusText'),
    enterInterviewBtn: document.getElementById('enterInterviewBtn'),
    
    // Tips View
    tipsBackBtn: document.getElementById('tipsBackBtn'),
    tipsProgressPctText: document.getElementById('tipsProgressPctText'),
    tipsProgressBarFill: document.getElementById('tipsProgressBarFill'),

    // Job Selector View
    jobSelectorBackBtn: document.getElementById('jobSelectorBackBtn'),
    jobSearchInput: document.getElementById('jobSearchInput'),
    jobCategoriesSidebar: document.getElementById('jobCategoriesSidebar'),
    jobPositionsPanel: document.getElementById('jobPositionsPanel'),
    jobSelectorManualBtn: document.getElementById('jobSelectorManualBtn'),

    // Personal Center (Mine)
    mineRechargeBtnAction: document.getElementById('mineRechargeBtnAction'),
    statRemainingPoints: document.getElementById('statRemainingPoints'),
    statMockCount: document.getElementById('statMockCount'),
    statResumeOptCount: document.getElementById('statResumeOptCount'),
    menuResumeMgrBtn: document.getElementById('menuResumeMgrBtn'),
    menuMyReportsBtn: document.getElementById('menuMyReportsBtn'),
    menuPointsMallBtn: document.getElementById('menuPointsMallBtn'),
    menuContactServiceBtn: document.getElementById('menuContactServiceBtn'),
    menuSettingsBtn: document.getElementById('menuSettingsBtn'),

    // Resume Manager Page
    resumeMgrBackBtn: document.getElementById('resumeMgrBackBtn'),
    resumeListContainer: document.getElementById('resumeListContainer'),
    defaultResumeCardItem: document.getElementById('defaultResumeCardItem'),
    deleteResumeBtn: document.getElementById('deleteResumeBtn'),
    mgrResumeFileName: document.getElementById('mgrResumeFileName'),
    uploadNewResumeMgrBtn: document.getElementById('uploadNewResumeMgrBtn'),

    // Points Mall Page
    pointsMallBackBtn: document.getElementById('pointsMallBackBtn'),
    mallPointsDisplay: document.getElementById('mallPointsDisplay'),
    buyPointsActionBtn: document.getElementById('buyPointsActionBtn'),

    // Settings Center Page
    settingsBackBtn: document.getElementById('settingsBackBtn'),
    settingsMicCheckRow: document.getElementById('settingsMicCheckRow'),
    toggleAutoRecord: document.getElementById('toggleAutoRecord'),
    settingsClearCacheRow: document.getElementById('settingsClearCacheRow'),
    cacheDisplayVal: document.getElementById('cacheDisplayVal'),

    // AI Resume Optimizer
    resumeOptBackBtn: document.getElementById('resumeOptBackBtn'),
    optResumeUploadArea: document.getElementById('optResumeUploadArea'),
    optUploadPlaceholder: document.getElementById('optUploadPlaceholder'),
    optUploadProgress: document.getElementById('optUploadProgress'),
    optUploadFileName: document.getElementById('optUploadFileName'),
    optUploadPct: document.getElementById('optUploadPct'),
    optUploadProgressFill: document.getElementById('optUploadProgressFill'),
    optUploadStatus: document.getElementById('optUploadStatus'),
    optSplitDiffViewer: document.getElementById('optSplitDiffViewer'),
    saveOptimizedResumeBtn: document.getElementById('saveOptimizedResumeBtn'),

    // Call View
    callHangupBackBtn: document.getElementById('callHangupBackBtn'),
    callHangupActionBtn: document.getElementById('callHangupActionBtn'),
    videoStatusBadge: document.getElementById('videoStatusBadge'),
    videoStatusText: document.getElementById('videoStatusText'),
    videoTimer: document.getElementById('videoDurationTimer'),
    dialogueBox: document.getElementById('interviewDialogueBox'),
    voiceWaves: document.getElementById('voiceWavesElement'),
    submitAnswerBtn: document.getElementById('submitUserAnswerBtn'),
    
    // Generating View
    reportProgressFill: document.getElementById('reportProgressFill'),
    reportProgressPct: document.getElementById('reportProgressPct'),
    reportStepText: document.getElementById('reportStepText'),
    
    // Report View
    reportBackBtn: document.getElementById('reportBackBtn'),
    reportTabItems: document.querySelectorAll('.report-tab-item'),
    panels: {
      analysis: document.getElementById('panel-analysis'),
      questions: document.getElementById('panel-questions')
    },
    reportFinishBackHomeBtn: document.getElementById('reportFinishBackHomeBtn')
  };

  // Clock
  const updateClockSim = () => {
    const now = new Date();
    const hrs = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    if (DOM.statusBarTime) DOM.statusBarTime.textContent = `${hrs}:${mins}`;
  };
  setInterval(updateClockSim, 30000);
  updateClockSim();

  // Helper to synchronize stats displays
  const syncProfileStatsUI = () => {
    if (DOM.statRemainingPoints) DOM.statRemainingPoints.textContent = state.pointsBalance;
    if (DOM.statMockCount) DOM.statMockCount.textContent = state.mockInterviewCount;
    if (DOM.statResumeOptCount) DOM.statResumeOptCount.textContent = state.resumeOptimizationCount;
    if (DOM.mallPointsDisplay) DOM.mallPointsDisplay.textContent = `${state.pointsBalance} 积分`;
  };
  syncProfileStatsUI();

  // Unified H5 state router
  const navigateTo = (viewName) => {
    state.currentView = viewName;
    
    Object.keys(DOM.views).forEach(key => {
      if (DOM.views[key]) {
        if (key === viewName) {
          DOM.views[key].classList.add('active');
        } else {
          DOM.views[key].classList.remove('active');
        }
      }
    });

    if (viewName === 'home' || viewName === 'mine') {
      DOM.bottomNav.style.display = 'flex';
      DOM.navItems.forEach(item => {
        if (item.getAttribute('data-view') === viewName) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    } else {
      DOM.bottomNav.style.display = 'none';
    }
  };

  DOM.navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(item.getAttribute('data-view'));
    });
  });

  // Home Actions
  DOM.startMockBtn.addEventListener('click', () => navigateTo('prep'));
  DOM.startResumeOptBtn.addEventListener('click', () => {
    // Reset Resume Optimizer states
    DOM.optUploadPlaceholder.style.display = 'block';
    DOM.optUploadProgress.style.display = 'none';
    DOM.optSplitDiffViewer.style.display = 'none';
    navigateTo('resumeOpt');
  });

  DOM.historyRecordCard.addEventListener('click', () => {
    loadQuestionsForSelectedJob();
    navigateTo('report');
  });
  DOM.viewAllRecordsBtn.addEventListener('click', (e) => { e.preventDefault(); navigateTo('mine'); });

  // Prep view actions
  DOM.prepBackBtn.addEventListener('click', () => navigateTo('home'));

  if (DOM.experienceGroup) {
    const pills = DOM.experienceGroup.querySelectorAll('.option-pill-btn');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        state.experience = pill.getAttribute('data-val');
      });
    });
  }

  if (DOM.styleGroup) {
    const cards = DOM.styleGroup.querySelectorAll('.style-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        cards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        state.style = card.getAttribute('data-val');
      });
    });
  }

  DOM.jobTrigger.addEventListener('click', () => {
    navigateTo('jobSelector');
    renderJobSelectorCategories('hot');
  });

  // Resume options
  if (DOM.resumeOptionGroup) {
    const optionCards = DOM.resumeOptionGroup.querySelectorAll('.resume-option-card');
    optionCards.forEach(card => {
      card.addEventListener('click', () => {
        optionCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        const mode = card.getAttribute('data-val');
        state.resumeMode = mode;

        if (mode === 'use-resume') {
          DOM.resumeUploadWidget.style.display = 'block';
          if (!state.resumeUploaded) {
            triggerFakeResumeUpload();
          }
        } else {
          DOM.resumeUploadWidget.style.display = 'none';
        }
      });
    });
  }

  DOM.resumeUploadWidget.addEventListener('click', () => {
    triggerFakeResumeUpload();
  });

  const triggerFakeResumeUpload = () => {
    state.resumeUploaded = false;
    DOM.uploadPlaceholder.style.display = 'none';
    DOM.uploadProgress.style.display = 'flex';
    DOM.uploadFileName.textContent = `张三_${state.job}开发简历.pdf`;
    DOM.uploadStatus.textContent = "简历正在极速上传中...";
    DOM.uploadFill.style.width = '0%';
    DOM.uploadPct.textContent = '0%';

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        DOM.uploadFill.style.width = '100%';
        DOM.uploadPct.textContent = '100%';
        DOM.uploadStatus.innerHTML = "✨ <span style='color:#10b981;font-weight:700;'>简历解析成功！</span> 已根据项目提取并定制专属问题";
        state.resumeUploaded = true;
      } else {
        DOM.uploadFill.style.width = `${progress}%`;
        DOM.uploadPct.textContent = `${progress}%`;
        if (progress > 50) {
          DOM.uploadStatus.textContent = "💻 AI 正在深入提取项目技术核心难点...";
        }
      }
    }, 120);
  };

  // Job selection logic
  const renderJobSelectorCategories = (categoryKey) => {
    const tabs = DOM.jobCategoriesSidebar.querySelectorAll('.category-tab');
    tabs.forEach(t => {
      if (t.getAttribute('data-cat') === categoryKey) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });

    const categoryData = jobsDatabase[categoryKey];
    if (!categoryData) return;

    DOM.jobPositionsPanel.innerHTML = `
      <div class="positions-group">
        <h5 class="positions-group-title">${categoryData.name}</h5>
        <div class="positions-pills-grid" id="positionsGridContent"></div>
      </div>
    `;

    const grid = document.getElementById('positionsGridContent');
    categoryData.positions.forEach(pos => {
      const pill = document.createElement('div');
      pill.className = `position-pill ${state.job === pos ? 'active' : ''}`;
      pill.textContent = pos;
      pill.addEventListener('click', () => {
        selectJob(pos);
      });
      grid.appendChild(pill);
    });
  };

  const catTabs = DOM.jobCategoriesSidebar.querySelectorAll('.category-tab');
  catTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      renderJobSelectorCategories(tab.getAttribute('data-cat'));
    });
  });

  const selectJob = (jobName) => {
    state.job = jobName;
    DOM.selectedJobText.textContent = jobName;
    navigateTo('prep');
  };

  DOM.jobSearchInput.addEventListener('input', () => {
    const query = DOM.jobSearchInput.value.trim().toLowerCase();
    if (!query) {
      const activeTab = DOM.jobCategoriesSidebar.querySelector('.category-tab.active');
      if (activeTab) renderJobSelectorCategories(activeTab.getAttribute('data-cat'));
      return;
    }

    let matchedPositions = [];
    Object.keys(jobsDatabase).forEach(key => {
      jobsDatabase[key].positions.forEach(pos => {
        if (pos.toLowerCase().includes(query) && !matchedPositions.includes(pos)) {
          matchedPositions.push(pos);
        }
      });
    });

    DOM.jobPositionsPanel.innerHTML = `
      <div class="positions-group">
        <h5 class="positions-group-title">🔍 搜索结果 (${matchedPositions.length})</h5>
        <div class="positions-pills-grid" id="searchGridContent"></div>
      </div>
    `;

    const grid = document.getElementById('searchGridContent');
    if (matchedPositions.length === 0) {
      grid.innerHTML = `<span style="font-size:12px;color:#94a3b8;padding:12px 0;">未搜到相关岗位，您可以点击下方“自行填写”进行补充。</span>`;
      return;
    }

    matchedPositions.forEach(pos => {
      const pill = document.createElement('div');
      pill.className = `position-pill ${state.job === pos ? 'active' : ''}`;
      pill.textContent = pos;
      pill.addEventListener('click', () => {
        selectJob(pos);
      });
      grid.appendChild(pill);
    });
  });

  DOM.jobSelectorManualBtn.addEventListener('click', () => {
    const userJobInput = prompt("请输入您要面试的岗位名称：", state.job);
    if (userJobInput && userJobInput.trim()) {
      selectJob(userJobInput.trim());
    }
  });

  DOM.jobSelectorBackBtn.addEventListener('click', () => navigateTo('prep'));

  // Tips view logic & CTA
  DOM.tipsBackBtn.addEventListener('click', () => navigateTo('prep'));

  DOM.enterInterviewBtn.addEventListener('click', () => {
    if (state.resumeMode === 'use-resume' && !state.resumeUploaded) {
      alert("您的个人简历正在解析中，请稍候再进入面试。");
      return;
    }

    if (state.resumeMode === 'no-resume') {
      navigateTo('tips');
      
      let tipsProgress = 0;
      DOM.tipsProgressBarFill.style.width = '0%';
      DOM.tipsProgressPctText.textContent = '0%';

      const tipsInterval = setInterval(() => {
        tipsProgress += Math.floor(Math.random() * 8) + 4;
        if (tipsProgress >= 100) {
          tipsProgress = 100;
          clearInterval(tipsInterval);
          DOM.tipsProgressBarFill.style.width = '100%';
          DOM.tipsProgressPctText.textContent = '100%';

          setTimeout(() => {
            startMockInterviewSession();
          }, 600);
        } else {
          DOM.tipsProgressBarFill.style.width = `${tipsProgress}%`;
          DOM.tipsProgressPctText.textContent = `${tipsProgress}%`;
        }
      }, 100);
    } else {
      startMockInterviewSession();
    }
  });


  // 5. Personal Profile Sub-Pages Controllers

  // REDIRECT BUTTONS FROM PROFILE PAGE
  DOM.mineRechargeBtnAction.addEventListener('click', () => navigateTo('pointsMall'));
  DOM.menuResumeMgrBtn.addEventListener('click', () => navigateTo('resumeMgr'));
  DOM.menuPointsMallBtn.addEventListener('click', () => navigateTo('pointsMall'));
  DOM.menuSettingsBtn.addEventListener('click', () => navigateTo('settings'));
  
  DOM.menuContactServiceBtn.addEventListener('click', () => {
    alert("📞 客服通道：已成功建立人机专线支持！如需帮助请随时致电 400-888-9999 或在官方微信群中 @小助手 反馈。");
  });

  // A. RESUME MANAGER BINDINGS
  DOM.resumeMgrBackBtn.addEventListener('click', () => navigateTo('mine'));
  
  DOM.deleteResumeBtn.addEventListener('click', () => {
    if (confirm("🚨 确认要删除这份简历吗？这会导致对应的简历面试题目集失效。")) {
      DOM.defaultResumeCardItem.style.transition = 'opacity 0.3s';
      DOM.defaultResumeCardItem.style.opacity = '0';
      setTimeout(() => {
        DOM.resumeListContainer.innerHTML = `<span style="font-size:12px; color:#94a3b8; padding:24px 0; text-align:center; display:block;">📁 暂无已上传简历，点击下方按钮上传您的首份高清晰度简历。</span>`;
      }, 300);
    }
  });

  DOM.uploadNewResumeMgrBtn.addEventListener('click', () => {
    const fn = prompt("请设置上传的简历文件名称：", `${state.job}_个人求职简历.pdf`);
    if (fn && fn.trim()) {
      DOM.resumeListContainer.innerHTML = `
        <div class="resume-card-item">
          <div class="file-details">
            <div class="file-icon-box">📄</div>
            <div class="name-size">
              <span class="file-name">${fn.trim()}</span>
              <span class="file-size">1.5 MB · 刚刚上传</span>
            </div>
          </div>
          <span style="font-size:11px; color:#10b981; font-weight:700;">✔️ 已上传</span>
        </div>
      `;
      alert("✨ 简历上传成功！您可在进入面试准备时选择此简历进行分析提问。");
    }
  });

  // B. POINTS MALL TRANSACTIONS BINDINGS
  DOM.pointsMallBackBtn.addEventListener('click', () => navigateTo('mine'));

  // Wire package toggles
  let selectedAmt = 30;
  let selectedPrice = 29.9;
  const packageCards = DOM.views.pointsMall.querySelectorAll('.package-card');
  packageCards.forEach(card => {
    card.addEventListener('click', () => {
      packageCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      selectedAmt = parseInt(card.getAttribute('data-amt'));
      selectedPrice = parseFloat(card.getAttribute('data-price'));
    });
  });

  DOM.buyPointsActionBtn.addEventListener('click', () => {
    if (confirm(`💳 微信支付确认：您确认支付 ￥${selectedPrice} 购买 ${selectedAmt} 积分套餐吗？`)) {
      state.pointsBalance += selectedAmt;
      syncProfileStatsUI();
      alert(`🎉 充值成功！已成功微信支付 ￥${selectedPrice}，您的积分余额增加 ${selectedAmt} 积分。`);
      navigateTo('mine');
    }
  });

  // C. SETTINGS CENTER BINDINGS
  DOM.settingsBackBtn.addEventListener('click', () => navigateTo('mine'));

  DOM.settingsMicCheckRow.addEventListener('click', () => {
    alert("🎤 正在进行麦克风收音灵敏度自检... \n[测试结果]：硬件设备工作良好，音质采样频率 48kHz，录音灵敏度正常！");
  });

  DOM.toggleAutoRecord.addEventListener('click', () => {
    DOM.toggleAutoRecord.classList.toggle('checked');
  });

  DOM.settingsClearCacheRow.addEventListener('click', () => {
    if (confirm("🧹 清理缓存将释放图片、转写实录和离线音频文件所占用的空间，确认清理吗？")) {
      DOM.cacheDisplayVal.textContent = "0.0 MB";
      alert("✨ 缓存已全部安全擦除，应用启动速度已被深度优化！");
    }
  });

  // D. DYNAMIC STAR RESUME OPTIMIZER BINDINGS
  DOM.resumeOptBackBtn.addEventListener('click', () => navigateTo('home'));

  DOM.optResumeUploadArea.addEventListener('click', () => {
    // Run Simulated STAR Optimization
    DOM.optUploadPlaceholder.style.display = 'none';
    DOM.optUploadProgress.style.display = 'flex';
    DOM.optUploadFileName.textContent = `我的个人简历_应聘_${state.job}.pdf`;
    DOM.optUploadStatus.textContent = "正在上传分析简历经历结构...";
    DOM.optUploadProgressFill.style.width = '0%';
    DOM.optUploadPct.textContent = '0%';

    let progress = 0;
    const steps = [
      { prg: 30, txt: "🔍 正在进行简历排版及项目痛点深度体检..." },
      { prg: 70, txt: "⚙️ 匹配行业岗位模型，启动 AI 黄金 STAR 法则重构核心句式..." },
      { prg: 95, txt: "📝 正在智能校验语句数据量化度与项目贡献度表达..." },
      { prg: 100, txt: "✨ 优化成功！已使用 STAR 法则完成语句黄金润色！" }
    ];

    const progressInterval = setInterval(() => {
      progress += Math.floor(Math.random() * 8) + 4;
      if (progress >= 100) {
        progress = 100;
        clearInterval(progressInterval);
        DOM.optUploadProgressFill.style.width = '100%';
        DOM.optUploadPct.textContent = '100%';
        DOM.optUploadStatus.textContent = steps[steps.length - 1].txt;

        // Smoothly reveal split comparator viewer
        setTimeout(() => {
          DOM.optSplitDiffViewer.style.display = 'block';
          // Auto scroll to bottom
          DOM.views.resumeOpt.scrollTop = DOM.views.resumeOpt.scrollHeight;
        }, 600);
      } else {
        DOM.optUploadProgressFill.style.width = `${progress}%`;
        DOM.optUploadPct.textContent = `${progress}%`;
        const step = steps.find(s => progress <= s.prg);
        if (step) DOM.optUploadStatus.textContent = step.txt;
      }
    }, 100);
  });

  DOM.saveOptimizedResumeBtn.addEventListener('click', () => {
    // Increment Resume Optimization statistics counter
    state.resumeOptimizationCount++;
    syncProfileStatsUI();

    // Re-fill resume file name in resume manager
    if (DOM.mgrResumeFileName) {
      DOM.mgrResumeFileName.textContent = `张三_${state.job}_STAR黄金优化版.pdf`;
    }

    alert(`💾 保存成功！优化后的 STAR 黄金简历已导出保存至“我的简历管理”中！已累积为您的求职经历提升优化。`);
    navigateTo('home');
  });


  // Dynamic Question Pool loader by selected job
  const loadQuestionsForSelectedJob = () => {
    let chosenPool = questionsPool[state.job];
    if (!chosenPool) {
      chosenPool = questionsPool["通用"];
    }

    state.questionsList = JSON.parse(JSON.stringify(chosenPool));

    const container = document.getElementById('panel-questions');
    if (!container) return;

    let html = `<div class="question-analysis-list">`;
    state.questionsList.forEach((q, idx) => {
      html += `
        <div class="question-card">
          <div class="question-badge">第 ${idx + 1} 题</div>
          <p class="question-text">${q.question}</p>
          <div class="section-divider"></div>
          
          <div class="question-sub-section">
            <div class="sub-title">💡 问题解析</div>
            <p class="sub-content">${q.parsedBreakdown}</p>
          </div>
          
          <div class="question-sub-section">
            <div class="sub-title">🎯 回答策略</div>
            <p class="sub-content">${q.parsedStrategy}</p>
          </div>
          
          <div class="question-sub-section">
            <div class="sub-title">🌟 优秀回答示例</div>
            <p class="sub-content example-content">${q.parsedBestExample}</p>
          </div>
        </div>
      `;
    });
    html += `</div>`;

    html += `
      <div class="report-bottom-bar">
        <button class="btn-primary" id="reportFinishBackHomeBtn2">回到首页</button>
        <p class="bottom-caption">以上面试评价与解析由 AI 面试报告自动生成</p>
      </div>
    `;

    container.innerHTML = html;

    const btn = document.getElementById('reportFinishBackHomeBtn2');
    if (btn) {
      btn.addEventListener('click', () => navigateTo('home'));
    }
  };


  // 6. Mock Interview CALL engine
  const startMockInterviewSession = () => {
    loadQuestionsForSelectedJob();

    navigateTo('call');
    
    state.interviewTime = 0;
    state.currentQuestionIndex = 0;
    state.isInterviewerSpeaking = false;
    state.isUserAnswering = false;
    DOM.videoTimer.textContent = "00:00";
    
    DOM.dialogueBox.innerHTML = `
      <div class="chat-bubble ai" id="systemInitGreeting">
        正在为您匹配${state.job}高频考核题库，接通视频通话中，请做准备...
      </div>
    `;
    DOM.submitAnswerBtn.style.display = 'none';
    DOM.voiceWaves.classList.remove('active');

    const videoFeed = document.getElementById('interviewerVideoFeed');
    videoFeed.style.filter = "blur(10px)";
    DOM.videoStatusBadge.classList.add('connecting');
    DOM.videoStatusText.textContent = "接通中...";

    setTimeout(() => {
      videoFeed.style.filter = "none";
      DOM.videoStatusBadge.classList.remove('connecting');
      DOM.videoStatusText.textContent = "ONLINE";
      
      state.interviewTimerInterval = setInterval(() => {
        state.interviewTime++;
        const mins = String(Math.floor(state.interviewTime / 60)).padStart(2, '0');
        const secs = String(state.interviewTime % 60).padStart(2, '0');
        DOM.videoTimer.textContent = `${mins}:${secs}`;
      }, 1000);

      askQuestionFlow(0);
    }, 1800);
  };

  const askQuestionFlow = (questionIndex) => {
    state.currentQuestionIndex = questionIndex;
    state.isInterviewerSpeaking = true;
    state.isUserAnswering = false;

    DOM.voiceWaves.classList.remove('active');
    DOM.submitAnswerBtn.style.display = 'none';
    DOM.videoStatusText.textContent = "面试官说话中";

    const questionObj = state.questionsList[questionIndex];
    
    const aiBubble = document.createElement('div');
    aiBubble.className = "chat-bubble ai type-cursor";
    DOM.dialogueBox.appendChild(aiBubble);
    scrollDialogueBox();

    let charIndex = 0;
    const textToType = questionObj.question;
    
    const typeInterval = setInterval(() => {
      if (charIndex < textToType.length) {
        aiBubble.textContent += textToType.charAt(charIndex);
        charIndex++;
        scrollDialogueBox();
      } else {
        clearInterval(typeInterval);
        aiBubble.classList.remove('type-cursor');
        
        setTimeout(() => {
          startUserAnsweringFlow(questionIndex);
        }, 1200);
      }
    }, 45);
  };

  const startUserAnsweringFlow = (questionIndex) => {
    state.isInterviewerSpeaking = false;
    state.isUserAnswering = true;

    DOM.videoStatusText.textContent = "聆听中/正在录音";
    DOM.voiceWaves.classList.add('active');
    DOM.submitAnswerBtn.style.display = 'block';

    const questionObj = state.questionsList[questionIndex];

    const userBubble = document.createElement('div');
    userBubble.className = "chat-bubble user type-cursor";
    
    const statusLine = document.createElement('div');
    statusLine.className = "chat-bubble-status";
    statusLine.innerHTML = `<span class="status-dot"></span> 正在实时语音识别...`;
    
    userBubble.appendChild(statusLine);
    DOM.dialogueBox.appendChild(userBubble);
    scrollDialogueBox();

    let charIndex = 0;
    const textToType = questionObj.userAnswerText;
    
    const textSpan = document.createElement('span');
    userBubble.insertBefore(textSpan, statusLine);

    const typeInterval = setInterval(() => {
      if (!state.isUserAnswering) {
        clearInterval(typeInterval);
        return;
      }

      if (charIndex < textToType.length) {
        textSpan.textContent += textToType.charAt(charIndex);
        charIndex++;
        scrollDialogueBox();
      } else {
        clearInterval(typeInterval);
        userBubble.classList.remove('type-cursor');
        statusLine.innerHTML = `✔️ 语音已实时识别并加密转换`;
      }
    }, 60);

    userBubble.dataset.intervalId = typeInterval;
  };

  DOM.submitAnswerBtn.addEventListener('click', () => {
    if (!state.isUserAnswering) return;

    state.isUserAnswering = false;
    const userBubbles = DOM.dialogueBox.querySelectorAll('.chat-bubble.user');
    const activeBubble = userBubbles[userBubbles.length - 1];
    
    if (activeBubble) {
      clearInterval(activeBubble.dataset.intervalId);
      activeBubble.classList.remove('type-cursor');
      const textSpan = activeBubble.querySelector('span') || activeBubble;
      textSpan.textContent = state.questionsList[state.currentQuestionIndex].userAnswerText;
      const statusLine = activeBubble.querySelector('.chat-bubble-status');
      if (statusLine) statusLine.innerHTML = `✔️ 语音已提交`;
    }

    DOM.submitAnswerBtn.style.display = 'none';
    DOM.voiceWaves.classList.remove('active');

    if (state.currentQuestionIndex < state.questionsList.length - 1) {
      DOM.videoStatusText.textContent = "面试官思考中";
      setTimeout(() => {
        askQuestionFlow(state.currentQuestionIndex + 1);
      }, 1500);
    } else {
      DOM.videoStatusText.textContent = "面试官总结中";
      
      const closingBubble = document.createElement('div');
      closingBubble.className = "chat-bubble ai type-cursor";
      DOM.dialogueBox.appendChild(closingBubble);
      scrollDialogueBox();

      let closingText = "非常感谢你今天的精彩作答！技术考核圆满结束。我将即刻打包您的语言模型，生成您个人的多维度评估分析报告与提升建议，请稍等。";
      let charIndex = 0;

      const typeInterval = setInterval(() => {
        if (charIndex < closingText.length) {
          closingBubble.textContent += closingText.charAt(charIndex);
          charIndex++;
          scrollDialogueBox();
        } else {
          clearInterval(typeInterval);
          closingBubble.classList.remove('type-cursor');

          setTimeout(() => {
            triggerReportGenerationFlow();
          }, 2000);
        }
      }, 40);
    }
  });

  const terminateCallSession = () => {
    clearInterval(state.interviewTimerInterval);
    DOM.voiceWaves.classList.remove('active');
    navigateTo('home');
  };

  DOM.callHangupBackBtn.addEventListener('click', terminateCallSession);
  DOM.callHangupActionBtn.addEventListener('click', terminateCallSession);

  const scrollDialogueBox = () => {
    DOM.dialogueBox.scrollTop = DOM.dialogueBox.scrollHeight;
  };

  // 7. Report Generation loading progress bar
  const triggerReportGenerationFlow = () => {
    clearInterval(state.interviewTimerInterval);

    navigateTo('generating');

    let progress = 0;
    DOM.reportProgressFill.style.width = '0%';
    DOM.reportProgressPct.textContent = '0%';
    DOM.reportStepText.innerHTML = "🔍 正在拉取本轮面试对话实录...";

    const steps = [
      { prg: 20, txt: "⚙️ AI 正在深度评估候选人专业知识广度与技术深度..." },
      { prg: 55, txt: "📊 正在多维度计算专业深度、应变能力与沟通逻辑得分..." },
      { prg: 80, txt: "📝 正在智能匹配优秀回答模板并定制针对性回答建议..." },
      { prg: 95, txt: "🧠 正在归档报告结果至您的个人求职历史库..." },
      { prg: 100, txt: "✅ 分析成功！面试评估报告已为您生成！" }
    ];

    const progressInterval = setInterval(() => {
      progress += Math.floor(Math.random() * 4) + 1;
      if (progress >= 100) {
        progress = 100;
        clearInterval(progressInterval);
        DOM.reportProgressFill.style.width = '100%';
        DOM.reportProgressPct.textContent = '100%';
        DOM.reportStepText.textContent = steps[steps.length - 1].txt;

        // Success: Increment simulated interview count!
        state.mockInterviewCount++;
        syncProfileStatsUI();

        setTimeout(() => {
          navigateTo('report');
        }, 800);
      } else {
        DOM.reportProgressFill.style.width = `${progress}%`;
        DOM.reportProgressPct.textContent = `${progress}%`;
        
        const matchingStep = steps.find(s => progress <= s.prg);
        if (matchingStep) {
          DOM.reportStepText.textContent = matchingStep.txt;
        }
      }
    }, 120);
  };

  // 8. Report tabs switching
  DOM.reportTabItems.forEach(tab => {
    tab.addEventListener('click', () => {
      DOM.reportTabItems.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetTab = tab.getAttribute('data-tab');
      if (targetTab === 'analysis') {
        DOM.panels.analysis.classList.add('active');
        DOM.panels.questions.classList.remove('active');
      } else {
        DOM.panels.analysis.classList.remove('active');
        DOM.panels.questions.classList.add('active');
      }
    });
  });

  DOM.reportBackBtn.addEventListener('click', () => navigateTo('home'));
  DOM.reportFinishBackHomeBtn.addEventListener('click', () => navigateTo('home'));
  DOM.menuMyReportsBtn.addEventListener('click', () => {
    loadQuestionsForSelectedJob();
    navigateTo('report');
  });
});
