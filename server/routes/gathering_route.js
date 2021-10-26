const router = require('express').Router();
const { authentication, upload, s3UploadFile } = require('../../util/util');
// const { wrapAsync } = require('../../util/util');

const cpUpload = upload.fields([
    { name: 'main_image', maxCount: 1 },
]);


const {
    getGatherings,
    // getGatheringDetail,
    hostGathering,
    joinGathering,

} = require('../controllers/gathering_controller');

const {
    USER_ROLE
} = require('../models/user_model');

// router.route('/getgatherings/:category')
router.route('/getgatherings/:category')
    .get(getGatherings);
// .get(wrapAsync(getGatherings));

// router.route('/getgatheringDetail')
//     .get(getGatheringDetail);

router.route('/getgatherings/hostGathering')
    .post(authentication(USER_ROLE.ALL), cpUpload, hostGathering);


router.route('/getgatherings/joinGathering')
    .post(authentication(USER_ROLE.ALL), joinGathering);
// router.route('/user/signin')
//     .post(wrapAsync(signIn));

// router.route('/user/profile')
//     .get(authentication(), wrapAsync(getUserProfile));

module.exports = router;
