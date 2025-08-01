from constantes import Sesion
from .apertura import abrir_db


def cambiar_rol(datos: Sesion):
    conn, cursor = abrir_db()

    cursor.execute(
        "UPDATE usuarios SET rol = ? WHERE nombre = ?",
        (datos["rol"], datos["nombre"]),
    )

    conn.commit()
    conn.close()
    return True


def eliminar_usuario(nombre: str):
    conn, cursor = abrir_db()

    cursor.execute(
        "DELETE FROM usuarios WHERE nombre = ?",
        (nombre,),
    )

    conn.commit()
    conn.close()
    return True


def eliminar_registro_comunidad(id: int):
    conn, cursor = abrir_db()

    cursor.execute(
        "DELETE FROM comunidad WHERE id = ?",
        (id,),
    )

    conn.commit()
    conn.close()
    return True


def eliminar_registros_comunidad(ids: list[int]):
    conn, cursor = abrir_db()

    for id in ids:
        cursor.execute(
            "DELETE FROM comunidad WHERE id = ?",
            (id,),
        )

    conn.commit()
    conn.close()
    return True
