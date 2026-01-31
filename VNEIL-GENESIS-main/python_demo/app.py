"""
VNEIL‑GENESIS Python demo application.

This app exposes a simple health endpoint using Flask. It is pinned to
Flask 3.x and intended to run on Python 3.12 or newer.

Purpose: demonstrate a minimal API that can be used to verify the health
status of the Python demo. No other routes or business logic are included.

Assumptions:
  - The application will be deployed in a controlled environment; there is no
    authentication or rate limiting.

Invariants:
  - The health endpoint always returns a JSON object with keys "status" and
    "demo".

Failure modes:
  - If Flask or its dependencies are missing or incompatible, the app will
    fail to start. Ensure dependencies from `requirements.txt` are installed.

Example:
    $ python app.py
    # or using `flask run` if FLASK_APP=app is set.

"""

from flask import Flask, jsonify

app = Flask(__name__)


@app.get("/api/health")
def health() -> tuple[dict[str, str], int]:
    """Return a simple health status for the demo.

    Returns a tuple of the JSON payload and the HTTP status code.
    """
    return {"status": "ok", "demo": "vneil-genesis-python"}, 200


if __name__ == "__main__":
    # Bind to all interfaces and use the default port 5000
    app.run(host="0.0.0.0", port=5000)