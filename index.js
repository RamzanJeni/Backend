const express = require("express");
const cors = require("cors");
const app = express();
const sql = require("mssql");
const { query } = require("express");

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

//get all the information of universities
app.post("/searchUniversity", (req, res) => {
    console.log("inside searchUniversity function")
    const getData = {
        universityType: req.body.universityType,
        universityName: req.body.universityName,
        program: req.body.program,
    }

    var name = req.body.universityName;
    console.log(name);

    console.log(JSON.stringify(getData));

    sql.connect(config).then(pool => {
        // Query
        var request = new sql.Request();
        var sqlQuery = "SELECT * FROM searchUniversity where name='" + name + "'";
        request.query(sqlQuery, function (err, recordset) {
            if (err) {
                console.log("Query error is: " + err);
            } else {
                res.send(recordset);
                console.log(recordset);
                console.log('data sent');
            }
        });
    })

});

//get the universities names
app.get("/getSearchedData", (req, res) => {

    console.log("Inside get method");
    sql.connect(config).then(pool => {

        var request = new sql.Request();
        var sqlQuery = "SELECT * FROM searchUniversity";
        request.query(sqlQuery, function (err, data) {

            if (err) {
                console.log(err);
            } else {
                
                var uniNames = '';
                var len = data.recordsets.length;
                for (var i = 0; i < len; i++) {
                    for (var j = 0;j < 7;j++) {
                        uniNames += '<option>' + data.recordsets[i][j].name + '</option>';
                    }
                }
                res.send(uniNames);
            }
        })
    })
})

//get university comparison data
app.post("/getComparison", (req, res) => {

    sql.connect(config).then(pool => {
        var request = new sql.Request();
        var sqlQuery = "Select * from Comparison";
        request.query(sqlQuery, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                console.log("success");
                res.send(data);
            }
        })
    })
})

var server = app.listen(5000, function () {

    console.log('Server is running on port 5000...');
});
