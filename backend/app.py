import sys
from flask_cors import CORS
from webview import create_window, start, settings
from threading import Thread, Event
from flask import Flask, request
from api.index import api
from waitress import serve
import locale

locale.setlocale(locale.LC_ALL, "es_VE")


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

app.register_blueprint(api)

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
        serve(app, host="0.0.0.0", port=1144)
    else:
        app.run(
            host="0.0.0.0" if DEV else "127.0.0.1",
            debug=DEV and not PREVIEW and not PROD,
            port=1144,
        )


def iniciar_flask(evento_listo):
    try:
        # Señal que el backend se ha iniciado
        evento_listo.set()
        # Se inicia el servidor
        correr_servidor()
    except Exception as e:
        print(f"Configuracion del backend fallida: {str(e)}")
        evento_listo.set()
        sys.exit(1)


# Permitir descargar archivos
settings["ALLOW_DOWNLOADS"] = True

if __name__ == "__main__":
    # se corre con la webview al usar el ejecutable o al usar estar en el modo PREVIEW
    if PREVIEW or PROD:
        # Se crea un evento para indicar que el inicio del backend se ha completado
        backend_listo = Event()

        # Se inicia el backend en un hilo separado
        hilo_de_flask = Thread(target=iniciar_flask, args=(backend_listo,))
        hilo_de_flask.daemon = True
        hilo_de_flask.start()

        print("Esperando a que se complete la configuracion del backend...")
        backend_listo.wait()
        print(
            "Configuracion del backend completada, iniciando la interfaz de usuario..."
        )

        create_window(
            "Registro Comunal",
            # La app compilada usa la url de Flask que sirve el html desde la carpeta estática, en modo desarrollo se usa la del servidor de Vite
            server=app if PROD else None,  # type: ignore
            url="http://127.0.0.1:1144" if not DEV else "http://localhost:5173",
            text_select=True,
            zoomable=True,
        )

        start(debug=DEV, private_mode=False)
    # se inicia el servidor normalmente, para desarrollo
    else:
        correr_servidor()
