const router = require('express').Router();
// const { wrapAsync } = require('../../util/util');

const {
    getGatherings,
    getGatheringDetail,
} = require('../controllers/gathering_controller');

// router.route('/getgatherings/:category')
router.route('/getgatherings/:category')
    .get(getGatherings);
// .get(wrapAsync(getGatherings));

router.route('/getgatheringDetail')
    .get(getGatheringDetail);


// router.route('/user/signin')
//     .post(wrapAsync(signIn));

// router.route('/user/profile')
//     .get(authentication(), wrapAsync(getUserProfile));

module.exports = router;
