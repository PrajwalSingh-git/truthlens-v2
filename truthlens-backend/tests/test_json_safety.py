"""
Regression tests for a bug class that has bitten this codebase twice:
raw Python datetime objects reaching a JSON-serializing HTTP call
(httpx, inside supabase-py) without being converted first, causing
"TypeError: Object of type datetime is not JSON serializable" — first
in save_analysis(), then again in delete_account(). _json_safe() is the
fix; these tests make sure it actually does its job on realistic data
shapes, so a third occurrence gets caught here instead of in production.

Run with:
    pytest tests/test_json_safety.py -v
"""
import json
from datetime import datetime, timezone

from app.services.supabase_service import _json_safe


class TestJsonSafe:
    def test_top_level_datetime_is_converted(self):
        row = {"created_at": datetime.now(timezone.utc)}
        safe = _json_safe(row)
        assert isinstance(safe["created_at"], str)
        json.dumps(safe)  # must not raise

    def test_nested_datetime_is_converted(self):
        row = {"analysis": {"created_at": datetime.now(timezone.utc), "score": 42}}
        safe = _json_safe(row)
        assert isinstance(safe["analysis"]["created_at"], str)
        json.dumps(safe)  # must not raise

    def test_datetime_in_list_is_converted(self):
        row = {"events": [{"at": datetime.now(timezone.utc)}, {"at": datetime.now(timezone.utc)}]}
        safe = _json_safe(row)
        for event in safe["events"]:
            assert isinstance(event["at"], str)
        json.dumps(safe)  # must not raise

    def test_plain_values_pass_through_unchanged(self):
        row = {"id": "abc-123", "score": 87.5, "active": True, "note": None}
        safe = _json_safe(row)
        assert safe == row

    def test_delete_account_archive_row_shape_is_serializable(self):
        """The exact shape that crashed delete_account() before the fix —
        a real Python datetime straight from the Supabase auth client's
        User.created_at field, sitting in an otherwise-plain dict."""
        archive_row = {
            "original_user_id": "user-123",
            "email": "test@example.com",
            "full_name": "Test User",
            "total_analyses": 5,
            "total_reports": 2,
            "account_created_at": datetime.now(timezone.utc),
        }
        safe = _json_safe(archive_row)
        json.dumps(safe)  # this is what crashed before the fix
