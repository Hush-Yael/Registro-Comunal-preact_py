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
CONTRASEÑA_MÍNIMA = 6


class DatosUsuario(TypedDict):
    nombre: str
    contraseña: str


# para mostrar errores en los campos
class ErrorDeValidacion(Exception):
    campo: str  # el identificador del campo ("id"), para mostrar el mensaje debajo
    mensaje: str
