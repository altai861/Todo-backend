require('dotenv').config();
var express = require('express');
var app = express();
var sql = require("mssql");
const { logger } = require("./middleware/logger")
const path = require("path");

var dbConnected = false

// Config for your database
var config = {
    user: process.env.database_user,
    password: process.env.database_password,
    server: process.env.database_server, 
    database: process.env.database_name,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

// Connect to the database when the server starts
sql.connect(config, function (err) {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to the database');
        dbConnected = true;
    }
});

// Middleware to ensure database connection is established before handling requests
app.use(function (req, res, next) {
    if (dbConnected) {
        return next();
    } else {
        res.status(500).json({ error: 'Database connection not established' });
    }
});

app.use(logger);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/", require('./routes/root.js'));
app.use("/auth", require("./routes/authRoutes.js"))
app.use("/tasks", require("./routes/taskRoutes.js"))
app.use("/lists", require("./routes/listRoutes.js"))

var server = app.listen(3500, function () {
    console.log('Server is running on port 3500');
});
