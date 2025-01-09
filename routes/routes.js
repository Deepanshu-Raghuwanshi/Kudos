const express = require("express");
const router = express.Router();
const {
  createKudos,
  getKudos,
  handleKudoLike,
} = require("../controllers/kudos.controller");
const { saveUserName, getUsers } = require("../controllers/user.controller");
console.log(222);
// router.get("/", getAllAdmins);

router.post("/users", saveUserName);
router.get("/users", getUsers);

router.post("/kudos", createKudos);
router.get("/kudos", getKudos);

router.patch("/kudo/like", handleKudoLike);

// router.get("/search", getAdminDataByEmail);

module.exports = router;
