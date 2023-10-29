const express = require("express");
const router = express.Router();
const path = require("path");
var sql = require("mssql");

router.get('/', (req, res) => {
    var request = new sql.Request();
       
    // Query the database and get the records
    request.query('select * from Tasks where userId=1', function (err, recordset) {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Database query error' });
        } else {
            res.json(recordset.recordset);
        }
    });
})

module.exports = router;