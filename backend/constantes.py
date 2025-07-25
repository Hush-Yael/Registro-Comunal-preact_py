import sys
import os
from typing import TypedDict

# Se obtiene la ruta de la interfaz
if getattr(sys, "frozen", False):
    # Ruta de la aplicación compilada con PyInstaller
    RUTA_BASE = sys._MEIPASS  # type: ignore
else:
    # Ruta de la aplicación no compilada
    RUTA_BASE = os.path.dirname(os.path.abspath(__file__))

NOMBRE_MÍNIMO = 3
CONTRASEÑA_MÍNIMA = 5

COLUMNAS_ORDENABLES = (
    "rowid",
    "nombres",
    "apellidos",
    "cedula",
    "fecha_nacimiento",
    "edad",
    "numero_casa",
    "editado",
)


class DatosUsuario(TypedDict):
    id: int
    nombre: str
    contraseña: str


class DatosComunidad(TypedDict):
    id: int
    nombres: str
    apellidos: str
    cedula: int
    fecha_nacimiento: str
    patologia: str
    direccion: str
    numero_casa: str


# para mostrar errores en los campos
class ErrorDeValidacion(Exception):
    campo: str  # el identificador del campo ("id"), para mostrar el mensaje debajo
    mensaje: str


class Sesion(TypedDict):
    nombre: str
    rol: str
