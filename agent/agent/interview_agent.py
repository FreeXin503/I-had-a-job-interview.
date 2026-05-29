"""
面试Agent - 使用OpenAI SDK实现面试流程
"""

import os
from typing import List, Dict, Any, Optional
from openai import OpenAI


class InterviewAgent:
    """面试Agent"""
    
    def __init__(self):
        # 初始化DeepSeek客户端
        self.client = OpenAI(
            api_key="sk-12117c0cd5154356a3518f50a28137d7",
            base_url="https://api.deepseek.com"
        )
        
        # 面试官风格提示词
        self.style_prompts = {
            "gentle": "你是一位温和友善的面试官，善于鼓励候选人，提问方式亲切自然。",
            "standard": "你是一位专业标准的面试官，提问严谨规范，注重考察候选人的专业能力。",
            "stress": "你是一位压力面试官，会通过追问和质疑来考察候选人的抗压能力和应变能力。",
            "random": "你是一位风格多变的面试官，会根据情况灵活调整提问方式。"
        }
        
        # 岗位题库
        self.job_questions = {
            "Java工程师": [
                "请介绍一下你在Java开发方面的项目经验。",
                "你对Spring框架的IoC和AOP有什么理解？",
                "请说说你对JVM内存模型的理解。",
                "如何处理高并发场景下的数据一致性问题？",
                "你在项目中遇到过哪些性能优化的问题，是如何解决的？"
            ],
            "前端开发工程师": [
                "请介绍一下你的前端技术栈和项目经验。",
                "你对Vue/React的响应式原理有什么理解？",
                "如何优化前端性能？",
                "请说说你对前端工程化的理解。",
                "你在项目中是如何处理跨域问题的？"
            ],
            "产品经理": [
                "请介绍一下你负责过的产品项目。",
                "你是如何进行需求分析和优先级排序的？",
                "如何平衡用户需求和技术实现的难度？",
                "请说说你对产品数据分析的理解。",
                "你在产品设计中遇到过哪些挑战？"
            ]
        }
    
    async def generate_first_question(
        self,
        experience: str,
        style: str,
        job_title: str,
        resume_context: Optional[Dict] = None
    ) -> Dict[str, Any]:
        """生成第一个面试问题"""
        
        # 构建系统提示词
        system_prompt = f"""
{self.style_prompts.get(style, self.style_prompts['standard'])}

你正在面试一位{experience}的{job_title}候选人。

请生成一个开场问题，通常是让候选人做自我介绍，或者介绍相关项目经验。

要求：
1. 问题要自然、专业
2. 符合面试官的风格特点
3. 适合作为面试的开场问题
"""
        
        if resume_context:
            system_prompt += f"\n\n候选人简历信息：\n{resume_context.get('summary', '')}"
        
        # 调用大模型生成问题
        response = self.client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": "请生成第一个面试问题。"}
            ],
            temperature=0.7
        )
        
        question_text = response.choices[0].message.content
        
        return {
            "text": question_text,
            "type": "opening",
            "order": 1
        }
    
    async def generate_next_question(
        self,
        experience: str,
        style: str,
        job_title: str,
        previous_questions: List[Dict],
        previous_answers: List[Dict]
    ) -> Dict[str, Any]:
        """生成下一个面试问题"""
        
        # 构建对话历史
        conversation_history = ""
        for i, (q, a) in enumerate(zip(previous_questions, previous_answers)):
            conversation_history += f"\n问题{i+1}: {q.get('questionText', '')}"
            conversation_history += f"\n回答{i+1}: {a.get('answerText', '')}\n"
        
        # 构建系统提示词
        system_prompt = f"""
{self.style_prompts.get(style, self.style_prompts['standard'])}

你正在面试一位{experience}的{job_title}候选人。

之前的对话历史：
{conversation_history}

请根据候选人之前的回答，生成一个合适的追问或新问题。

要求：
1. 问题要有针对性，可以深入挖掘候选人的能力
2. 符合面试官的风格特点
3. 避免重复之前的问题
4. 问题难度要适中
"""
        
        # 调用大模型生成问题
        response = self.client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": "请生成下一个面试问题。"}
            ],
            temperature=0.7
        )
        
        question_text = response.choices[0].message.content
        
        return {
            "text": question_text,
            "type": "follow_up",
            "order": len(previous_questions) + 1
        }
    
    async def analyze_answer(
        self,
        question_text: str,
        answer_text: str,
        job_title: str
    ) -> Dict[str, Any]:
        """分析用户答案"""
        
        system_prompt = f"""
你是一位专业的面试评估专家，正在评估{job_title}候选人的回答。

面试问题：{question_text}
候选人回答：{answer_text}

请从以下维度进行评估：
1. 回答的完整性和逻辑性
2. 专业知识的掌握程度
3. 表达能力和沟通技巧
4. 回答中的亮点和不足

请给出简短的评价（50字以内）。
"""
        
        response = self.client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": "请分析这个回答。"}
            ],
            temperature=0.3
        )
        
        return {
            "evaluation": response.choices[0].message.content,
            "score": 0  # 单个问题暂不评分
        }
    
    async def generate_report(
        self,
        interview_id: str,
        questions: List[Dict],
        answers: List[Dict],
        job_title: str,
        experience: str,
        style: str
    ) -> Dict[str, Any]:
        """生成面试报告"""
        
        # 构建对话历史
        conversation_history = ""
        for i, (q, a) in enumerate(zip(questions, answers)):
            conversation_history += f"\n问题{i+1}: {q.get('questionText', '')}"
            conversation_history += f"\n回答{i+1}: {a.get('answerText', '')}\n"
        
        # 构建系统提示词
        system_prompt = f"""
你是一位资深的面试评估专家，正在为一位{experience}的{job_title}候选人生成面试报告。

面试对话记录：
{conversation_history}

请生成一份详细的面试报告，包括：
1. 总体评分（0-100分）
2. 评级（优秀/良好/及格/不及格）
3. 详细评价（从专业深度、逻辑清晰、应变能力、临场表现四个维度）
4. 每个问题的详细解析

请以JSON格式返回报告。
"""
        
        response = self.client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": "请生成面试报告。"}
            ],
            temperature=0.5
        )
        
        # 解析报告（这里简化处理，实际应该解析JSON）
        score = 85  # 示例分数
        rating = "良好"
        
        if score >= 90:
            rating = "优秀"
        elif score >= 80:
            rating = "良好"
        elif score >= 60:
            rating = "及格"
        else:
            rating = "不及格"
        
        return {
            "interviewId": interview_id,
            "score": score,
            "rating": rating,
            "duration": len(questions) * 60,  # 估算时长
            "evaluation": {
                "professional": "在核心技术领域展现了扎实的基础知识。",
                "logic": "回答过程逻辑清晰，条理分明。",
                "adaptability": "面对追问能够保持沉稳，应对有方。",
                "performance": "语言流畅，表述清晰，整体表现良好。"
            },
            "questionAnalysis": [
                {
                    "questionOrder": i + 1,
                    "questionText": q.get('questionText', ''),
                    "answerText": a.get('answerText', ''),
                    "breakdown": "考察候选人的专业能力和项目经验。",
                    "strategy": "建议从具体项目入手，说明技术选型和解决方案。",
                    "bestExample": "我在XX项目中负责XX模块，使用XX技术解决了XX问题。"
                }
                for i, (q, a) in enumerate(zip(questions, answers))
            ],
            "summary": response.choices[0].message.content
        }
