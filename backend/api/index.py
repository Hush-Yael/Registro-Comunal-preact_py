from flask import Blueprint, abort, jsonify, request
from api.db.subida import (
    iniciar_sesion,
    registrar_usuario,
    verificar_cedula_existente,
)
from constantes import DatosUsuario, ErrorDeValidacion

api = Blueprint("api", __name__)


def fetch(func, datos):
    try:
        return jsonify(func(datos))
    except Exception as e:
        if isinstance(e, ErrorDeValidacion):
            return jsonify(e.args[0]), 400
        print(f"Ocurrió un error inesperado: {e}")
        return abort(500)


@api.route("/api/login", methods=["POST"])
def login():
    return fetch(iniciar_sesion, DatosUsuario(request.json))  # type: ignore


@api.route("/api/registro", methods=["POST"])
def registro():
    return fetch(registrar_usuario, DatosUsuario(request.json))  # type: ignore


@api.route("/api/verificar-cedula-comunidad/<cedula>", methods=["HEAD"])
def verificar_cedula(cedula: str):
    existe = verificar_cedula_existente(int(cedula))
    return ("", 404) if not existe else ("", 204)
