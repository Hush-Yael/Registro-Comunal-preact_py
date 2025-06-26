import sys
import os
from webview import create_window, start
from threading import Thread, Event
from flask import Flask
from flask_cors import CORS
from constantes import RUTA_BASE
from api.index import api


ARGS = sys.argv[1:]
PREVIEW = "--preview" in ARGS
DEBUG = "--debug" in ARGS


app = Flask(__name__)
CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"

app.register_blueprint(api)


def iniciar_flask(evento_listo):
    try:
        # Señal que el backend se ha iniciado
        evento_listo.set()
        # Se inicia el servidor
        app.run(host="localhost", port=1144)
    except Exception as e:
        print(f"Configuración del backend fallida: {str(e)}")
        evento_listo.set()
        sys.exit(1)


if __name__ == "__main__":
    # se corre con la webview al usar el ejecutable o al usar el argumento --preview
    if PREVIEW or getattr(sys, "frozen", False):
        # Se crea un evento para indicar que el inicio del backend se ha completado
        backend_listo = Event()

        # Se inicia el backend en un hilo separado
        hilo_de_flask = Thread(target=iniciar_flask, args=(backend_listo,))
        hilo_de_flask.daemon = True
        hilo_de_flask.start()

        print("Esperando a que se complete la configuración del backend...")
        backend_listo.wait()
        print(
            "Configuración del backend completada, iniciando la interfaz de usuario..."
        )

        create_window(
            "Flask example",
            url=os.path.join(RUTA_BASE, "estatico", "index.html"),
            text_select=True,
            zoomable=True,
        )

        start(debug=DEBUG)
    # se inicia el servidor normalmente, para desarrollo
    else:
        app.run(host="localhost", debug=DEBUG, port=1144)
