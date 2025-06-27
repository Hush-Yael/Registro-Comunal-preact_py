from .apertura import abrir_db


def obtener_usuarios():
    conn, cursor = abrir_db()
    usuarios = (cursor.execute("SELECT nombre, rol FROM usuarios")).fetchall()

    conn.close()
    return [dict(row) for row in usuarios]


def obtener_datos_comunidad():
    conn, cursor = abrir_db()
    datos = (cursor.execute("SELECT * FROM comunidad")).fetchall()

    conn.close()
    return [dict(row) for row in datos]
