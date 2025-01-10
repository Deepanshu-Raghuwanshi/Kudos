const express = require("express");
const router = express.Router();
const {
  createKudos,
  getKudos,
  handleKudoLike,
  getAnalyticsData,
} = require("../controllers/kudos.controller");
const { saveUserName, getUsers } = require("../controllers/user.controller");

// Users route
router.post("/users", saveUserName);
router.get("/users", getUsers);

// Kudos route
router.get("/kudos", getKudos);
router.get("/kudo/analytics", getAnalyticsData);
router.post("/kudos", createKudos);
router.patch("/kudo/like", handleKudoLike);

module.exports = router;
