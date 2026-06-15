import base64
import client


def test_auth_header_is_basic_base64():
    header = client.build_auth_header("user@example.com", "secret")
    assert header.startswith("Basic ")
    decoded = base64.b64decode(header.split(" ", 1)[1]).decode()
    assert decoded == "user@example.com:secret"


def test_cache_key_is_stable_and_payload_sensitive():
    k1 = client.cache_key("/v3/serp/google/organic/live/advanced", [{"keyword": "heic to jpg"}])
    k2 = client.cache_key("/v3/serp/google/organic/live/advanced", [{"keyword": "heic to jpg"}])
    k3 = client.cache_key("/v3/serp/google/organic/live/advanced", [{"keyword": "webp to png"}])
    assert k1 == k2
    assert k1 != k3
    assert k1.endswith(".json")
