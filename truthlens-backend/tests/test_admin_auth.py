"""
Tests for admin panel auth. Run with:
    pytest tests/test_admin_auth.py -v
"""
import hashlib
import os

import pytest

os.environ["ADMIN_PASSWORD_HASH"] = hashlib.sha256(b"correct-horse-battery-staple").hexdigest()
os.environ["ADMIN_JWT_SECRET"] = "test-admin-secret-for-pytest-only"

from app.core.config import get_settings
get_settings.cache_clear()

from app.core.admin_auth import (
    verify_admin_password, create_admin_token, create_impersonation_token, decode_admin_jwt,
)


class TestAdminPassword:
    def test_correct_password_verifies(self):
        assert verify_admin_password("correct-horse-battery-staple") is True

    def test_wrong_password_rejected(self):
        assert verify_admin_password("wrong-password") is False

    def test_empty_password_rejected(self):
        assert verify_admin_password("") is False


class TestAdminToken:
    def test_admin_token_round_trips(self):
        token = create_admin_token()
        payload = decode_admin_jwt(token)
        assert payload is not None
        assert payload["type"] == "admin"

    def test_garbage_token_returns_none(self):
        assert decode_admin_jwt("not.a.real.token") is None


class TestImpersonationToken:
    def test_impersonation_token_carries_correct_user(self):
        token = create_impersonation_token("user-123", "someone@example.com")
        payload = decode_admin_jwt(token)
        assert payload["type"] == "impersonation"
        assert payload["sub"] == "user-123"
        assert payload["email"] == "someone@example.com"

    def test_impersonation_and_admin_tokens_are_distinguishable(self):
        admin_payload = decode_admin_jwt(create_admin_token())
        impersonation_payload = decode_admin_jwt(create_impersonation_token("u1", "a@b.com"))
        assert admin_payload["type"] != impersonation_payload["type"]

    def test_impersonation_token_has_shorter_ttl_than_admin_token(self):
        admin_payload = decode_admin_jwt(create_admin_token())
        impersonation_payload = decode_admin_jwt(create_impersonation_token("u1", "a@b.com"))
        admin_ttl = admin_payload["exp"] - admin_payload["iat"]
        impersonation_ttl = impersonation_payload["exp"] - impersonation_payload["iat"]
        assert impersonation_ttl < admin_ttl
