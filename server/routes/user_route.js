const router = require('express').Router();
const { authentication } = require('../../util/util');

const {
    signUp,
    signIn,
    getMemberProfile,
    getUserRating,
} = require('../controllers/user_cotroller')

const {
    USER_ROLE
} = require('../models/user_model');

router.route('/user/signup').post(signUp);

router.route('/user/signin').post(signIn);

router.route('/user/getmemberprofile').get(authentication(USER_ROLE.ALL), getMemberProfile);

router.route('/user/getuserrating').get(authentication(USER_ROLE.ALL), getUserRating);




module.exports = router;