"""
Application configuration.

All values are read from environment variables so the same code works
locally (.env file) and in production (Render environment variables).
"""
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Supabase project settings — from Supabase dashboard > Settings > API
    supabase_url: str = ""
    supabase_service_role_key: str = ""  # server-side only, never expose to frontend
    supabase_jwt_secret: str = ""        # Settings > API > JWT Settings > JWT Secret

    # CORS — comma-separated list of allowed frontend origins
    cors_origins: str = "http://localhost:5173"

    # Optional: enable a real LLM-backed analyzer instead of the built-in
    # heuristic engine by providing an API key for either provider. If
    # neither is set, the heuristic engine is used automatically — the
    # app works either way. Anthropic is preferred if both are set.
    anthropic_api_key: str = ""
    groq_api_key: str = ""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
