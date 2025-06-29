from .apertura import abrir_db


def obtener_usuarios():
    conn, cursor = abrir_db()
    usuarios = (cursor.execute("SELECT nombre, rol FROM usuarios")).fetchall()

    conn.close()
    return [dict(row) for row in usuarios]


def obtener_datos_comunidad():
    conn, cursor = abrir_db()
    datos = (
        cursor.execute(
            "SELECT id, nombres, apellidos, CAST(comunidad.cedula as INTEGER) as cedula, fecha_nacimiento, patologia, direccion, numero_casa FROM comunidad"
        )
    ).fetchall()

    conn.close()
    return [dict(row) for row in datos]


def obtener_datos_registro_comunidad(id: int):
    conn, cursor = abrir_db()
    datos = (
        cursor.execute("SELECT * FROM comunidad WHERE id = ? LIMIT 1", (id,))
    ).fetchone()

    conn.close()

    if datos:
        return dict(datos)
