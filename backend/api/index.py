import io
import os
from flask import (
    Blueprint,
    abort,
    jsonify,
    request,
    send_file,
    render_template,
)
from .db.obtencion import (
    obtener_datos_usuario,
    obtener_usuarios,
    obtener_datos_comunidad,
    obtener_datos_registro_comunidad,
    exportar_comunidad,
)
from .db.subida import (
    iniciar_sesion,
    registrar_usuario,
    verificar_cedula_existente,
    añadir_registro_comunidad,
    importar_comunidad,
    verificar_nombre_existente,
)
from constantes import (
    RUTA_BASE,
    DatosUsuario,
    ErrorDeValidacion,
    DatosComunidad,
    Sesion,
)
from .db.modificacion import cambiar_rol, eliminar_registro_comunidad, eliminar_usuario
from locale import format_string
from .utilidades import fecha_a_años, generar_documento


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


@api.route("/api/obtener-datos-comunidad/<id>", methods=["GET"])
def datos_registro_comunidad(id: int):
    datos = obtener_datos_registro_comunidad(id)
    return abort(404) if not datos else datos


@api.route("/api/obtener-datos-usuario/<id>", methods=["GET"])
def datos_registro_usuario(id: str):
    datos = obtener_datos_usuario(int(id))
    return abort(404) if not datos else datos


@api.route("/api/exportar-comunidad", methods=["GET"])
def exportar():
    archivo = exportar_comunidad()
    return send_file(
        archivo,
        mimetype="text/csv",
        as_attachment=True,
        download_name="comunidad.csv",
    )


@api.route("/api/generar-carta", methods=["POST"])
def retornar_carta():
    try:
        json = request.json
    except Exception:
        return "No se proporcionaron datos", 400

    if not json:
        return "No se proporcionaron datos", 400

    id = json.get("id", "")
    if not id:
        return "No se proporcionó un id", 400

    tipo_carta = json.get("tipo_carta", "")
    if not tipo_carta:
        return "No se proporcionó un tipo de carta", 400

    tipo_documento = json.get("tipo_documento", "")
    if not tipo_documento:
        return "No se proporcionó un tipo de carta", 400

    hoy = json.get("hoy", "")
    tiempo_ = json.get("tiempo_", "")

    datos = obtener_datos_registro_comunidad(id)
    if not datos:
        return "No se encontraron datos relacionados al id ingresado", 404

    plantilla = render_template(
        "constancia.html" if tipo_carta != "plantilla" else "plantilla.html",
        tipo_carta=tipo_carta,
        nombres=f"{datos['nombres']} {datos['apellidos']}".upper(),
        edad=fecha_a_años(datos.get("fecha_nacimiento", "")),
        cedula=format_string("%d", int(datos["cedula"]), True),
        direccion=datos.get("direccion", "").upper(),
        numero_casa=datos.get("numero_casa", "").upper(),
        hoy=hoy,
        tiempo_=tiempo_,
    )

    generar_documento(id, tipo_carta, tipo_documento, plantilla)

    return (
        send_file(
            os.path.join(
                RUTA_BASE, f"documento.{'pdf' if tipo_documento != 'docx' else 'docx'}"
            ),
            download_name=f"documento.{'pdf' if tipo_documento != 'docx' else 'docx'}"
            if tipo_documento != "docx"
            else "test.docx",
            mimetype="application/pdf"
            if tipo_documento != "docx"
            else "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            as_attachment=True,
        ),
        200,
    )


@api.route("/api/verificar-cedula-comunidad", methods=["POST"])
def verificar_cedula():
    json = request.json
    if not json:
        return "No se proporcionaron datos", 400

    cedula = json.get("cedula", "")
    if not cedula:
        return "No se proporcionó una cedula", 400

    id = json.get("id", "")

    print(id)
    existe = verificar_cedula_existente(int(cedula), id)
    return ("", 404) if not existe else ("", 204)


@api.route("/api/verificar-nombre-usuario", methods=["POST"])
def verificar_nombre():
    json = request.json
    if not json:
        return "No se proporcionaron datos", 400

    nombre = json.get("nombre", "")
    if not nombre:
        return "No se proporcionó un nombre", 400

    id = json.get("id", "")
    if not id:
        return "No se proporcionó un id", 400

    existe = verificar_nombre_existente(nombre, id)
    return ("", 404) if not existe else ("", 204)


@api.route("/api/login", methods=["POST"])
def login():
    return fetch(iniciar_sesion, DatosUsuario(request.json))  # type: ignore


@api.route("/api/registro", methods=["POST", "PUT"])
def registro():
    return fetch(registrar_usuario, DatosUsuario(request.json), request.method == "PUT")  # type: ignore


@api.route("/api/importar-comunidad", methods=["POST"])
def importar():
    usuario, contraseña, archivo = (
        request.form["usuario"],
        request.form["contraseña"],
        request.files["archivo"],
    )

    if not archivo:
        return "No se ha proporcionado un archivo", 400
    elif not archivo.filename.endswith(".csv"):  # type: ignore
        return "Error: El archivo debe ser un CSV", 400

    if not usuario:
        return "No se ha proporcionado un usuario", 400

    if not contraseña:
        return "No se ha proporcionado una contraseña", 400
    else:
        response = fetch(iniciar_sesion, {"nombre": usuario, "contraseña": contraseña})
        if type(response) is tuple:
            return "El usuario o la contraseña son incorrectos", 400

    res = importar_comunidad(
        io.StringIO(archivo.stream.read().decode("utf-8-sig"), newline=None)
    )

    if res["añadidos"] < 1:
        return (
            "No se han agregado registros, el archivo es incorrecto",
            400,
        )
    elif res["fallos"] > 0:
        return (
            f"Se han agregado {res['añadidos']} registros, pero {res['fallos']} registros fallaron al ser agregados",
            200,
        )
    return f"Se han agregado todos los ({res['añadidos']}) registros", 200


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
