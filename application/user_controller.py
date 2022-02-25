from flask import Blueprint, request
from .user_service import signin, signup
import re
from os import environ, path
from dotenv import load_dotenv
from email_validator import validate_email

basedir = path.abspath(path.dirname(__file__))
load_dotenv(path.join(basedir, ".env"))
userRoute = Blueprint('userRoute', __name__)


@userRoute.route('/signin', methods=["POST"])
def signinRoute():
    data = request.get_json()
    try:
        email = data['email']
        password = data['password']
    except:
        return {'error': 'Wrong Request'}, 403
    user = signin(email, password)
    if not user:
        return {'error': 'Wrong Request'}, 403
    else:
        return user


@userRoute.route('/signup', methods=["POST"])
def signupRoute():
    data = request.get_json()
    try:
        name = data['name']
        email = data['email']
        password = data['password']
    except:
        return {'error': 'lack of name or email or password'}, 400

    try:
        validate_email(email)
    except:
        return {'error': 'invalid email format'}, 400

    check_chinese = re.compile(u'[\u4e00-\u9fa5]+')
    match = check_chinese.search(name)
    if match:
        namelength = len(name)*2
    else:
        namelength = len(name)
    if namelength > int(environ.get("LIMIT_FOR_SIGNUP_NAME")):
        return {'error': 'Exceed the length limit!'}, 400

    role = 1
    provider = 'native'

    user = signup(name, email, password, provider, role)

    try:
        return {'error': user['error']}, 403
    except:
        return user
