import sys
from webview import create_window, start
from flask import Flask

app = Flask(__name__, static_folder="estatico", static_url_path="/")

ARGS = sys.argv[1:]
PREVIEW = "--preview" in ARGS
DEBUG = "--debug" in ARGS

# se usa la página estática al haberse compilado o usarse el argumento --preview
if PREVIEW or getattr(sys, "frozen", False):

    @app.route("/<path:path>")
    @app.route("/")
    def root(path="/"):
        return app.send_static_file("index.html")


if __name__ == "__main__":
    # se corre con la webview al usar el ejecutable o al usar el argumento --preview
    if PREVIEW or getattr(sys, "frozen", False):
        create_window("Flask example", url=app, text_select=True, zoomable=True)  # type: ignore
        start(debug=DEBUG)
    # se corre en el navegador al no estar en producción
    else:
        app.run(host="localhost", debug=DEBUG, port=8080)
