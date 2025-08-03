from flask import (
    Blueprint,
    request,
)
from .db.subida import (
    registrar_usuario,
    añadir_registro_comunidad,
)
from constantes import (
    DatosUsuario,
    DatosComunidad,
)
from .utilidades import fetch

post_put_api = Blueprint("post-put", __name__)


@post_put_api.route("/api/registro", methods=["POST", "PUT"])
def registro():
    return fetch(registrar_usuario, DatosUsuario(request.json), request.method == "PUT")  # type: ignore


@post_put_api.route("/api/registro-comunidad", methods=["POST", "PUT"])
def registro_comunidad():
    return fetch(
        añadir_registro_comunidad,
        DatosComunidad(request.json),  # type: ignore
        request.method == "PUT",
    )
