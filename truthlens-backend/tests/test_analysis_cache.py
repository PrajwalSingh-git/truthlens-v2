"""
Tests for the analysis result cache. Run with:
    pytest tests/test_analysis_cache.py -v
"""
from app.services import analysis_cache


class TestAnalysisCache:
    def setup_method(self):
        analysis_cache._cache.clear()

    def test_miss_then_hit(self):
        assert analysis_cache.get_cached("text", "some unique text here") is None
        analysis_cache.set_cached("text", "some unique text here", {"credibility": 80, "id": "orig-id"})
        hit = analysis_cache.get_cached("text", "some unique text here")
        assert hit is not None
        assert hit["credibility"] == 80

    def test_cache_hit_gets_fresh_id_and_timestamp(self):
        analysis_cache.set_cached("text", "repeat me", {"credibility": 50, "id": "original-id-123"})
        first_hit = analysis_cache.get_cached("text", "repeat me")
        second_hit = analysis_cache.get_cached("text", "repeat me")
        assert first_hit["id"] != "original-id-123"
        assert first_hit["id"] != second_hit["id"]  # every hit gets its own fresh id

    def test_case_and_whitespace_insensitive(self):
        analysis_cache.set_cached("text", "Hello World", {"credibility": 70})
        assert analysis_cache.get_cached("text", "  hello world  ") is not None

    def test_different_input_type_is_a_different_cache_entry(self):
        analysis_cache.set_cached("text", "same content", {"credibility": 60})
        assert analysis_cache.get_cached("url", "same content") is None

    def test_eviction_caps_cache_size(self):
        for i in range(analysis_cache._MAX_ENTRIES + 20):
            analysis_cache.set_cached("text", f"unique text number {i}", {"credibility": i})
        assert len(analysis_cache._cache) <= analysis_cache._MAX_ENTRIES
