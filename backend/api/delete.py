from flask import (
    Blueprint,
    request,
)
from .db.modificacion import (
    eliminar_registro_comunidad,
    eliminar_registros_comunidad,
    eliminar_usuario,
)

delete_api = Blueprint("delete", __name__)


@delete_api.route("/api/eliminar-usuario/<nombre>", methods=["DELETE"])
def _eliminar_usuario(nombre: str):
    eliminar_usuario(nombre)
    return ("", 200)


@delete_api.route("/api/eliminar-registro-comunidad/<id>", methods=["DELETE"])
def eliminar_registro(id: int):
    eliminar_registro_comunidad(id)
    return ("", 200)


@delete_api.route("/api/eliminar-registros-comunidad", methods=["DELETE"])
def eliminar_registros():
    ids = request.json
    print(ids)

    if not ids:
        return "No se proporcionaron ids", 400
    elif type(ids) is not list:
        return "No se proporcionaron ids", 400
    elif len(ids) < 1:
        return "No se proporcionaron ids", 400

    eliminar_registros_comunidad(ids)
    return ("", 200)
