import psycopg2

conn = psycopg2.connect(
    host="localhost", database="sequencing", user="myuser", password="mypass"
)

cur = conn.cursor()
cur.execute(
    """
SELECT u.usename AS "Role name",
  CASE WHEN u.usesuper AND u.usecreatedb THEN CAST('superuser, create
database' AS pg_catalog.text)
       WHEN u.usesuper THEN CAST('superuser' AS pg_catalog.text)
       WHEN u.usecreatedb THEN CAST('create database' AS
pg_catalog.text)
       ELSE CAST('' AS pg_catalog.text)
  END AS "Attributes"
FROM pg_catalog.pg_user u
ORDER BY 1;
"""
)
v = cur.fetchone()
print(v)

conn.close()
