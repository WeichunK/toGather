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
    postFeedback,
    getComment,

} = require('../controllers/gathering_controller');

const {
    USER_ROLE
} = require('../models/user_model');

router.route('/getgatherings/:category')
    .get(authentication(USER_ROLE.FREE), getGatherings);

router.route('/gatherings/hostgathering')
    .post(authentication(USER_ROLE.ALL), cpUpload, hostGathering);

router.route('/gatherings/attendGathering/:action')
    .get(authentication(USER_ROLE.ALL), attendGathering);

router.route('/gatherings/removeparticipantadmin')
    .get(authentication(USER_ROLE.ALL), removeParticipantAdmin);

router.route('/gatherings/feedback')
    .post(authentication(USER_ROLE.ALL), postFeedback);

router.route('/gatherings/getcomment')
    .get(authentication(USER_ROLE.FREE), getComment);

module.exports = router;
