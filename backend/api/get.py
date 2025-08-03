from flask import Blueprint, abort, send_file
from .db.obtencion import (
    obtener_datos_usuario,
    obtener_usuarios,
    obtener_datos_registro_comunidad,
    exportar_comunidad,
)

get_api = Blueprint("get", __name__)


@get_api.route("/api/usuarios", methods=["GET"])
def usuarios():
    return obtener_usuarios()


@get_api.route("/api/obtener-datos-comunidad/<id>", methods=["GET"])
def datos_registro_comunidad(id: int):
    datos = obtener_datos_registro_comunidad(id)
    return abort(404) if not datos else datos


@get_api.route("/api/obtener-datos-usuario/<id>", methods=["GET"])
def datos_registro_usuario(id: str):
    datos = obtener_datos_usuario(int(id))
    return abort(404) if not datos else datos


@get_api.route("/api/exportar-comunidad", methods=["GET"])
def exportar():
    archivo = exportar_comunidad()
    return send_file(
        archivo,
        mimetype="text/csv",
        as_attachment=True,
        download_name="comunidad.csv",
    )
