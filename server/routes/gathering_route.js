const router = require('express').Router();
const { authentication, upload } = require('../../util/util');
// const { wrapAsync } = require('../../util/util');

const cpUpload = upload.fields([
    { name: 'main_image', maxCount: 1 },
]);


const {
    getGatherings,
    // getGatheringDetail,
    hostGathering,
    attendGathering,
    removeParticipantAdmin,
    postFeedback

} = require('../controllers/gathering_controller');

const {
    USER_ROLE
} = require('../models/user_model');

// router.route('/getgatherings/:category')
router.route('/getgatherings/:category')
    .get(authentication(USER_ROLE.FREE), getGatherings);
// .get(wrapAsync(getGatherings));

// router.route('/getgatheringDetail')
//     .get(getGatheringDetail);

router.route('/gatherings/hostGathering')
    .post(authentication(USER_ROLE.ALL), cpUpload, hostGathering);


router.route('/gatherings/attendGathering/:action')
    .get(authentication(USER_ROLE.ALL), attendGathering);


router.route('/gatherings/removeparticipantadmin')
    .get(authentication(USER_ROLE.ALL), removeParticipantAdmin);


router.route('/gatherings/feedback')
    .post(authentication(USER_ROLE.ALL), postFeedback);
// router.route('/user/signin')
//     .post(wrapAsync(signIn));

// router.route('/user/profile')
//     .get(authentication(), wrapAsync(getUserProfile));

module.exports = router;
