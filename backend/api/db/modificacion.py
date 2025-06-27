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
