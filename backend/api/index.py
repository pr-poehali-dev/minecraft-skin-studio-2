"""Общий API: чат заказов, чат состава, счётчики"""
import json
import os
import psycopg2
from datetime import datetime, timedelta

SCHEMA = "t_p95279231_minecraft_skin_studi"

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def handler(event: dict, context) -> dict:
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-User-Id, X-Auth-Token, X-Session-Id"
    }
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    method = event.get("httpMethod", "GET")
    path = event.get("path", "/")
    body = json.loads(event.get("body") or "{}")
    params = event.get("queryStringParameters") or {}

    conn = get_conn()
    cur = conn.cursor()

    try:
        # === COUNTERS ===
        if path == "/" or path == "/counters":
            cur.execute(f"SELECT name, value FROM {SCHEMA}.counters")
            result = {r[0]: r[1] for r in cur.fetchall()}
            return {"statusCode": 200, "headers": headers, "body": json.dumps(result)}

        # === ORDER CHAT ===
        elif path == "/chat":
            if method == "GET":
                order_id = params.get("order_id")
                cur.execute(
                    f"SELECT id, sender_type, sender_name, message, created_at FROM {SCHEMA}.order_messages WHERE order_id=%s ORDER BY created_at ASC",
                    (order_id,)
                )
                msgs = [{"id": r[0], "sender_type": r[1], "sender_name": r[2], "message": r[3], "created_at": str(r[4])} for r in cur.fetchall()]
                return {"statusCode": 200, "headers": headers, "body": json.dumps(msgs)}
            elif method == "POST":
                cur.execute(
                    f"INSERT INTO {SCHEMA}.order_messages (order_id, sender_type, sender_name, message) VALUES (%s,%s,%s,%s) RETURNING id",
                    (body["order_id"], body["sender_type"], body["sender_name"], body["message"])
                )
                msg_id = cur.fetchone()[0]
                conn.commit()
                return {"statusCode": 200, "headers": headers, "body": json.dumps({"id": msg_id})}

        # === STAFF CHAT ===
        elif path == "/staff-chat":
            if method == "GET":
                cur.execute(f"SELECT id, sender_name, message, created_at FROM {SCHEMA}.staff_messages ORDER BY created_at ASC LIMIT 200")
                msgs = [{"id": r[0], "sender_name": r[1], "message": r[2], "created_at": str(r[3])} for r in cur.fetchall()]
                return {"statusCode": 200, "headers": headers, "body": json.dumps(msgs)}
            elif method == "POST":
                cur.execute(
                    f"INSERT INTO {SCHEMA}.staff_messages (sender_name, message) VALUES (%s,%s) RETURNING id",
                    (body["sender_name"], body["message"])
                )
                msg_id = cur.fetchone()[0]
                conn.commit()
                return {"statusCode": 200, "headers": headers, "body": json.dumps({"id": msg_id})}

        return {"statusCode": 404, "headers": headers, "body": json.dumps({"error": "Not found"})}
    finally:
        cur.close()
        conn.close()