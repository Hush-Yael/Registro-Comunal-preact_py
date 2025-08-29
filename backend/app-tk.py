from tkinter import Tk, messagebox, ttk
from main import PORT, setup
from webbrowser import open
import socket


def obtener_ip_local():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

    try:
        s.connect(("192.255.255.255", 1))
        IP = s.getsockname()
    except Exception:
        IP = "127.0.0.1"
    finally:
        s.close()
    return IP


ip = obtener_ip_local()

if isinstance(ip, tuple):
    ip = ip[0]

LAN = not ip.startswith("127") and ip.startswith("192")


def abrir_navegador(label):
    ip_address = label.cget("text")
    url = f"http://{ip_address}"
    try:
        open(url)
    except Exception as e:
        messagebox.showerror("Error", f"No se pudo abrir el navegador: {e}")


def main():
    ventana = Tk()
    ventana.title("Registro Comunal")
    ventana.resizable(False, False)
    ventana.configure()

    root = ttk.Frame(
        ventana,
        padding="20 20 15 15",
    )
    root.pack(expand=True, fill="both")

    ttk.Label(
        root,
        text="Servidor iniciado",
        font=("Segoe UI", 15, "bold"),
    ).pack(pady=(0, 20))

    ttk.Label(
        root,
        text="Para acceder a la aplicación, haz click o ingresa la siguiente dirección en el navegador:",
        foreground="#6A6A6A",
        font=("Segoe UI", 11),
    ).pack(padx=10)

    ip_label = ttk.Label(
        root,
        text=f"127.0.0.1:{PORT}",
        foreground="blue",
        cursor="hand2",
        font=("Segoe UI", 14, "underline", "bold"),
    )

    ip_label.pack(pady=10)

    # Asignar el evento de click
    ip_label.bind("<Button-1>", lambda _: abrir_navegador(ip_label))

    if LAN:
        f = ttk.Frame(root)
        f.pack(pady=(20, 0))

        ttk.Label(
            f,
            text="O ingresa la siguiente dirección en el navegador de otro dispositivo (ambos deben estar conectados a la misma red):",
            foreground="#6A6A6A",
            font=("Segoe UI", 11),
        ).pack(padx=10)

        ttk.Label(
            f,
            text=f"{ip}:{PORT}",
            foreground="blue",
            cursor="hand2",
            font=("Segoe UI", 14, "underline", "bold"),
        ).pack(pady=10)

    root.mainloop()


if __name__ == "__main__":
    setup(main)
