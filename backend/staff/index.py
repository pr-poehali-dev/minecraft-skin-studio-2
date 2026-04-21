"""Управление сотрудниками и аутентификация в панель"""
import json
import os
import psycopg2

SCHEMA = "t_p95279231_minecraft_skin_studi"

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def handler(event: dict, context) -> dict:
    headers = {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, X-User-Id, X-Auth-Token, X-Session-Id"}
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    method = event.get("httpMethod", "GET")
    path = event.get("path", "/")
    body = json.loads(event.get("body") or "{}")

    conn = get_conn()
    cur = conn.cursor()

    try:
        if method == "POST" and path == "/login":
            username = body.get("username", "")
            password = body.get("password", "")
            cur.execute(
                f"SELECT id, username, display_name, role, works_count, experience_text, avatar_url FROM {SCHEMA}.staff WHERE username=%s AND password_hash=%s AND is_active=TRUE",
                (username, password)
            )
            row = cur.fetchone()
            if not row:
                return {"statusCode": 401, "headers": headers, "body": json.dumps({"error": "Неверный логин или пароль"})}
            return {"statusCode": 200, "headers": headers, "body": json.dumps({
                "id": row[0], "username": row[1], "display_name": row[2],
                "role": row[3], "works_count": row[4], "experience_text": row[5], "avatar_url": row[6]
            })}

        elif method == "GET":
            cur.execute(f"SELECT id, username, display_name, role, works_count, experience_text, avatar_url, is_active FROM {SCHEMA}.staff ORDER BY id")
            staff = []
            for r in cur.fetchall():
                staff.append({"id": r[0], "username": r[1], "display_name": r[2], "role": r[3], "works_count": r[4], "experience_text": r[5], "avatar_url": r[6], "is_active": r[7]})
            return {"statusCode": 200, "headers": headers, "body": json.dumps(staff)}

        elif method == "POST" and path == "/":
            # Добавить сотрудника (только owner)
            cur.execute(
                f"INSERT INTO {SCHEMA}.staff (username, password_hash, display_name, role, works_count, experience_text) VALUES (%s,%s,%s,%s,%s,%s) RETURNING id",
                (body["username"], body["password"], body["display_name"], body.get("role","worker"), body.get("works_count",0), body.get("experience_text",""))
            )
            new_id = cur.fetchone()[0]
            conn.commit()
            return {"statusCode": 200, "headers": headers, "body": json.dumps({"id": new_id})}

        elif method == "PUT":
            sid = body.get("id")
            cur.execute(
                f"UPDATE {SCHEMA}.staff SET display_name=%s, experience_text=%s, works_count=%s, avatar_url=%s, is_active=%s WHERE id=%s",
                (body.get("display_name"), body.get("experience_text"), body.get("works_count",0), body.get("avatar_url"), body.get("is_active", True), sid)
            )
            conn.commit()
            return {"statusCode": 200, "headers": headers, "body": json.dumps({"ok": True})}

        elif method == "DELETE":
            sid = body.get("id")
            cur.execute(f"UPDATE {SCHEMA}.staff SET is_active=FALSE WHERE id=%s", (sid,))
            conn.commit()
            return {"statusCode": 200, "headers": headers, "body": json.dumps({"ok": True})}

        return {"statusCode": 404, "headers": headers, "body": json.dumps({"error": "Not found"})}
    finally:
        cur.close()
        conn.close()
