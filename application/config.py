from os import environ, path
from dotenv import load_dotenv

basedir = path.abspath(path.dirname(__file__))
load_dotenv(path.join(basedir, ".env"))


class BaseConfig:  # 基本配置
    SECRET_KEY = environ.get("SECRET_KEY")
    DEBUG = False


class DevelopmentConfig(BaseConfig):
    DEBUG = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = environ.get("SQLALCHEMY_DATABASE_URI")


config = dict(
    development=DevelopmentConfig
)

key = BaseConfig.SECRET_KEY
HOST = environ.get("APPLICATION_HOST")
PORT = int(environ.get("APPLICATION_PORT"))
