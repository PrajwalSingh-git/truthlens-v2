from datetime import datetime
from typing import Literal
from pydantic import BaseModel, Field


class AnalyzeRequest(BaseModel):
    input_type: Literal["text", "url"]
    input: str = Field(..., min_length=1, max_length=20000)


class Flag(BaseModel):
    start: int
    end: int
    reason: str
    tone: Literal["danger", "warning", "primary"]
    label: str
    description: str
    tip: str


class SignalScores(BaseModel):
    bias: float
    propaganda: float
    clickbait: float
    emotional_manipulation: float
    political_bias: float


class PropagandaCharacteristics(BaseModel):
    fear: float
    urgency: float
    us_vs_them: float
    evidence_gap: float
    authority_attack: float
    repetition: float


class SentimentArc(BaseModel):
    opening: float
    middle: float
    close: float


class AnalyzeResponse(BaseModel):
    id: str
    title: str
    input_type: str
    credibility: float
    confidence: float
    summary: str
    signals: SignalScores
    political_lean: float
    propaganda_characteristics: PropagandaCharacteristics
    sentiment_arc: SentimentArc
    shareability_risk: float
    extracted_claims: list[str]
    verification_guidance: list[str]
    explanations: list[str]
    highlighted_text: str
    flags: list[Flag]
    created_at: datetime


class HistoryItem(BaseModel):
    id: str
    title: str
    input: str
    credibility: float
    created_at: datetime


class SaveReportRequest(BaseModel):
    analysis_id: str
    title: str


class ReportItem(BaseModel):
    id: str
    analysis_id: str
    title: str
    created_at: datetime
