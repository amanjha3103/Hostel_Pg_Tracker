from flask import jsonify

def problem(status, title, detail):
    response = jsonify({
        "type": f"https://errors.hostel-pg.example/{status}",
        "title": title,
        "status": status,
        "detail": detail
    })
    response.status_code = status
    response.content_type = "application/problem+json"
    return response
