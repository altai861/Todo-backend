const sql = require("mssql")

const getAllTask = (req, res) => {
    const { userId } = req.body
    if (!userId) return res.status(401).json({ message: "userId required" });

    var request = new sql.Request()
    request.query(`select * from Tasks where userId = ${userId}`, function (err, recordset) {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Database query error' });
        } else {
            res.json(recordset.recordset);
        }
    });
}

const getMyDay = (req, res) => {
    const userId = req.query.userId
    if (!userId) return res.status(401).json({ message: "userId required" });

    var request = new sql.Request()
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1 and pad with '0'
    const day = String(now.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    console.log(formattedDate)

    request.query(`select * from Tasks where userId = ${userId} and dueDate = '${formattedDate}'`, function (err, recordset) {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Database query error' });
        } else {
            res.json(recordset.recordset);
        }
    });
}

const getImportantTasks = (req, res) => {
    const userId = req.query.userId
    if (!userId) return res.status(401).json({ message: "userId required" });

    var request = new sql.Request()
    request.query(`select * from Tasks where userId = ${userId} and important = 1`, function (err, recordset) {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Database query error' });
        } else {
            res.json(recordset.recordset);
        }
    });
}

const getPlannedTasks = (req, res) => {
    const userId = req.query.userId
    if (!userId) return res.status(401).json({ message: "userId required" });

    var request = new sql.Request()
    request.query(`select * from Tasks where userId = ${userId} and dueDate is not null`, function (err, recordset) {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Database query error' });
        } else {
            res.json(recordset.recordset);
        }
    });
}

const getListSpecificTasks = (req, res) => {
    const userId = req.query.userId
    const listId = req.query.listId
    if (!userId || !listId) return res.status(401).json({ message: "userId and listId required" });

    var request = new sql.Request()
    request.query(`select * from Tasks where userId = ${userId} and listId = ${listId}`, function (err, recordset) {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Database query error' });
        } else {
            res.json(recordset.recordset);
        }
    });
}


const addTask = (req, res) => {
    const { userId, main, dueDate, completed, important, listId} = req.body
    if (!userId || !main) return res.status(401).json({ message: "userId and maintext are required" });

    //continue
    var request = new sql.Request();

    const query = `
        INSERT INTO Tasks (mainText, dueDate, important, completed, userId, listId)
        VALUES (@mainText, @dueDate, @important, @completed, @userId, @listId)

    `

    request.input('mainText', sql.NVarChar, main);
    request.input("dueDate", sql.Date, dueDate);
    request.input("important", sql.Bit, 1 ? important : 0);
    request.input("completed", sql.Bit, 1 ? completed : 0);
    request.input("userId", sql.Int, userId);
    request.input("listId", sql.Int, listId ? listId : null);

    request.query(query, (err, recordset) => {
        if (err) {
            console.error('Error executing the INSERT query:', err);
            // Handle the error, for example, send an error response to the client
            res.status(500).json({ error: 'Database query error' });
        } else {
            console.log('Task inserted successfully');
            // Send a success response to the client
            res.status(200).json({ message: 'Task inserted successfully' });
        }
    })
}

const updateTask = (req, res) => {
    const { taskId, main, dueDate, completed, important, listId } = req.body;
    if (!taskId) return res.status(401).json({ message: "taskId is required to update the task" });

    var request = new sql.Request();
    
    if (main) {
        request.query(`UPDATE Tasks SET mainText='${main}' WHERE taskId = ${taskId}`, (err, recordset) => {
            if (err) {
                console.error("Error executing the UPDATE query: ", err);
            } else {
                console.log("Records update successfully");
            }
        });
    } if (dueDate) {
        request.query(`UPDATE Tasks SET dueDate='${dueDate}' WHERE taskId = ${taskId}`, (err, recordset) => {
            if (err) {
                console.error("Error executing the UPDATE query: ", err);
            } else {
                console.log("Records update successfully");
            }
        });
    } if (completed) {
        request.query(`UPDATE Tasks SET completed=${completed} WHERE taskId = ${taskId}`, (err, recordset) => {
            if (err) {
                console.error("Error executing the UPDATE query: ", err);
            } else {
                console.log("Records update successfully");
            }
        });
    } if (important) {
        request.query(`UPDATE Tasks SET important=${important} WHERE taskId = ${taskId}`, (err, recordset) => {
            if (err) {
                console.error("Error executing the UPDATE query: ", err);
            } else {
                console.log("Records update successfully");
            }
        });
    } if (listId) {
        request.query(`UPDATE Tasks SET listId=${listId} WHERE taskId = ${taskId}`, (err, recordset) => {
            if (err) {
                console.error("Error executing the UPDATE query: ", err);
            } else {
                console.log("Records update successfully");
            }
        });
    }
    return res.status(201).json({ message: "Updated task successfully" });
    
}

const deleteTask = (req, res) => {
    const taskId = req.query.taskId;
    if (!taskId) return res.status(401).json({ message: "taskId is required to delete" });

    var request = new sql.Request();

    request.query(`DELETE FROM Tasks WHERE taskId = ${taskId}`, (err, recordset) => {
        if (err) {
            console.error("Error occured while deleting: ", err);
            return res.status(400).json({ message: "Deletion Error" });
        } else {
            return res.status(201).json({ message: "Deletion successFul" });
        }
    })

}

module.exports = {
    getAllTask,
    getMyDay,
    getImportantTasks,
    getPlannedTasks,
    getListSpecificTasks,
    addTask,
    updateTask,
    deleteTask
}