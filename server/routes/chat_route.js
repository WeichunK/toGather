const router = require('express').Router();
const { authentication } = require('../../util/util');

const {
    writeChatRecord,
    getChatRecord,
    writeSystemRecord,
    getSystemRecord,
} = require('../controllers/chat_controller')

const { USER_ROLE } = require('../models/user_model');

router.route('/chat/writeChatRecord').post(writeChatRecord);

router.route('/chat/getChatRecord').get(getChatRecord);

router.route('/chat/writesystemrecord').post(authentication(USER_ROLE.ALL), writeSystemRecord);

router.route('/chat/getsystemrecord').get(authentication(USER_ROLE.ALL), getSystemRecord);

module.exports = router;