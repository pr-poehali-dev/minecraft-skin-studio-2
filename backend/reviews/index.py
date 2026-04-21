"""Отзывы клиентов: добавление (с антиспамом), получение одобренных, одобрение через панель"""
import json
import os
import psycopg2
from datetime import datetime, timedelta

SCHEMA = "t_p95279231_minecraft_skin_studi"

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def handler(event: dict, context) -> dict:
    headers = {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, X-User-Id, X-Auth-Token, X-Session-Id"}
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    method = event.get("httpMethod", "GET")
    body = json.loads(event.get("body") or "{}")
    params = event.get("queryStringParameters") or {}
    ip = (event.get("requestContext") or {}).get("identity", {}).get("sourceIp", "unknown")

    conn = get_conn()
    cur = conn.cursor()

    try:
        if method == "GET":
            all_reviews = params.get("all") == "true"
            if all_reviews:
                cur.execute(f"SELECT id, client_name, rating, text, tg_username, is_approved, created_at FROM {SCHEMA}.reviews ORDER BY created_at DESC")
            else:
                cur.execute(f"SELECT id, client_name, rating, text, tg_username, is_approved, created_at FROM {SCHEMA}.reviews WHERE is_approved=TRUE ORDER BY created_at DESC")
            reviews = []
            for r in cur.fetchall():
                reviews.append({"id": r[0], "client_name": r[1], "rating": r[2], "text": r[3], "tg_username": r[4], "is_approved": r[5], "created_at": str(r[6])})
            return {"statusCode": 200, "headers": headers, "body": json.dumps(reviews)}

        elif method == "POST":
            # Антиспам: 1 отзыв с одного IP в 24 часа
            since = datetime.now() - timedelta(hours=24)
            cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.reviews WHERE ip_address=%s AND created_at > %s", (ip, since))
            count = cur.fetchone()[0]
            if count >= 1:
                return {"statusCode": 429, "headers": headers, "body": json.dumps({"error": "Вы уже оставляли отзыв сегодня"})}

            rating = int(body.get("rating", 5))
            if rating < 1 or rating > 5:
                return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Рейтинг от 1 до 5"})}

            text = body.get("text", "").strip()
            if len(text) < 10:
                return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Отзыв слишком короткий"})}

            cur.execute(
                f"INSERT INTO {SCHEMA}.reviews (client_name, rating, text, tg_username, ip_address) VALUES (%s,%s,%s,%s,%s) RETURNING id",
                (body["client_name"], rating, text, body.get("tg_username",""), ip)
            )
            rev_id = cur.fetchone()[0]
            conn.commit()
            return {"statusCode": 200, "headers": headers, "body": json.dumps({"id": rev_id, "message": "Отзыв отправлен на проверку"})}

        elif method == "PUT":
            # Одобрить/отклонить отзыв (панель)
            rev_id = body.get("id")
            approved = body.get("is_approved", True)
            cur.execute(f"UPDATE {SCHEMA}.reviews SET is_approved=%s WHERE id=%s", (approved, rev_id))
            conn.commit()
            return {"statusCode": 200, "headers": headers, "body": json.dumps({"ok": True})}

        return {"statusCode": 404, "headers": headers, "body": json.dumps({"error": "Not found"})}
    finally:
        cur.close()
        conn.close()
