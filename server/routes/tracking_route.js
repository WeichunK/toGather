const router = require('express').Router();
const { authentication } = require('../../util/util');
// const { wrapAsync } = require('../../util/util');

const { setTracking } = require('../controllers/tracking_controller');

const { USER_ROLE } = require('../models/user_model');

router.route('/tracking/:category')
    .get(authentication(USER_ROLE.FREE), setTracking);

module.exports = router;
