import sys
import os
from webview import create_window, start, settings
from threading import Thread, Event
from flask import Flask
from flask_cors import CORS
from constantes import RUTA_BASE
from api.index import api


ARGS = sys.argv[1:]
PREVIEW = "--preview" in ARGS or "-P" in ARGS
DEBUG = "--debug" in ARGS or "-D" in ARGS


app = Flask(__name__)
CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"

app.register_blueprint(api)


def iniciar_flask(evento_listo):
    try:
        # Señal que el backend se ha iniciado
        evento_listo.set()
        # Se inicia el servidor
        app.run(host="0.0.0.0", port=1144)
    except Exception as e:
        print(f"Configuracion del backend fallida: {str(e)}")
        evento_listo.set()
        sys.exit(1)


# Permitir descargar archivos
settings["ALLOW_DOWNLOADS"] = True

if __name__ == "__main__":
    # se corre con la webview al usar el ejecutable o al usar el argumento --preview
    if PREVIEW or getattr(sys, "frozen", False):
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
            # La app compilada busca el index.html en la carpeta estática, en modo debug se usa el servidor de Vite
            url=os.path.join(RUTA_BASE, "estatico", "index.html")
            if not DEBUG
            else "http://localhost:5173",
            text_select=True,
            zoomable=True,
        )

        start(debug=True, private_mode=False)
    # se inicia el servidor normalmente, para desarrollo
    else:
        app.run(host="0.0.0.0", debug=DEBUG, port=1144)
