from flask import Blueprint, abort, jsonify, request
from api.db.subida import iniciar_sesion, registrar_usuario
from constantes import DatosUsuario, ErrorDeValidacion

api = Blueprint("api", __name__)


@api.route("/api/login", methods=["POST"])
def login():
    try:
        return jsonify(iniciar_sesion(DatosUsuario(request.json)))  # type: ignore
    except Exception as e:
        if isinstance(e, ErrorDeValidacion):
            return jsonify(e.args[0]), 400
        print(f"Ocurrió un error inesperado: {e}")
        return abort(500)


@api.route("/api/registro", methods=["POST"])
def registro():
    try:
        registrar_usuario(DatosUsuario(request.json))  # type: ignore
        return jsonify({"status": "ok"})
    except Exception as e:
        if isinstance(e, ErrorDeValidacion):
            return jsonify(e.args[0]), 400
        print(f"Ocurrió un error inesperado: {e}")
        return abort(500)
