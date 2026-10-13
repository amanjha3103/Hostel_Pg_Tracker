
from flask import Flask, jsonify

app = Flask(__name__)

@app.get("/owners/<owner_id>")
def check_owner(owner_id):
    # Demo owner used for local testing
    if owner_id == "owner-1":
        return jsonify({"eligible": True}), 200

    return jsonify({"eligible": False}), 200


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5002, debug=False)
