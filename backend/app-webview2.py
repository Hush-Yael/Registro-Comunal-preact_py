from webview import create_window, start, settings
from app import PORT, app, PROD, DEV, setup

# Permitir descargar archivos
settings["ALLOW_DOWNLOADS"] = True


def main():
    create_window(
        "Registro Comunal",
        # La app compilada usa la url de Flask que sirve el html desde la carpeta estática, en modo desarrollo se usa la del servidor de Vite
        server=app if PROD else None,  # type: ignore
        url=f"http://127.0.0.1:{PORT}" if not DEV else "http://localhost:5173",
        text_select=True,
        zoomable=True,
    )

    start(debug=DEV, private_mode=False)


if __name__ == "__main__":
    setup(main)
