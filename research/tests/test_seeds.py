import seeds


def test_load_seeds_returns_flat_deduped_lowercase_list():
    result = seeds.load_seeds("data/seeds.json")
    assert isinstance(result, list)
    assert "heic to jpg" in result
    assert "image compressor" in result
    assert "compress image to 20kb" in result
    assert len(result) == len(set(result))
    assert all(k == k.lower().strip() for k in result)
    assert all(k for k in result)


def test_load_seeds_missing_file_raises():
    import pytest
    with pytest.raises(FileNotFoundError):
        seeds.load_seeds("data/does_not_exist.json")
