// DEFAULT GLOBAL VARIABLES
globl_tiles = 1;
globl_lives = 3;
globl_score = 0;

// GLOBAL GAME VARIABLES
answer_count = 1;
correct_answers = 0;
const ROUND_BONUS = 3;
next_num = 1;
toggleRowCol = false;

// GLOBAL GAME LIMITS
MAX_LIMIT_ROW = 7;
MAX_LIMIT_COL = 7;
MIN_LIMIT_ROW = 2;
MIN_LIMIT_COL = 2;

// GLOBAL MATRIX PROPERTIES
matrix_row_count = 2;
matrix_col_count = 2;
matrix_answer_list = [];
matrix_total_tiles = 0;

// OBJECT CONSTRUCTORS
function Tile(answer, value) {
  this.answer = answer;
  this.value = value;
}

// GAME AUDIO
const audio_rotate = document.createElement("audio");
audio_rotate.setAttribute("src", "../assets/rotate.wav");
const audio_correct = document.createElement("audio");
audio_correct.setAttribute("src", "../assets/correct.mp3");
const audio_wrong = document.createElement("audio");
audio_wrong.setAttribute("src", "../assets/wrong.wav");

// USER PROFILE
username = "";
userscore = 0;
