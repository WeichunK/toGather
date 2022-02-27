from flask import Blueprint, request
from .user_service import signin, signup, getUserRating, authentication, getProfile, updatePhoto
import re
from os import environ, path
from dotenv import load_dotenv
from email_validator import validate_email
from .config import S3_LOCATION, S3_BUCKET, S3_KEY, S3_SECRET
from werkzeug.utils import secure_filename
import boto3

ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])

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


@userRoute.route('/getmemberprofile', methods=["GET"])
def getMemberProfileRoute():
    auth_token = request.headers['Authorization']
    auth_token = auth_token.replace('Bearer ', '')
    user = authentication(auth_token)
    return {'data': user}


@userRoute.route('/getprofile', methods=["GET"])
def getProfileRoute():
    userId = request.args.get('id')
    user = getProfile(userId)
    return {'data': user}


@userRoute.route('/getuserrating', methods=["GET"])
def getUserRatingRoute():
    if not request.args.get('id'):
        auth_token = request.headers['Authorization'].replace('Bearer ', '')
        user = authentication(auth_token)
        userId = user['id']
    else:
        userId = request.args.get('id')
    try:
        rating = getUserRating(userId)
        return {'data': rating}
    except Exception as e:
        return {'error': e}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS


s3 = boto3.client(
    "s3",
    aws_access_key_id=S3_KEY,
    aws_secret_access_key=S3_SECRET
)


def upload_file_to_s3(file, bucket_name, filename, acl='public-read', prefix='img/member/'):
    try:
        s3.upload_file(file, bucket_name, prefix+filename, ExtraArgs={
            'ACL': acl})
    except Exception as e:
        print("upload file {} failed! {}".format(filename, e))
    return "https://{}.s3.{}.amazonaws.com/{}".format(bucket_name, S3_LOCATION, prefix+filename)


@userRoute.route('/updatephoto', methods=["POST"])
def updatePhotoRoute():
    file = request.files['main_image']
    if file and allowed_file(file.filename):
        try:
            filename = secure_filename(file.filename)
            saveFolder = path.join(basedir, '../public/assets/member')
            resultPath = path.join(saveFolder, filename)
            file.save(resultPath)
            s3Path = upload_file_to_s3(resultPath, S3_BUCKET, filename)
            auth_token = request.headers['Authorization'].replace(
                'Bearer ', '')
            user = authentication(auth_token)
            updateResult = updatePhoto(user['id'], s3Path)
            return {'data': {'photo': s3Path}}
        except Exception as e:
            return {'error': e}, 400

    else:
        return {'error': 'invalid file'}, 400
