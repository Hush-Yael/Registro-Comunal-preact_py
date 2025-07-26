from csv import DictReader
from io import StringIO
from .apertura import abrir_db
from constantes import (
    DatosComunidad,
    DatosUsuario,
    ErrorDeValidacion,
    CONTRASEÑA_MÍNIMA,
    NOMBRE_MÍNIMO,
)

ERROR_UNICO = "UNIQUE constraint failed"
ERROR_DE_VERIFICACIÓN = "CHECK constraint failed"


def registrar_usuario(datos: DatosUsuario, modificar: bool = False):
    conn, cursor = abrir_db()

    try:
        if not modificar:
            cantidad_usuarios = (
                cursor.execute("SELECT COUNT(nombre) FROM usuarios LIMIT 1").fetchone()
                or []
            )
            cantidad_usuarios = cantidad_usuarios[0]

            cursor.execute(
                "INSERT INTO usuarios (nombre, contraseña, rol) VALUES (?, ?, ?)",
                (
                    datos["nombre"],
                    datos["contraseña"],
                    # solo el primero usuario es admin, los demás son supervisores
                    "admin" if cantidad_usuarios < 1 else "supervisor",
                ),
            )
        else:
            cursor.execute(
                "UPDATE usuarios SET nombre = ?, contraseña = ? WHERE id = ?",
                (
                    datos["nombre"],
                    datos["contraseña"],
                    datos["id"],
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
                        "mensaje": f"El nombre debe tener al menos {NOMBRE_MÍNIMO} caracteres, sin espacios a los lados",
                    }
                )
            elif "contraseña" in error:
                raise ErrorDeValidacion(
                    {
                        "campo": "contraseña",
                        "mensaje": f"La contraseña debe tener al menos {CONTRASEÑA_MÍNIMA} caracteres, sin espacios a los lados",
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


def verificar_cedula_existente(cedula: int, id: str):
    conn, cursor = abrir_db()

    cedula_db = (
        cursor.execute(
            "SELECT cedula FROM comunidad WHERE cedula = ? AND id != ? LIMIT 1",
            (cedula, id),
        )
    ).fetchone() or ()

    conn.close()

    return len(cedula_db) > 0


def verificar_nombre_existente(nombre: str, id: str):
    conn, cursor = abrir_db()

    cedula_db = (
        cursor.execute(
            "SELECT rol FROM usuarios WHERE nombre = ? AND id != ? LIMIT 1",
            (nombre, id),
        )
    ).fetchone() or ()

    conn.close()

    return len(cedula_db) > 0


def añadir_registro_comunidad(datos: DatosComunidad, modificar: bool = False):
    conn, cursor = abrir_db()

    try:
        if modificar:
            if cursor.execute(
                "SELECT cedula FROM comunidad WHERE cedula = ? AND id != ? LIMIT 1",
                (datos["cedula"], datos["id"]),
            ).fetchone():
                raise ErrorDeValidacion(
                    {
                        "campo": "cedula",
                        "mensaje": "Ya existe un registro con esa cédula",
                    }
                )

            sql = "UPDATE comunidad SET nombres = ?, apellidos = ?, cedula = ?, fecha_nacimiento = ?, patologia = ?, direccion = ?, numero_casa = ?, editado = datetime(current_timestamp,'localtime') WHERE id = ?"

        else:
            sql = "INSERT INTO comunidad (nombres, apellidos, cedula, fecha_nacimiento, patologia, direccion, numero_casa) VALUES (?, ?, ?, ?, ?, ?, ?)"

        _datos = [
            datos["nombres"],
            datos["apellidos"],
            datos["cedula"],
            datos["fecha_nacimiento"],
            datos["patologia"],
            datos["direccion"],
            datos["numero_casa"],
        ]

        if modificar:
            _datos.append(datos["id"])

        cursor.execute(
            sql,
            _datos,
        )
        conn.commit()
    except Exception as e:
        error = e.args[0]

        # el único campo único es la cédula
        if ERROR_UNICO in error:
            raise ErrorDeValidacion(
                {
                    "campo": "cedula",
                    "mensaje": "Ya existe un registro con esa cédula",
                }
            )

        # errores de integridad de datos
        elif ERROR_DE_VERIFICACIÓN in error:
            if "nombres" in error or "apellidos" in error:
                campo = "nombres" if "nombres" in error else "apellidos"

                raise ErrorDeValidacion(
                    {
                        "campo": campo,
                        "mensaje": f"Los {campo} deben tener al menos {NOMBRE_MÍNIMO} caracteres, sin espacios a los lados",
                    }
                )
            elif "cedula" in error:
                raise ErrorDeValidacion(
                    {
                        "campo": "cedula",
                        "mensaje": "La cédula debe ser mayor a 0",
                    }
                )
            # error desconocido, no debería pasar
            else:
                raise e
        # error desconocido, no debería pasar
        else:
            raise e
    finally:
        conn.close()


def importar_comunidad(archivo: StringIO):
    reader = DictReader(archivo, delimiter=";")
    añadidos = 0
    fallos = 0

    conn, cursor = abrir_db()

    cursor.executescript("""--sql
      DELETE FROM comunidad;
      DELETE FROM sqlite_sequence WHERE name='comunidad';
    """)

    for row in reader:
        try:
            cedula = row.get("cedula", "").strip() or None
            row["cedula"] = cedula

            cursor.execute(
                """--sql
                INSERT INTO comunidad
                    (nombres, apellidos, cedula, fecha_nacimiento, patologia, direccion, numero_casa)
                VALUES
                    (:nombres, :apellidos, :cedula, :fecha_nacimiento, :patologia, :direccion, :numero_casa)
                """,
                row,
            )
            añadidos += 1
        except Exception as e:
            fallos += 1
            print(f"Ocurrio un error al importar el registro: {e}")

    conn.commit()
    conn.close()
    return {"fallos": fallos, "añadidos": añadidos}
