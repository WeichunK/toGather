from copyreg import constructor
import datetime
from .user_model import User, Feedback
from application import db
from flask import jsonify
from os import environ, path
from dotenv import load_dotenv
from sqlalchemy.sql import func
import jwt

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


def getUserRating(id):
    try:
        rating = db.session.query(Feedback.host_id, func.avg(Feedback.rating).label(
            'rating')).group_by(Feedback.host_id).having(Feedback.host_id == id).first()
        if not rating:
            return {'user_id': id, 'rating': 0}
        else:
            return {'user_id': rating[0], 'rating': rating[1]}
    except:
        return


def authentication(auth_token):
    payload = jwt.decode(auth_token, environ.get(
        "TOKEN_SECRET"), algorithms=['HS256'])
    user = User.query.filter_by(email=payload['email']).first()
    user = user.authentication
    return user


def getProfile(id):
    user = User.query.filter_by(id=id).first()
    if not user:
        pass
    else:
        user = user.profile
    return user


def updatePhoto(id, s3Path):
    try:
        user = User.query.filter_by(id=id).first()
        user.picture = s3Path
        db.session.commit()
    except Exception:
        db.session.rollback()
        raise
