"""
MODULE: VNEIL-GENESIS Python Demo Server

Purpose: Minimal Flask server for demonstrating VNEIL-GENESIS Python setup

Assumptions:
- Flask module is installed
- Application runs on port 5000 by default
- Debug mode is disabled for production safety

Invariants:
- Server listens on 0.0.0.0:5000
- Returns JSON health check response
- Debug mode is explicitly disabled

Failure Modes:
- Missing Flask: ImportError with helpful message
- Port in use: OSError with helpful message
- Server error: Logs to stderr and exits with code 1

Example:
    python python_demo/app.py
    python3 python_demo/app.py
"""

try:
    from flask import Flask, jsonify
except ImportError:
    import sys
    print("Error: Flask is not installed. Install with: pip install flask", file=sys.stderr)
    sys.exit(1)

app = Flask(__name__)

@app.route('/api/health')
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'demo': 'vneil-genesis-python'})

if __name__ == '__main__':
    try:
        # Explicitly disable debug mode for security
        app.run(host='0.0.0.0', port=5000, debug=False)
    except OSError as e:
        import sys
        # Check for common "address already in use" errors (cross-platform)
        error_msg = str(e).lower()
        if 'address already in use' in error_msg or e.errno in (48, 98):
            # errno 48 (macOS/BSD), errno 98 (Linux)
            print(f"Error: Port 5000 is already in use", file=sys.stderr)
        else:
            print(f"Server error: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        import sys
        print(f"Unexpected error: {e}", file=sys.stderr)
        sys.exit(1)
