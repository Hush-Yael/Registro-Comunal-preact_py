from .apertura import abrir_db
from constantes import DatosUsuario, ErrorDeValidacion

ERROR_UNICO = "UNIQUE constraint failed"
ERROR_DE_VERIFICACIÓN = "CHECK constraint failed"


def registrar_usuario(datos: DatosUsuario):
    conn, cursor = abrir_db()

    cantidad_usuarios = (
        cursor.execute("SELECT COUNT(nombre) FROM usuarios LIMIT 1").fetchone() or []
    )
    cantidad_usuarios = cantidad_usuarios[0]

    try:
        cursor.execute(
            "INSERT INTO usuarios (nombre, contraseña, rol) VALUES (?, ?, ?)",
            (
                datos["nombre"],
                datos["contraseña"],
                # solo el primero usuario es admin, los demás son supervisores
                "admin" if cantidad_usuarios < 1 else "supervisor",
            ),
        )

        conn.commit()
    except Exception as e:
        error = e.args[0]

        # el único campo único es el nombre
        if ERROR_UNICO in error:
            raise ErrorDeValidacion(
                {
                    "campo": "nombre",
                    "mensaje": "Ya existe un usuario con ese nombre",
                }
            )
        # errores de integridad de datos
        elif ERROR_DE_VERIFICACIÓN in error:
            if "nombre" in error:
                raise ErrorDeValidacion(
                    {
                        "campo": "nombre",
                        "mensaje": "El nombre debe tener al menos 3 caracteres, sin espacios a los lados",
                    }
                )
            elif "contraseña" in error:
                raise ErrorDeValidacion(
                    {
                        "campo": "contraseña",
                        "mensaje": "La contraseña debe tener al menos 6 caracteres, sin espacios a los lados",
                    }
                )
        # error desconocido, no debería pasar
        else:
            raise e
    finally:
        conn.close()


def iniciar_sesion(datos: DatosUsuario) -> str:
    conn, cursor = abrir_db()

    datos_db = (
        cursor.execute(
            "SELECT contraseña, rol FROM usuarios WHERE nombre = ? LIMIT 1",
            (datos["nombre"],),
        ).fetchone()
        or ()
    )

    conn.close()

    if len(datos_db) == 0:
        raise ErrorDeValidacion(
            {
                "campo": "nombre",
                "mensaje": "No existe un usuario con los datos ingresados",
            }
        )

    if datos_db[0] != datos["contraseña"]:
        raise ErrorDeValidacion(
            {
                "campo": "contraseña",
                "mensaje": "La contraseña ingresada es incorrecta",
            }
        )

    return datos_db[1]
