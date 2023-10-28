const sql = require("mssql")

const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    var request = new sql.Request();

    request.query(`select * from Users where username='${username}' and password='${password}'`, function (err, recordset) {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Database query error' });
        } else {
            if (recordset.recordset.length == 0) {
                res.status(401).json({ "message": "Login not successful" })
            } else {
                res.status(201).json({ userId: recordset.recordset[0].userId })
            }
        }
    })
}

const register = async (req, res) => {
    const { username, email, password } = req.body

    if (!username || !email || !password) return res.status(400).json({ message: "All fields are required" })

    try {
        var request = new sql.Request();

        request.query(`select * from Users where username='${username}'`, (err, recordset) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Database query error' });
            } else {
                if (recordset.recordset.length > 0) {
                    console.log(recordset.recordset)
                    return res.status(401).json({ message: "Duplicate username detected. Change your username" })
                } else {
                    const query = `
                        insert into Users (username, email, password)
                        values(@username, @email, @password)
                    `;

                    request.input('username', sql.NVarChar, username);
                    request.input('email', sql.NVarChar, email);
                    request.input('password', sql.NVarChar, password);

                    request.query(query);

                    return res.status(200).json({ message: "Registration successfull" })
                }
            }
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}

const logout = (req, res) => {
    // I think logout api endpoint is not required.
}

module.exports = {
    login, 
    register,
    logout
}