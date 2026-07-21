"""
Tests for the offline heuristic analysis engine. Run with:
    pytest tests/test_analysis_engine.py -v
"""
import pytest

from app.services.analysis_engine import analyze


class TestCredibilityScoring:
    def test_well_sourced_text_scores_high_credibility(self):
        text = (
            "According to a new study published in Nature, researchers found that "
            "global temperatures rose 1.1 degrees over the past century. Reportedly, "
            "the data was collected from 30,000 weather stations, and the findings "
            "are consistent with earlier climate models, scientists say."
        )
        result = analyze("text", text)
        assert result["credibility"] >= 70

    def test_clickbait_and_propaganda_text_scores_low_credibility(self):
        text = (
            "You WON'T BELIEVE what they don't want you to know! Wake up, the "
            "mainstream media won't tell you this shocking, outrageous truth. "
            "Real patriots already know it's undeniable!!!"
        )
        result = analyze("text", text)
        assert result["credibility"] < 50

    def test_credibility_is_always_in_valid_range(self):
        for text in ["", "a", "normal boring sentence with no signals at all."]:
            result = analyze("text", text or "placeholder")
            assert 0 <= result["credibility"] <= 100
            assert 0 <= result["confidence"] <= 100


class TestSignalScores:
    def test_all_signal_scores_are_bounded(self):
        text = "SHOCKING! You won't believe this! " * 20
        result = analyze("text", text)
        for key, value in result["signals"].items():
            assert 0 <= value <= 100, f"{key} out of bounds: {value}"

    def test_clickbait_phrase_raises_clickbait_score(self):
        low = analyze("text", "A city council meeting was held on Tuesday to discuss zoning.")
        high = analyze("text", "You won't believe what happens next in this SHOCKING story!")
        assert high["signals"]["clickbait"] > low["signals"]["clickbait"]

    def test_hedged_sourcing_language_increases_credibility(self):
        unhedged = analyze("text", "The mayor is corrupt and everyone knows it.")
        hedged = analyze("text", "According to sources, reportedly the mayor faces allegations, researchers found.")
        assert hedged["credibility"] >= unhedged["credibility"]


class TestFlagsAndOffsets:
    def test_flag_offsets_match_original_text(self):
        text = "This is SHOCKING news that everyone should see immediately."
        result = analyze("text", text)
        for flag in result["flags"]:
            substring = text[flag["start"]:flag["end"]]
            assert len(substring) > 0
            assert flag["start"] < flag["end"] <= len(text)

    def test_every_flag_has_required_metadata(self):
        text = "Shocking truth revealed: they don't want you to know this outrageous secret."
        result = analyze("text", text)
        assert len(result["flags"]) > 0
        for flag in result["flags"]:
            assert flag["label"]
            assert flag["description"]
            assert flag["tip"]
            assert flag["tone"] in ("danger", "warning", "primary")


class TestNewMetrics:
    def test_propaganda_characteristics_present_and_bounded(self):
        result = analyze("text", "This is a totally normal, unremarkable sentence.")
        chars = result["propaganda_characteristics"]
        for key in ("fear", "urgency", "us_vs_them", "evidence_gap", "authority_attack", "repetition"):
            assert key in chars
            assert 0 <= chars[key] <= 100

    def test_sentiment_arc_has_three_stages(self):
        result = analyze("text", "This is the opening. This is the middle. This is the close.")
        arc = result["sentiment_arc"]
        assert set(arc.keys()) == {"opening", "middle", "close"}

    def test_extracted_claims_returns_sentences_from_text(self):
        text = "Officials denied the allegations. The report cites three named sources."
        result = analyze("text", text)
        assert len(result["extracted_claims"]) > 0
        for claim in result["extracted_claims"]:
            assert claim in text

    def test_shareability_risk_bounded(self):
        result = analyze("text", "SHOCKING outrageous secret they don't want you to know!!!")
        assert 0 <= result["shareability_risk"] <= 100


class TestUrlInputTitling:
    def test_url_input_uses_url_as_title(self):
        result = analyze("url", "https://example.com/some-article")
        assert result["title"] == "https://example.com/some-article"

    def test_text_input_titles_from_content(self):
        result = analyze("text", "A short headline about local news.")
        assert "A short headline" in result["title"]
