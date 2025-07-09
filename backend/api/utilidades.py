from datetime import datetime, date
from os import path
from pdf2docx import Converter
from constantes import RUTA_BASE
from xhtml2pdf import pisa


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
