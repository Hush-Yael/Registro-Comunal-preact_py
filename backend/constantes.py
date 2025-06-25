import sys
import os

# Se obtiene la ruta de la interfaz
if getattr(sys, "frozen", False):
    # Ruta de la aplicación compilada con PyInstaller
    RUTA_BASE = sys._MEIPASS  # type: ignore
else:
    # Ruta de la aplicación no compilada
    RUTA_BASE = os.path.dirname(os.path.abspath(__file__))
