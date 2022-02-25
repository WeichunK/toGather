from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from .config import config

db = SQLAlchemy()
flask_bcrypt = Bcrypt()


def create_app(config_name):
    app = Flask(__name__)
    app.config.from_object(config['development'])
    db.init_app(app)
    flask_bcrypt.init_app(app)

    @app.route('/')
    def index():
        return 'Welcome to Flask Server'
    from .user_controller import userRoute
    app.register_blueprint(userRoute, url_prefix='/api/1.0/user')

    return app
