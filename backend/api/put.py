from flask import (
    Blueprint,
    request,
)
from constantes import (
    Sesion,
)
from .db.modificacion import (
    cambiar_rol,
)

put_api = Blueprint("put", __name__)


@put_api.route("/api/actualizar-rol", methods=["PUT"])
def actualizar_rol():
    cambiar_rol(Sesion(request.json))  # type: ignore
    return ("", 200)
