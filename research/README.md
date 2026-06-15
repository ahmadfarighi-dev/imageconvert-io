# Stage 0 Keyword Research Pipeline

Decides which image-tool pages to build, using DataForSEO decision-grade data.

## Setup
```
cd research
python -m venv .venv
. .venv/Scripts/activate    # Windows; use .venv/bin/activate on macOS/Linux
pip install -r requirements.txt
cp .env.example .env        # then edit .env with your DataForSEO API login/password
```

## Run
```
python run.py discover                # free: expand seeds via Google Autocomplete
python run.py probe                   # ~$0.02: one live call per endpoint to verify parsers
python run.py pull --max-serps 250    # paid: volume+difficulty (all) then SERP+authority (survivors)
python run.py report                  # writes keyword-research.md + results/decision-data.json
```

## What the output means
See `keyword-research.md`. The numeric score is a SORT KEY, not a verdict. Verdicts use explicit
thresholds (see `score.py` constants). ALWAYS eyeball the raw top-10 domains before committing.

## Caveats
Third-party volume estimates are order-of-magnitude. Beatability (ranking-domain authority) matters
more than raw volume for a new domain. Re-runs read `cache/` and cost nothing.
