const sql = require("mssql")

const getAllLists = (req, res) => {
    const { userId } = req.body;
    if (!userId) return res.status(401).json({ message: "userId requried" })

    var request = new sql.Request()
    request.query(`select * from Lists where userId = ${userId}`, function (err, recordset) {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Database query error' });
        } else {
            res.json(recordset.recordset);
        }
    });
}

const addList = (req, res) => {
    const { userId, name } = req.body;

    if (!userId || !name) return res.status(401).json({ message: "userId and name required to create a new list" });

    //continue
    var request = new sql.Request();

    request.query(`INSERT INTO Lists (listname, userId) VALUES ('${name}', ${userId})`, (err, recordset) => {
        if (err) {
            console.error("Error occured during list insertion: ", err);
            res.status(401).json({ message: "Error occured to insert to Lists" });
        } else {
            res.status(201).json({ message: "List added successfully" });
        }
    })
}

const updateList = (req, res) => {
    const { userId, listId, name } = req.body;
    if (!userId || !listId) return res.status(401).json({ message: "userId and listId required" });

    //continue
    if (name) {
        var request = new sql.Request();
        request.query(`UPDATE Lists SET name = '${name}' WHERE listId = ${listId}`, (err, recordset) => {
            if (err) {
                console.error("Error occured during list update: ", err);
            } else {
                console.log("Updated successfully");
            }
        })
    }
    res.status(201).json({ message: "Updated successfully" });
}

const deleteList = (req, res) => {
    const { userId, listId } = req.body;
    if (!userId || !listId) return res.status(401).json({ message: "userId and listId are required to delete" });

    var request = new sql.Request();

    request.query(`DELETE FROM Lists WHERE listId = ${listId}`, (err, recordset) => {
        if (err) {
            console.error("Error while deleting list:", err);
            res.status(401).json({ message: "Deletion unsuccessful" });
        } else {
            res.status(202).json({ message: 'Deleted successfully' });
        }
    })
}

module.exports = {
    getAllLists,
    addList,
    updateList,
    deleteList
}