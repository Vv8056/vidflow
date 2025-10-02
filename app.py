#!/usr/bin/env python3
import os
import json
from flask import Flask, jsonify, send_from_directory
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
    return send_from_directory(UPLOAD_FOLDER, filename, as_attachment=True)

# 3. Favicon
@app.route("/favicon.ico")
def favicon():
    return send_from_directory(STATIC_FOLDER, "favicon.ico", mimetype="image/vnd.microsoft.icon")

# --- Run ---
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
