const http = require("http");
const port = process.env.PORT || 8888;
const express = require("express");

const app = express();
const bodyParser = require("body-parser");
app.use(express.static(__dirname + "/public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const mysql = require("mysql");

const db_config = {
  host: "us-cdbr-iron-east-03.cleardb.net",
  user: "b6e2d3b479dd3a",
  password: "479b1fef",
  database: "heroku_2a416302c5d7af7"
};

let connection;

function handleDisconnect() {
  connection = mysql.createConnection(db_config);
  connection.connect(function(err) {
    if (err) {
      console.log("error when connecting to db:", err);
      setTimeout(handleDisconnect, 2000);
    }
  });
  connection.on("error", function(err) {
    console.log("db error", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      handleDisconnect();
    } else {
    }
  });
}

handleDisconnect();

app.get("/", function(req, res) {
  // GENERATE TABLES
  var sql =
    "CREATE TABLE IF NOT EXISTS leaderboard (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255),score INT)";
  connection.query(sql, function(err, result) {
    if (err) throw err;
    console.log("Table leaderboard created");
  });

  res.sendFile(__dirname + "/public/html/index.html");
});

app.post("/submitscore", function(req, res) {
  let username = req.body.name;
  let score = req.body.score;

  connection.query(
    "INSERT INTO leaderboard SET ?",
    { name: username, score: score },
    function(err, result) {
      if (err) throw err;
      console.log("Score has been saved for " + username);
    }
  );

  res.send("Score has been Stored");
});

app.get("/leaderboard", function(req, res) {
  connection.query(
    "SELECT * FROM leaderboard ORDER BY score DESC LIMIT 5",
    function(err, result, fields) {
      if (err) throw err;
      console.log(result);
      res.send(result);
    }
  );
});

var server = app.listen(port, function() {
  let host = server.address().address;
  let port = server.address().port;

  console.log("App listening at http://%s:%s", host, port);
  console.log("Connected to Database...");
});
