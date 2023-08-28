const express = require("express");
const { protect } = require("../middleware/protect");
const { accessChat, fetchChats, createGroup, renameGroup, addMember, removeMember } = require("../Controllers/chatController")

const router = express.Router();

router.route("/access_chat").post(protect, accessChat);
router.route("/fetch_chats").get(protect, fetchChats);
router.route("/create_group").post(protect, createGroup);
router.route("/rename_group").put(protect, renameGroup);
router.route("/remove_member").put(protect, removeMember);
router.route("/add_member").put(protect, addMember);

module.exports = router;
