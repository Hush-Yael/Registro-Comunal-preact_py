import sqlite3
from constantes import NOMBRE_MÍNIMO, CONTRASEÑA_MÍNIMA


def nombres_check(nombre_columna: str):
    return f"CHECK(length(trim({nombre_columna})) >= {NOMBRE_MÍNIMO})"


def abrir_db():
    conn = sqlite3.connect("comunidad.db")
    conn.row_factory = sqlite3.Row

    cursor = conn.cursor()

    cursor.execute(f"""--sql
      CREATE TABLE IF NOT EXISTS usuarios(
         nombre TEXT PRIMARY KEY NOT NULL UNIQUE {nombres_check("nombre")},
         rol TEXT NOT NULL CHECK(rol in ('admin', 'supervisor')),
         contraseña TEXT NOT NULL CHECK(length(trim(contraseña)) >= {CONTRASEÑA_MÍNIMA})
      )
   """)

    cursor.execute(f"""--sql
      CREATE TABLE IF NOT EXISTS comunidad (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         nombres TEXT NOT NULL {nombres_check("nombres")},
         apellidos TEXT NOT NULL {nombres_check("apellidos")},
         cedula TEXT NOT NULL UNIQUE CHECK(CAST(cedula AS INTEGER) > 0),
         fecha_nacimiento TEXT,
         patologia TEXT,
         direccion TEXT,
         numero_casa TEXT
      )
   """)
    return (conn, cursor)
