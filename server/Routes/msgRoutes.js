const express = require('express');
const router = express.Router();
const { protect } = require("../middleware/protect");
const { sendMsg, allMsgs } = require("../Controllers/msgControllers");

router.route('/send').post(protect, sendMsg);
router.route('/:chatId').get(protect, allMsgs);

module.exports = router;

