import os
import sqlite3
from constantes import RUTA_BASE, NOMBRE_MÍNIMO, CONTRASEÑA_MÍNIMA


def nombres_check(nombre_columna: str):
    return f"CHECK(length(trim({nombre_columna})) >= {NOMBRE_MÍNIMO})"


def abrir_db():
    conn = sqlite3.connect(os.path.join(RUTA_BASE, "comunidad.db"))
    conn.row_factory = sqlite3.Row

    cursor = conn.cursor()

    cursor.executescript(f"""--sql
      CREATE TABLE IF NOT EXISTS usuarios(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL UNIQUE {nombres_check("nombre")},
        rol TEXT NOT NULL CHECK(rol in ('admin', 'supervisor')),
        contraseña TEXT NOT NULL CHECK(length(trim(contraseña)) >= {CONTRASEÑA_MÍNIMA})
      );
      
      INSERT INTO usuarios (nombre, rol, contraseña) 
        SELECT 'admin', 'admin', 'admin' 
        WHERE (SELECT 1 WHERE (SELECT count(id) FROM usuarios LIMIT 1) = 0);
    

      CREATE TABLE IF NOT EXISTS comunidad (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombres TEXT NOT NULL {nombres_check("nombres")},
        apellidos TEXT NOT NULL {nombres_check("apellidos")},
        cedula TEXT UNIQUE DEFAULT NULL CHECK(cedula = NULL OR CAST(cedula AS INTEGER) > 0),
        fecha_nacimiento TEXT,
        patologia TEXT,
        direccion TEXT,
        numero_casa TEXT,
        editado TEXT DEFAULT (datetime(current_timestamp, 'localtime'))
      );
    """)

    return (conn, cursor)
