function terminateUserSession() {
  if (globl_lives == 0) {
    loadSummaryView();
  } else {
    response = prompt(promptTerminateSession);
    if (response.toLowerCase() == "yes") {
      loadSummaryView();
    }
  }
}

function loadSummaryView() {
  // CLEAR DISPLAY
  let emptyTable = $('<table id="matrix"></table>');
  $("#matrix").replaceWith(emptyTable);
  let emptyLeaderBoard = $('<div id="leaderboard"></div>');
  $("#leaderboard").replaceWith(emptyLeaderBoard);

  $("#summary").append("<h1>" + headerTextSummary + "</h1>");
  $("#summary").append("<h5><b>Score: &nbsp;</b>" + globl_score + "</h5>");
  $("#summary").css("display", "inline-block");

  let labelName = document.createElement("label");
  let inputName = document.createElement("input");

  labelName.innerHTML = "Name:";
  inputName.setAttribute("type", "text");
  inputName.id = "username";
  inputName.style.margin = "auto auto auto 5%";

  let submitButton = document.createElement("button");
  submitButton.className = "btn btn-primary btn-md";
  submitButton.innerHTML = buttonTextSubmit;
  submitButton.id = "btn-submit";

  submitButton.onclick = sendScore;

  $("#summary").append(labelName);
  $("#summary").append(inputName);
  $("#summary").append(submitButton);

  replaceTerminateBtn();
}

function loadLeaderBoardView() {
  let emptyTable = $('<table id="matrix"></table>');
  $("#matrix").replaceWith(emptyTable);
  let emptySummary = $('<div id="summary"></div>');
  $("#summary").replaceWith(emptySummary);

  $("#leaderboard").append("<h1>" + headerTextLeaderboard + "</h1>");
  $("#leaderboard").css("display", "inline-block");

  retrieveLeaderBoard();
}

function generateMatrix() {
  // GENERATE ANSWER LIST TO BASE MATRIX OFF OF
  generateAnswerList();
  let matrixAnswerListIndex = 0;

  // CREATE MATRIX TABLE
  let table = document.createElement("table");
  table.id = "matrix";
  table.class = "table";
  for (let i = 0; i < matrix_row_count; i++) {
    let tr = document.createElement("tr");
    table.appendChild(tr);

    for (let j = 0; j < matrix_col_count; j++) {
      let td = $("<td><div>&nbsp;</div></td>").data(
        "object",
        matrix_answer_list[matrixAnswerListIndex]
      );

      let isAnswer = $(td).data("object").answer;
      if (isAnswer) {
        td.addClass("tile-selected-correct");
        td.html(
          '<div class="text-rotation">' +
            matrix_answer_list[matrixAnswerListIndex].value +
            "</div>"
        );
      }
      $(tr).append(td);
      matrixAnswerListIndex++;
    }
  }

  $("#matrix").replaceWith(table);
  $("#matrix").css("height", $("#matrix").width());
}

function rotateBoard() {
  audio_rotate.play();
  $("#matrix").addClass("board-rotate");
  $(".text-rotation").addClass("text-rotate");

  // HIDE VALUE AFTER ROTATION COMPLETE
  setTimeout(hideNumbers, 2000);
}

function hideNumbers() {
  $("td").removeClass("tile-selected-correct");
  $("td").html("<div>&nbsp;</div>");
  $("td").click(selectTile);
}

function selectTile() {
  let isAnswer = $(this).data("object").answer;
  let value = $(this).data("object").value;

  // CHECK INDIVIDUAL TILE
  if (isAnswer) {
    audio_correct.play();
    correct_answers++;

    // ROUND COMPLETE
    if (correct_answers == answer_count) {
      $(this).addClass("tile-final-correct");
      $(this)
        .children("div")
        .addClass("text-rotate-fixed");
      $(this)
        .children("div")
        .text("O");
      $("td").unbind("click");

      // APPLY ROUND BONUS
      globl_score += 1 + ROUND_BONUS;
    } else {
      $(this).addClass("tile-selected-correct");
      $(this)
        .children("div")
        .addClass("text-rotate-fixed");
      $(this)
        .children("div")
        .text(value);
      globl_score += 1;
    }

    // APPLY BONUS IF ORDER MATCHES NUMBER
    if (correct_answers == value && next_num == value) {
      globl_score += value;
      next_num++;
    }
    updateHeaderScore();
    $(this).unbind("click");

    // CHECK AND PROCESS ROUND COMPLETION
    processRoundComplete();
  } else {
    // PROCESS WRONG ANSWER
    processWrongAnswer(this);
  }
}

function processWrongAnswer(selection) {
  $("td").unbind("click");
  audio_wrong.play();
  globl_lives--;
  $(selection).addClass("tile-wrong");
  $(selection)
    .children("div")
    .addClass("text-rotate-fixed");
  $(selection)
    .children("div")
    .text("X");
  updateHeaderLives();

  if (answer_count > 1) {
    answer_count--;
  } else if (
    matrix_row_count > MIN_LIMIT_ROW ||
    matrix_col_count > MIN_LIMIT_COL
  ) {
    if (matrix_row_count > MIN_LIMIT_ROW) {
      matrix_row_count--;
    } else if (matrix_col_count > MIN_LIMIT_COL) {
      matrix_col_count--;
    }
  }
  correct_answers = 0;

  if (globl_lives == 0) {
    terminateUserSession();
  } else {
    setTimeout(startRound, 1500);
  }
}

function processRoundComplete() {
  if (correct_answers == answer_count) {
    next_num = 1;
    let answer_limit = Math.floor(matrix_total_tiles * 0.5);

    // INCREASE ANSWER COUNT
    if (answer_count < answer_limit) {
      answer_count++;

      // INCREASE NUMBER OF ROWS OR COLS
    } else if (
      !(matrix_row_count == MAX_LIMIT_ROW && matrix_col_count == MAX_LIMIT_COL)
    ) {
      if (matrix_row_count < MAX_LIMIT_ROW && toggleRowCol) {
        matrix_row_count++;
        toggleRowCol = !toggleRowCol;
      } else if (matrix_col_count < MAX_LIMIT_COL) {
        matrix_col_count++;
        toggleRowCol = !toggleRowCol;
      }
    }

    correct_answers = 0;
    setTimeout(startRound, 1500);
  }
}

function generateAnswerList() {
  matrix_total_tiles = matrix_row_count * matrix_col_count;
  matrix_answer_list = generateEmptyTileList(matrix_total_tiles);

  // PRODUCE ANSWER INDEXES BASED ON TOTAL NUMBER OF ANSWERS
  for (var i = 0; i < answer_count; i++) {
    let value = Math.floor(Math.random() * matrix_total_tiles);
    while (matrix_answer_list[value].answer == true) {
      value = Math.floor(Math.random() * matrix_total_tiles);
    }
    matrix_answer_list[value].answer = true;
    matrix_answer_list[value].value = i + 1;
  }
}

function generateEmptyTileList(size) {
  let emptyTileArray = new Array();

  for (let i = 0; i < size; i++) {
    tile = new Tile(false, null);
    emptyTileArray.push(tile);
  }

  return emptyTileArray;
}

function calculateAnswerCount() {
  let count = 0;
  for (let i = 0; i < matrix_answer_list; i++) {
    if (matrix_answer_list[i].answer == true) {
      count++;
    }
  }
  return count;
}

function startGame() {
  replaceStartBtn();

  // CLEAR DISPLAY
  let emptySummary = $('<div id="summary"></div>');
  $("#summary").replaceWith(emptySummary);
  let emptyLeaderBoard = $('<div id="leaderboard"></div>');
  $("#leaderboard").replaceWith(emptyLeaderBoard);

  // RESET VALUES
  globl_lives = 3;
  globl_score = 0;
  answer_count = 1;
  matrix_col_count = 2;
  matrix_row_count = 2;

  startRound();
}
