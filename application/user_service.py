import datetime
from .user_model import User
from application import db
from flask import jsonify
from os import environ, path
from dotenv import load_dotenv

basedir = path.abspath(path.dirname(__file__))
load_dotenv(path.join(basedir, ".env"))


def signin(email, password):
    user = User.query.filter_by(email=email).first()
    if not user:
        return user
    check_result = user.check_password(password=password)

    print('check_result', check_result)
    if (check_result):
        accessToken = user.encode_auth_token
        user.access_token = accessToken
        user.access_expired = environ.get("TOKEN_EXPIRE")
        user.login_at = datetime.datetime.now()
        user.popularity += 1

        user = jsonify(data=user.signinResult)

    db.session.commit()

    return user
