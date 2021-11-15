const router = require('express').Router();
const { authentication, upload } = require('../../util/util');
const cpUpload = upload.fields([
    { name: 'main_image', maxCount: 1 },
]);


const {
    signUp,
    signIn,
    getMemberProfile,
    getProfile,
    getUserRating,
    updatePhoto,
} = require('../controllers/user_cotroller')

const {
    USER_ROLE
} = require('../models/user_model');

router.route('/user/signup').post(signUp);

router.route('/user/signin').post(signIn);

router.route('/user/getmemberprofile').get(authentication(USER_ROLE.ALL), getMemberProfile);

router.route('/user/getprofile').get(authentication(USER_ROLE.FREE), getProfile);


router.route('/user/getuserrating').get(authentication(USER_ROLE.ALL), getUserRating);

router.route('/user/updatephoto')
    .post(authentication(USER_ROLE.ALL), cpUpload, updatePhoto);


module.exports = router;