const router = require('express').Router();
const { authentication } = require('../../util/util');

const {
    writeChatRecord,
    getChatRecord,
} = require('../controllers/chat_cotroller')

const {
    USER_ROLE
} = require('../models/user_model');

router.route('/chat/writeChatRecord').post(writeChatRecord);

router.route('/chat/getChatRecord').get(getChatRecord);

// router.route('/user/getmemberprofile').get(authentication(USER_ROLE.ALL), getMemberProfile);

module.exports = router;