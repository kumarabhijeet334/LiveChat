const express = require("express");
const {registerUser, loginUser, findUser, getUsers, allUsers} = require("../Controllers/userController")
const router = express.Router();
const { protect } = require("../middleware/protect");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/find/:userId", findUser);
router.route("/allusers").get(protect, allUsers);
router.get("/getusers", getUsers);

module.exports = router;
