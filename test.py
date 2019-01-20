import psycopg2

conn = psycopg2.connect(
    host="localhost", database="sequencing", user="myuser", password="mypass"
)

cur = conn.cursor()
cur.execute("SELECT version()")
v = cur.fetchone()
print(v)

conn.close()
