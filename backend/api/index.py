from flask import Blueprint, abort, jsonify, request
from .db.obtencion import (
    obtener_usuarios,
    obtener_datos_comunidad,
    obtener_datos_registro_comunidad,
)
from .db.subida import (
    iniciar_sesion,
    registrar_usuario,
    verificar_cedula_existente,
    añadir_registro_comunidad,
)
from constantes import DatosUsuario, ErrorDeValidacion, DatosComunidad, Sesion
from .db.modificacion import cambiar_rol, eliminar_registro_comunidad, eliminar_usuario

api = Blueprint("api", __name__)


def fetch(func, *datos):
    try:
        return jsonify(func(*datos))
    except Exception as e:
        if isinstance(e, ErrorDeValidacion):
            return jsonify(e.args[0]), 400
        elif isinstance(e, KeyError):
            print(f"Ocurrió un error de validación: {e}")
            return jsonify(e.args[0]), 400
        print(f"Ocurrió un error inesperado: {e}")
        return abort(500)


@api.route("/api/usuarios", methods=["GET"])
def usuarios():
    return obtener_usuarios()


@api.route("/api/lista-comunidad", methods=["GET"])
def lista_comunidad():
    return obtener_datos_comunidad()


@api.route("/api/verificar-cedula-comunidad/<cedula>", methods=["HEAD"])
def verificar_cedula(cedula: str):
    existe = verificar_cedula_existente(int(cedula))
    return ("", 404) if not existe else ("", 204)


@api.route("/api/login", methods=["POST"])
def login():
    return fetch(iniciar_sesion, DatosUsuario(request.json))  # type: ignore


@api.route("/api/registro", methods=["POST"])
def registro():
    return fetch(registrar_usuario, DatosUsuario(request.json))  # type: ignore


@api.route("/api/registro-comunidad", methods=["POST", "PUT"])
def registro_comunidad():
    return fetch(
        añadir_registro_comunidad,
        DatosComunidad(request.json),  # type: ignore
        request.method == "PUT",
    )


@api.route("/api/actualizar-rol", methods=["PUT"])
def actualizar_rol():
    cambiar_rol(Sesion(request.json))  # type: ignore
    return ("", 200)


@api.route("/api/eliminar-usuario/<nombre>", methods=["DELETE"])
def _eliminar_usuario(nombre: str):
    eliminar_usuario(nombre)
    return ("", 200)


@api.route("/api/eliminar-registro-comunidad/<id>", methods=["DELETE"])
def eliminar_registro(id: int):
    eliminar_registro_comunidad(id)
    return ("", 200)


@api.route("/api/obtener-datos-comunidad/<id>", methods=["GET"])
def datos_registro_comunidad(id: int):
    datos = obtener_datos_registro_comunidad(id)
    return abort(404) if not datos else datos
