from application import db, flask_bcrypt
import jwt
from sqlalchemy.dialects.mysql import BIGINT
from os import environ, path
from dotenv import load_dotenv

basedir = path.abspath(path.dirname(__file__))
load_dotenv(path.join(basedir, ".env"))


class User(db.Model):
    """ User Model for storing user related details """
    __tablename__ = "member"

    id = db.Column(BIGINT(unsigned=True), primary_key=True, autoincrement=True)
    email = db.Column(db.TEXT)
    name = db.Column(db.String(255))
    picture = db.Column(db.TEXT)
    role = db.Column(db.String(30))
    provider = db.Column(db.String(15))
    popularity = db.Column(BIGINT(unsigned=True))
    password = db.Column(db.String(255))
    access_token = db.Column(db.String(1000))
    access_expired = db.Column(BIGINT(unsigned=True))
    login_at = db.Column(db.DateTime)

    @property
    def signinResult(self):
        return {
            'access_token': self.access_token,
            'access_expired': self.access_expired,
            'login_at': self.login_at,
            'user': {
                'id': self.id,
                'provider': self.provider,
                'name': self.name,
                'email': self.email,
                'picture': self.picture,
                'bonus': True
            }
        }

    @property
    def authentication(self):
        return {
            'id': self.id,
            'provider': self.provider,
            'name': self.name,
            'email': self.email
        }

    @property
    def password_hash(self):
        return flask_bcrypt.generate_password_hash(
            self.password).decode('utf-8')

    def check_password(self, password: str) -> bool:
        return flask_bcrypt.check_password_hash(self.password, password)

    @property
    def encode_auth_token(self):
        try:
            payload = {
                'provider': self.provider,
                'name': self.name,
                'email': self.email,
                'picture': self.picture,
                'expiresIn': environ.get("TOKEN_EXPIRE")
            }
            return jwt.encode(
                payload,
                environ.get("TOKEN_SECRET"),
                algorithm='HS256'
            )
        except Exception as e:
            return e

    def __repr__(self):
        return "<User '{}'>".format(self.name)


class Feedback(db.Model):
    """ Feedback Model for storing feedback related details """
    __tablename__ = "feedback"

    gathering_id = db.Column(BIGINT(unsigned=True))
    host_id = db.Column(BIGINT(unsigned=True))
    user_id = db.Column(BIGINT(unsigned=True), primary_key=True)
    rating = db.Column(db.Integer)
    comment = db.Column(db.TEXT)
    created_at = db.Column(db.DateTime, primary_key=True)

    def __repr__(self):
        return "<Rating '{}'>".format(self.rating)
