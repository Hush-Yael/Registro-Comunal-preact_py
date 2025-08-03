from flask import Flask
from .get import get_api
from .post import post_api
from .put import put_api
from .post_put import post_put_api
from .delete import delete_api


def montar_api(app: Flask):
    app.register_blueprint(post_api)
    app.register_blueprint(delete_api)
    app.register_blueprint(post_put_api)
    app.register_blueprint(get_api)
    app.register_blueprint(put_api)
