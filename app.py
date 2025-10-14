#!/usr/bin/env python3
import os
import json
import mimetypes
from flask import Flask, jsonify, send_from_directory, Response, send_file, abort
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

UPDATE_FILE = "metadata/update.json"
UPLOAD_FOLDER = "latest-apk"
STATIC_FOLDER = "static"  # For favicon and other static files

# os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# --- Helper functions ---
def load_update_data():
    if not os.path.exists(UPDATE_FILE):
        return {}
    with open(UPDATE_FILE, "r") as f:
        return json.load(f)

# --- API Endpoints ---

# 1. GET update info for Flutter app
@app.route("/update", methods=["GET"])
def get_update():
    data = load_update_data()
    if not data:
        return jsonify({"error": "no update info"}), 404
    return jsonify(data)

# 2. Serve APK files (if hosting them here instead of GitHub)
@app.route("/apk/<path:filename>", methods=["GET"])
def download_apk(filename):
    file_path = os.path.join(UPLOAD_FOLDER, filename)

    # Check file exists
    if not os.path.isfile(file_path):
        return abort(404, description="File not found")

    # Guess the MIME type (important for .apk)
    mime_type = mimetypes.guess_type(file_path)[0] or "application/vnd.android.package-archive"

    # Get file size for Content-Length
    file_size = os.path.getsize(file_path)

    # Open the file in binary mode for streaming
    def generate():
        with open(file_path, "rb") as f:
            while True:
                chunk = f.read(8192)
                if not chunk:
                    break
                yield chunk

    # Build the streaming response
    response = Response(generate(), mimetype=mime_type)
    response.headers["Content-Disposition"] = f'attachment; filename="{filename}"'
    response.headers["Content-Length"] = str(file_size)
    response.headers["Cache-Control"] = "public, max-age=86400"
    response.headers["Accept-Ranges"] = "bytes"

    return response
# @app.route("/apk/<path:filename>", methods=["GET"])
# def download_apk(filename):
#     return send_from_directory(UPLOAD_FOLDER, filename, as_attachment=True)

# 3. Favicon
@app.route("/favicon.ico")
def favicon():
    return send_from_directory(STATIC_FOLDER, "favicon.ico", mimetype="image/vnd.microsoft.icon")

# --- Run ---
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

