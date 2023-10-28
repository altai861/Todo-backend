const express = require("express")
const router = express.Router();
const taskControllers = require("../controllers/taskControllers");

router.route("/")
    .get(taskControllers.getAllTask)

router.route("/myday")
    .get(taskControllers.getMyDay)
    
router.route("/important")
    .get(taskControllers.getImportantTasks)

router.route("/planned")
    .get(taskControllers.getPlannedTasks)

router.route("/listSpecific")
    .get(taskControllers.getListSpecificTasks)

router.route("/")
    .post(taskControllers.addTask)

router.route("/")
    .patch(taskControllers.updateTask)

router.route("/")
    .delete(taskControllers.deleteTask)

module.exports = router;
