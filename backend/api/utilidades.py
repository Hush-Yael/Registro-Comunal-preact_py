from datetime import datetime, date
from os import path
from pdf2docx import Converter
from constantes import RUTA_BASE, ErrorDeValidacion
from xhtml2pdf import pisa
from flask import (
    abort,
    jsonify,
)


def fetch(func, *datos):
    try:
        return jsonify(func(*datos))
    except Exception as e:
        if isinstance(e, ErrorDeValidacion):
            return jsonify(e.args[0]), 400
        elif isinstance(e, KeyError):
            print(f"Ocurrio un error de validación: {e}")
            return jsonify(e.args[0]), 400
        print(f"Ocurrio un error inesperado: {e}")
        return abort(500)


def fecha_a_años(fecha: str):
    if not fecha:
        return

    hoy = date.today()

    try:
        birthdate = datetime.strptime(fecha, "%Y-%m-%d").date()
    except ValueError:
        return

    return (
        hoy.year
        - birthdate.year
        - ((hoy.month, hoy.day) < (birthdate.month, birthdate.day))
    )


def generar_documento(tipo_carta: str, tipo_documento: str, plantilla: str):
    with open(path.join(RUTA_BASE, "documento.pdf"), "w+b") as pdf:
        pisa.CreatePDF(
            plantilla,
            path=path.join(RUTA_BASE, "plantillas"),
            dest=pdf,
        )

        if tipo_documento != "docx" and tipo_carta != "plantilla":
            return pdf

        c = Converter(path.join(RUTA_BASE, "documento.pdf"))
        c.convert(
            open(
                path.join(
                    RUTA_BASE,
                    "documento.docx",
                ),
                "wb",
            )
        )
