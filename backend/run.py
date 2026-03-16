#!/usr/bin/env python3
"""
ShopSmooth FastAPI Entry Point
Runs the development/production server with configurable settings.
"""

import os
import uvicorn

if __name__ == "__main__":
    host = os.getenv("API_HOST", "0.0.0.0")
    port = int(os.getenv("API_PORT", 8000))
    reload = os.getenv("API_RELOAD", "true").lower() == "true"
    env = os.getenv("ENVIRONMENT", "development")

    print(f"🚀 Starting ShopSmooth API")
    print(f"   Environment: {env}")
    print(f"   Host: {host}")
    print(f"   Port: {port}")
    print(f"   Reload: {reload}")
    print(f"   📚 Docs: http://{host}:{port}/api/docs")

    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=reload,
        log_level="info",
    )
