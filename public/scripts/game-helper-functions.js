function updateHeaderTiles() {
  document.getElementById("header-tiles").innerHTML = "TILES " + answer_count;
}

function updateHeaderLives() {
  document.getElementById("header-lives").innerHTML = "LIVES " + globl_lives;
}

function updateHeaderScore() {
  document.getElementById("header-score").innerHTML = "SCORE " + globl_score;
}

function startRound() {
  updateHeaderLives();
  updateHeaderTiles();
  updateHeaderScore();
  generateMatrix();
  setTimeout(rotateBoard, 2000);
}

function replaceStartBtn() {
  let terminateButton = document.createElement("button");
  terminateButton.className = "btn btn-danger btn-lg";
  terminateButton.innerHTML = buttonTextTerminate;
  terminateButton.id = "btn-terminate";
  terminateButton.onclick = terminateUserSession;

  let startButton = document.getElementById("btn-start");
  document
    .getElementById("btn-start")
    .parentNode.replaceChild(terminateButton, startButton);
}

function replaceTerminateBtn() {
  let restartButton = document.createElement("button");
  restartButton.className = "btn btn-success btn-lg";
  restartButton.innerHTML = buttonTextRestart;
  restartButton.id = "btn-start";
  restartButton.onclick = startGame;

  let terminateButton = document.getElementById("btn-terminate");

  document
    .getElementById("btn-terminate")
    .parentNode.replaceChild(restartButton, terminateButton);
}
