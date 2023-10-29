const express = require("express")
const router = express.Router();
const taskControllers = require("../controllers/taskControllers");
const sql = require("mssql");

//router.route("/").get(taskControllers.getAllTask)
router.get("/", (req, res) => {
    const userId = req.query.userId;
    if (!userId) return res.status(401).json({ message: "UserId is required sds" });

    var request = new sql.Request()
    request.query(`select * from Tasks where userId = ${userId}`, function (err, recordset) {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Database query error' });
        } else {
            res.json(recordset.recordset);
        }
    });
})

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
