"""
ShopSmooth Application Configuration
Uses pydantic-settings for environment-based configuration management.
"""

from pydantic_settings import BaseSettings
from typing import List
import json


class Settings(BaseSettings):
    # Security
    SECRET_KEY: str = "shopsmooth-secret-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    # Database
    DATABASE_URL: str = "sqlite:///./shopsmooth.db"

    # Razorpay Payment Gateway
    RAZORPAY_KEY_ID: str = ""
    RAZORPAY_KEY_SECRET: str = ""

    # File Uploads
    UPLOAD_DIR: str = "static/uploads"

    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]

    # Frontend
    FRONTEND_URL: str = "http://localhost:3000"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        # Allow CORS_ORIGINS to be passed as a JSON string in env
        json_decoders = {List: lambda v: json.loads(v) if isinstance(v, str) else v}


# Global settings instance
settings = Settings()
