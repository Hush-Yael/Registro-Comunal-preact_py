import sys
from typing import Callable
from flask_cors import CORS
from threading import Thread, Event
from flask import Flask, request
from api.index import montar_api
from waitress import serve
import locale

locale.setlocale(locale.LC_ALL, "es_VE")


PORT = 1144
ARGS = sys.argv[1:]
PREVIEW = "--preview" in ARGS or "-P" in ARGS
DEV = "--dev" in ARGS or "-D" in ARGS
PROD = getattr(sys, "frozen", False)

app = Flask(
    __name__,
    static_folder="estatico" if PROD else "../frontend/dist",
    template_folder="plantillas",
    static_url_path="/",
)
CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"
app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0

montar_api(app)

if PROD or PREVIEW:

    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def catch_all(path):
        return app.send_static_file("index.html")

    # se evita el error 404 cuando se intenta acceder a un archivo no existente, ya que siempre se debería mostrar el index.html
    @app.errorhandler(404)
    def handle_404(e):
        print(e)
        # no es una petición de api
        if request.method == "GET" and not request.url.startswith("/api"):
            return app.send_static_file("index.html")
        # es una petición que debe fallar al no existir el recurso realmente
        return e


def correr_servidor():
    if PROD:
        serve(app, host="0.0.0.0", port=PORT)
    else:
        app.run(
            host="0.0.0.0",
            debug=DEV and not PREVIEW and not PROD,
            port=PORT,
        )


def iniciar_flask_en_hilo(evento_listo):
    try:
        # Señal que el backend se ha iniciado
        evento_listo.set()
        # Se inicia el servidor
        correr_servidor()
    except Exception as e:
        print(f"Configuracion del backend fallida: {str(e)}")
        evento_listo.set()
        sys.exit(1)


def setup(gui_init: Callable[[], None]):
    # se corre la interfaz, por lo que se necesita que el backend esté en otro hilo
    if PREVIEW or PROD:
        # Se crea un evento para indicar que el inicio del backend se ha completado
        backend_listo = Event()

        # Se inicia el backend en un hilo separado
        hilo_de_flask = Thread(target=iniciar_flask_en_hilo, args=(backend_listo,))
        hilo_de_flask.daemon = True
        hilo_de_flask.start()

        print("Esperando a que se complete la configuracion del backend...")
        backend_listo.wait()
        print(
            "Configuracion del backend completada, iniciando la interfaz de usuario..."
        )

        # Se inicia la interfaz de usuario
        gui_init()
    # se inicia solo el servidor, para desarrollo sin implementar la interfaz
    else:
        correr_servidor()
