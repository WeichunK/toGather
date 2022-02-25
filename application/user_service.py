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

    if (check_result):
        accessToken = user.encode_auth_token
        user.access_token = accessToken
        user.access_expired = environ.get("TOKEN_EXPIRE")
        user.login_at = datetime.datetime.now()
        user.popularity += 1

        user = jsonify(data=user.signinResult)

    db.session.commit()

    return user


def signup(name, email, password, provider, role):
    try:
        db.session.begin()
        user = User.query.filter_by(email=email).first()
        if not user:
            new_user = User(
                email=email,
                name=name,
                picture=environ.get("DEFAULT_PICTURE"),
                role=role,
                provider=provider,
                popularity=int(environ.get("DEFAULT_POPULARITY")),
                password=password,
                login_at=datetime.datetime.utcnow()
            )

            new_user.password = new_user.password_hash
            accessToken = new_user.encode_auth_token
            new_user.access_token = accessToken
            new_user.access_expired = environ.get("TOKEN_EXPIRE")

            db.session.add(new_user)
            db.session.flush()
            db.session.commit()

            return jsonify(data=new_user.signinResult)
        else:
            return {'error': 'This Email Already Exists'}
    except Exception:
        db.session.rollback()
        raise
