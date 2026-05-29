"""
简历解析器
支持PDF和Word格式的简历解析
"""

import os
from typing import Dict, Any, Optional
import PyPDF2
import docx
from openai import OpenAI


class ResumeParser:
    """简历解析器"""
    
    def __init__(self):
        self.client = OpenAI(
            api_key="sk-12117c0cd5154356a3518f50a28137d7",
            base_url="https://api.deepseek.com"
        )
    
    async def parse_resume(self, file_id: str) -> Dict[str, Any]:
        """解析简历文件"""
        
        # TODO: 从文件存储中获取文件路径
        file_path = f"/tmp/resumes/{file_id}"
        
        # 提取文本
        text = self._extract_text(file_path)
        
        # 使用LLM解析简历内容
        parsed_data = await self._parse_with_llm(text)
        
        return parsed_data
    
    def _extract_text(self, file_path: str) -> str:
        """从文件中提取文本"""
        
        ext = os.path.splitext(file_path)[1].lower()
        
        if ext == '.pdf':
            return self._extract_from_pdf(file_path)
        elif ext in ['.doc', '.docx']:
            return self._extract_from_docx(file_path)
        else:
            raise ValueError(f"不支持的文件格式: {ext}")
    
    def _extract_from_pdf(self, file_path: str) -> str:
        """从PDF中提取文本"""
        
        text = ""
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            for page in pdf_reader.pages:
                text += page.extract_text()
        
        return text
    
    def _extract_from_docx(self, file_path: str) -> str:
        """从Word文档中提取文本"""
        
        doc = docx.Document(file_path)
        text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
        
        return text
    
    async def _parse_with_llm(self, text: str) -> Dict[str, Any]:
        """使用LLM解析简历内容"""
        
        system_prompt = """
你是一位专业的简历分析专家。请从以下简历文本中提取关键信息：

1. 基本信息：姓名、联系方式、教育背景
2. 工作经验：公司、职位、时间、主要职责
3. 项目经验：项目名称、技术栈、个人角色、主要成果
4. 技能特长：编程语言、框架、工具等
5. 个人优势：总结候选人的核心竞争力

请以结构化的方式返回这些信息。
"""
        
        response = self.client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"简历内容：\n{text}"}
            ],
            temperature=0.3
        )
        
        # 这里简化处理，实际应该解析结构化数据
        return {
            "summary": response.choices[0].message.content,
            "rawText": text
        }
