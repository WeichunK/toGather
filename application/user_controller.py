
from flask import Blueprint, request
from .user_service import signin

userRoute = Blueprint('userRoute', __name__)


@userRoute.route('/signin', methods=["POST"])
def signinRoute():
    data = request.get_json()
    email = data['email']
    password = data['password']
    user = signin(email, password)
    if not user:
        return {'error': 'Wrong Request'}, 403
    else:
        return user
