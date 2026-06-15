import base64
import hashlib
import json
import os
from pathlib import Path

import requests
from dotenv import load_dotenv

API_BASE = "https://api.dataforseo.com"
CACHE_DIR = Path("cache")


def build_auth_header(login: str, password: str) -> str:
    token = base64.b64encode(f"{login}:{password}".encode()).decode()
    return f"Basic {token}"


def cache_key(endpoint: str, payload) -> str:
    raw = endpoint + json.dumps(payload, sort_keys=True)
    return hashlib.sha256(raw.encode()).hexdigest() + ".json"


class DataForSeoClient:
    def __init__(self, login: str | None = None, password: str | None = None):
        load_dotenv()
        self.login = login or os.environ["DATAFORSEO_LOGIN"]
        self.password = password or os.environ["DATAFORSEO_PASSWORD"]
        self.headers = {
            "Authorization": build_auth_header(self.login, self.password),
            "Content-Type": "application/json",
        }
        CACHE_DIR.mkdir(exist_ok=True)

    def post(self, endpoint: str, payload, use_cache: bool = True) -> dict:
        """POST to DataForSEO. Caches responses to avoid re-paying. Raises on HTTP/API error."""
        cache_path = CACHE_DIR / cache_key(endpoint, payload)
        if use_cache and cache_path.exists():
            return json.loads(cache_path.read_text(encoding="utf-8"))

        resp = requests.post(API_BASE + endpoint, headers=self.headers,
                             data=json.dumps(payload), timeout=120)
        resp.raise_for_status()
        body = resp.json()
        if body.get("status_code") != 20000:
            raise RuntimeError(f"DataForSEO error {body.get('status_code')}: {body.get('status_message')}")
        cache_path.write_text(json.dumps(body), encoding="utf-8")
        return body
