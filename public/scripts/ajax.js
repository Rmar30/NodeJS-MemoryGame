function retrieveLeaderBoard() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      let leaderboard_list = JSON.parse(this.responseText);
      let leaderboard = document.getElementById("leaderboard");

      let user_entry = document.createElement("h2");
      user_entry.id = "user-review";
      user_entry.innerHTML =
        "<b>Name: </b>" +
        username +
        '<span id="user-score"><b>Score: </b></span>' +
        userscore;

      leaderboard.appendChild(user_entry);

      let table = document.createElement("table");
      table.id = "leaderboard-table";

      for (let i = 0; i < leaderboard_list.length; i++) {
        let row = document.createElement("tr");
        let name = document.createElement("td");
        let score = document.createElement("td");

        name.innerHTML = "<b>Name: </b>" + leaderboard_list[i].name;
        score.innerHTML = "<b>Score: </b>" + leaderboard_list[i].score;

        row.appendChild(name);
        row.appendChild(score);

        table.appendChild(row);
      }

      leaderboard.appendChild(table);
    }
  };
  xhttp.open("GET", "leaderboard", true);
  xhttp.send();
}

function sendScore() {
  username = document.getElementById("username").value;
  userscore = globl_score;

  // USERNAME MUST BE FILLED OUT
  if (username != "") {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log(this.responseText);
        loadLeaderBoardView();
      }
    };
    xhttp.open("POST", "submitscore", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("name=" + username + "&score= +" + globl_score);
  }
}
