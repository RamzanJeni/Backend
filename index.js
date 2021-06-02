const express = require("express");
const cors = require("cors");
const app = express();
const sql = require("mssql");

// configuring database
var config = {
    server: 'localhost',
    user: 'sa',
    password: 'root',
    database: 'SACS',
    options: {
        encrypt: false,
        trustServerCertificate: false
    }
};

app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.get("/searchUniversity", function (req, res) {
    console.log("inside searchUniversity function")
    const getData = {
        universityType: req.body.universityType,
        universityName: req.body.universityName,
        program: req.body.program,
    }

    console.log(JSON.stringify(getData));

    sql.connect(config).then(pool => {
        // Query
        var request = new sql.Request();
        request.query('select * from University', function (err, recordset) {
            if (err) {
                console.log("Query error is: " + err);
            } else {
                res.send(recordset);
                console.log('data sent');
            }
        });
    })

});


var server = app.listen(5000, function () {

    console.log('Server is running on port 5000...');
});
