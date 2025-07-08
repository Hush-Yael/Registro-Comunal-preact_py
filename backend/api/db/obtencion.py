from csv import DictWriter
from .apertura import abrir_db
from io import BytesIO, StringIO


def obtener_usuarios():
    conn, cursor = abrir_db()
    usuarios = (cursor.execute("SELECT id, nombre, rol FROM usuarios")).fetchall()

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


def obtener_datos_usuario(id: int):
    conn, cursor = abrir_db()

    datos = (
        cursor.execute(
            "SELECT * FROM usuarios WHERE id = ? LIMIT 1",
            (id,),
        )
    ).fetchone()

    conn.close()

    if datos:
        return dict(datos)


def exportar_comunidad():
    datos = obtener_datos_comunidad()
    datos[0].pop("id", None)

    proxy = StringIO()
    writer = DictWriter(proxy, fieldnames=datos[0].keys(), delimiter=";")
    writer.writeheader()

    for row in datos:
        row.pop("id", None)
        writer.writerow(row)

    mem = BytesIO()
    mem.write(proxy.getvalue().encode())
    mem.seek(0)
    proxy.close()

    return mem
