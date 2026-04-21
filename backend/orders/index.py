"""Управление заказами: создание, получение, обновление статуса, архивация"""
import json
import os
import psycopg2
from datetime import datetime

SCHEMA = "t_p95279231_minecraft_skin_studi"

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def handler(event: dict, context) -> dict:
    headers = {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, X-User-Id, X-Auth-Token, X-Session-Id, X-Staff-Name, X-Staff-Role"}
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    method = event.get("httpMethod", "GET")
    path = event.get("path", "/")
    body = json.loads(event.get("body") or "{}")
    params = event.get("queryStringParameters") or {}

    conn = get_conn()
    cur = conn.cursor()

    try:
        if method == "POST" and path == "/":
            # Создать заказ (клиент)
            cur.execute(f"SELECT value FROM {SCHEMA}.counters WHERE name='clients'")
            row = cur.fetchone()
            clients = row[0] if row else 100

            cur.execute(f"SELECT COALESCE(MAX(order_number), 0) + 1 FROM {SCHEMA}.orders")
            order_num = cur.fetchone()[0]

            cur.execute(
                f"""INSERT INTO {SCHEMA}.orders
                (order_number, client_nick, service_type, description, deadline, tg_username, ds_username, vk_username, status)
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s,'new') RETURNING id""",
                (order_num, body["client_nick"], body["service_type"], body.get("description",""),
                 body.get("deadline",""), body.get("tg_username",""), body.get("ds_username",""), body.get("vk_username",""))
            )
            order_id = cur.fetchone()[0]

            # Увеличить счётчик клиентов
            cur.execute(f"UPDATE {SCHEMA}.counters SET value = value + 1 WHERE name = 'clients'")
            conn.commit()

            return {"statusCode": 200, "headers": headers, "body": json.dumps({"id": order_id, "order_number": order_num})}

        elif method == "GET" and path == "/":
            archived = params.get("archived", "false") == "true"
            cur.execute(
                f"""SELECT o.id, o.order_number, o.client_nick, o.service_type, o.description,
                    o.deadline, o.tg_username, o.ds_username, o.vk_username,
                    o.status, o.created_at, o.completed_at, o.is_archived,
                    s.display_name as assigned_name
                    FROM {SCHEMA}.orders o
                    LEFT JOIN {SCHEMA}.staff s ON o.assigned_to = s.id
                    WHERE o.is_archived = %s ORDER BY o.created_at DESC""",
                (archived,)
            )
            cols = ["id","order_number","client_nick","service_type","description","deadline",
                    "tg_username","ds_username","vk_username","status","created_at","completed_at","is_archived","assigned_name"]
            orders = []
            for row in cur.fetchall():
                d = dict(zip(cols, row))
                d["created_at"] = str(d["created_at"]) if d["created_at"] else None
                d["completed_at"] = str(d["completed_at"]) if d["completed_at"] else None
                orders.append(d)
            return {"statusCode": 200, "headers": headers, "body": json.dumps(orders)}

        elif method == "PUT":
            order_id = body.get("id")
            new_status = body.get("status")
            assigned_to = body.get("assigned_to")

            if new_status == "done":
                cur.execute(
                    f"UPDATE {SCHEMA}.orders SET status='done', completed_at=NOW(), is_archived=TRUE WHERE id=%s",
                    (order_id,)
                )
            elif new_status:
                cur.execute(f"UPDATE {SCHEMA}.orders SET status=%s WHERE id=%s", (new_status, order_id))

            if assigned_to is not None:
                cur.execute(f"UPDATE {SCHEMA}.orders SET assigned_to=%s WHERE id=%s", (assigned_to, order_id))

            conn.commit()
            return {"statusCode": 200, "headers": headers, "body": json.dumps({"ok": True})}

        elif method == "DELETE":
            order_id = body.get("id") or params.get("id")
            cur.execute(f"UPDATE {SCHEMA}.orders SET status='cancelled' WHERE id=%s", (order_id,))
            conn.commit()
            return {"statusCode": 200, "headers": headers, "body": json.dumps({"ok": True})}

        return {"statusCode": 404, "headers": headers, "body": json.dumps({"error": "Not found"})}
    finally:
        cur.close()
        conn.close()
