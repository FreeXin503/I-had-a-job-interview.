"""
面了个试 - AI Agent 主程序
使用 LangGraph 实现面试流程编排
"""

import os
import wave
import json
import tempfile
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn
from vosk import Model, KaldiRecognizer

from agent.interview_agent import InterviewAgent
from agent.resume_parser import ResumeParser
from agent.tts_service import TTSService

# 初始化本地 Vosk 离线语音识别模型
print("正在载入本地 Vosk 中文语音识别模型...")
try:
    vosk_model = Model(lang="cn")
    print("Vosk 语音识别模型载入成功！")
except Exception as e:
    print("Vosk 模型载入失败，将使用降级空模型:", e)
    vosk_model = None

app = FastAPI(title="面了个试 AI Agent", version="1.0.0")

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 初始化服务
interview_agent = InterviewAgent()
resume_parser = ResumeParser()
tts_service = TTSService()


class GenerateQuestionRequest(BaseModel):
    experience: str
    style: str
    jobTitle: str
    resumeFileId: Optional[str] = None
    previousQuestions: Optional[List[Dict]] = None
    previousAnswers: Optional[List[Dict]] = None


class AnalyzeAnswerRequest(BaseModel):
    questionId: str
    questionText: str
    answerText: str
    jobTitle: str


class GenerateReportRequest(BaseModel):
    interviewId: str
    questions: List[Dict]
    answers: List[Dict]
    jobTitle: str
    experience: str
    style: str


@app.get("/")
async def root():
    return {
        "message": "面了个试 AI Agent 服务运行中",
        "version": "1.0.0",
        "status": "healthy"
    }


@app.post("/api/agent/generate-first-question")
async def generate_first_question(request: GenerateQuestionRequest):
    """生成第一个面试问题"""
    try:
        # 如果有简历，先解析简历
        resume_context = None
        if request.resumeFileId:
            resume_context = await resume_parser.parse_resume(request.resumeFileId)
        
        # 生成第一个问题
        question = await interview_agent.generate_first_question(
            experience=request.experience,
            style=request.style,
            job_title=request.jobTitle,
            resume_context=resume_context
        )
        
        # 生成语音
        audio_url = await tts_service.text_to_speech(question["text"])
        question["audioUrl"] = audio_url
        
        return {
            "code": 200,
            "message": "问题生成成功",
            "data": question
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/agent/generate-next-question")
async def generate_next_question(request: GenerateQuestionRequest):
    """生成下一个面试问题"""
    try:
        question = await interview_agent.generate_next_question(
            experience=request.experience,
            style=request.style,
            job_title=request.jobTitle,
            previous_questions=request.previousQuestions or [],
            previous_answers=request.previousAnswers or []
        )
        
        # 生成语音
        audio_url = await tts_service.text_to_speech(question["text"])
        question["audioUrl"] = audio_url
        
        return {
            "code": 200,
            "message": "问题生成成功",
            "data": question
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/agent/analyze-answer")
async def analyze_answer(request: AnalyzeAnswerRequest):
    """分析用户答案"""
    try:
        analysis = await interview_agent.analyze_answer(
            question_text=request.questionText,
            answer_text=request.answerText,
            job_title=request.jobTitle
        )
        
        return {
            "code": 200,
            "message": "分析完成",
            "data": analysis
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/agent/generate-report")
async def generate_report(request: GenerateReportRequest):
    """生成面试报告"""
    try:
        report = await interview_agent.generate_report(
            interview_id=request.interviewId,
            questions=request.questions,
            answers=request.answers,
            job_title=request.jobTitle,
            experience=request.experience,
            style=request.style
        )
        
        return {
            "code": 200,
            "message": "报告生成成功",
            "data": report
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/agent/speech-to-text")
async def speech_to_text(audio_file: UploadFile = File(...)):
    """语音转文字 (本地离线 Vosk 中文 ASR)"""
    try:
        content = await audio_file.read()
        if not content:
            raise HTTPException(status_code=400, detail="音频内容为空")
            
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
            tmp.write(content)
            tmp_path = tmp.name
            
        try:
            wf = wave.open(tmp_path, "rb")
            if vosk_model is None:
                raise HTTPException(status_code=500, detail="Vosk 模型未就绪")
                
            rec = KaldiRecognizer(vosk_model, wf.getframerate())
            rec.SetWords(False)
            
            while True:
                data = wf.readframes(4000)
                if len(data) == 0:
                    break
                rec.AcceptWaveform(data)
                
            res = json.loads(rec.FinalResult())
            text = res.get("text", "").replace(" ", "")
            wf.close()
            
            if not text:
                text = "无法识别或用户没有说话"
                
            return {
                "code": 200,
                "message": "转换成功",
                "data": {
                    "text": text
                }
            }
        except Exception as err:
            print("WAV decoding error:", err)
            # 降级：如果音频格式不对或解码失败，返回有意义的提示
            return {
                "code": 200,
                "message": "解码降级",
                "data": {
                    "text": "语音解析失败，请确保录音格式为 WAV 格式"
                }
            }
        finally:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    print(f"AI Agent 服务启动在端口 {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)
