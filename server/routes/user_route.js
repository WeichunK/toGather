const router = require('express').Router();
const { authentication } = require('../../util/util');

const {
    signUp,
    signIn,
    getMemberProfile,
} = require('../controllers/user_cotroller')

router.route('/user/signup').post(signUp);

router.route('/user/signin').post(signIn);

router.route('/user/getmemberprofile').get(authentication(-1), getMemberProfile);

module.exports = router;