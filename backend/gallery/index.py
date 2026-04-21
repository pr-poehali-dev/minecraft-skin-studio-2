"""Галерея работ студии: загрузка фото (base64), получение списка"""
import json
import os
import base64
import uuid
import boto3
import psycopg2

SCHEMA = "t_p95279231_minecraft_skin_studi"

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def get_s3():
    return boto3.client(
        "s3",
        endpoint_url="https://bucket.poehali.dev",
        aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"]
    )

def handler(event: dict, context) -> dict:
    headers = {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, X-User-Id, X-Auth-Token, X-Session-Id"}
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    method = event.get("httpMethod", "GET")
    body = json.loads(event.get("body") or "{}")

    conn = get_conn()
    cur = conn.cursor()

    try:
        if method == "GET":
            cur.execute(f"SELECT id, image_url, title, uploaded_by_name, created_at FROM {SCHEMA}.gallery ORDER BY created_at DESC")
            items = [{"id": r[0], "image_url": r[1], "title": r[2], "uploaded_by_name": r[3], "created_at": str(r[4])} for r in cur.fetchall()]
            return {"statusCode": 200, "headers": headers, "body": json.dumps(items)}

        elif method == "POST":
            img_data = body.get("image_base64", "")
            title = body.get("title", "Работа студии")
            uploader = body.get("uploaded_by_name", "admin")

            img_bytes = base64.b64decode(img_data)
            key = f"gallery/{uuid.uuid4()}.png"
            s3 = get_s3()
            s3.put_object(Bucket="files", Key=key, Body=img_bytes, ContentType="image/png")
            url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/files/{key}"

            cur.execute(
                f"INSERT INTO {SCHEMA}.gallery (image_url, title, uploaded_by_name) VALUES (%s,%s,%s) RETURNING id",
                (url, title, uploader)
            )
            new_id = cur.fetchone()[0]
            conn.commit()
            return {"statusCode": 200, "headers": headers, "body": json.dumps({"id": new_id, "url": url})}

        elif method == "DELETE":
            gid = body.get("id")
            cur.execute(f"UPDATE {SCHEMA}.gallery SET image_url='' WHERE id=%s", (gid,))
            conn.commit()
            return {"statusCode": 200, "headers": headers, "body": json.dumps({"ok": True})}

        return {"statusCode": 404, "headers": headers, "body": json.dumps({"error": "Not found"})}
    finally:
        cur.close()
        conn.close()
