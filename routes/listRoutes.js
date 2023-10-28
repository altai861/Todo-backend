const express = require("express");
const router = express.Router();
const listControllers = require("../controllers/listControllers.js")

router.route("/")
    .get(listControllers.getAllLists)

router.route("/")
    .post(listControllers.addList)

router.route("/")
    .patch(listControllers.updateList)

router.delete(listControllers.deleteList)

module.exports = router;