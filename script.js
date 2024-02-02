const map = document.querySelector("#game");
const canvas = map.getContext("2d");
canvas.fillStyle = "rgb(228, 164, 0)";

const grid = 16;
const paddleHeight = grid * 5;
const maxPaddleY = map.height - grid * paddleHeight;

let pause = true;
let pauseLabel = document.querySelector("#pause");
let scoreboard = document.querySelector(".table");
let guide = document.querySelector(".guide");

let leftScoreText = document.querySelector("#leftCounter");
let rightScoreText = document.querySelector("#rightCounter");

let leftScore = 0;
let rightScore = 0;

let canToggleMap = true;
let hasMap = false;

let ballSpeed = 4;
const paddleSpeed = 7.3125;

const leftPaddle = {
  x: grid * 2,
  y: map.height / 2 - paddleHeight / 2,
  width: grid,
  height: paddleHeight,
  dy: 0,
};

const rightPaddle = {
  x: map.width - grid * 2,
  y: map.height / 2 - paddleHeight / 2,
  width: grid,
  height: paddleHeight,
  dy: 0,
};

const ball = {
  x: map.width / 2,
  y: map.height / 2,
  width: grid,
  height: grid,
  resetting: false,
  dx: ballSpeed,
  dy: -ballSpeed,
  isResetted: false,
};

function renderMap() {
  canvas.fillRect(0, 0, map.width, grid); // Верхняя граница
  canvas.fillRect(0, map.height - grid, map.width, grid); // Нижняя граница

  for (let i = grid; i < map.height - grid; i += grid * 2) {
    canvas.fillRect(map.width / 2, i, grid, grid); // Разделительная линия
  }
}

function clearMap() {
  canvas.clearRect(0, 0, map.width, map.height);
}

function renderLeftPaddle() {
  canvas.fillRect(
    leftPaddle.x,
    leftPaddle.y,
    leftPaddle.width,
    leftPaddle.height
  );
}

function renderRightPaddle() {
  canvas.fillRect(
    rightPaddle.x,
    rightPaddle.y,
    rightPaddle.width,
    rightPaddle.height
  );
}

function renderBall() {
  canvas.fillRect(ball.x, ball.y, ball.width, ball.height);
}

function resetGame() {
  if ((ball.x < 0 || ball.x > map.width) && !ball.isResetted) {
    ball.isResetted = true;
    setTimeout(() => {
      ball.x = map.width / 2;
      ball.y = map.height / 2;
      ball.isResetted = false;
    }, 2000);
  }
}

function collideWallsWithPaddle(paddle) {
  if (paddle.y <= 11.1875) {
    paddle.y = 11.1875;
  } else if (paddle.y > 494.9375) {
    paddle.y = 494.9375;
  }
}

function collideWallsWithBall() {
  if (ball.y < grid) {
    ball.y = grid;
    ball.dy = -ball.dy;
  } else if (ball.y > map.height - grid) {
    ball.y = map.height - grid;
    ball.dy = -ball.dy;
  }
}

function isCollides(object1, object2) {
  const width1 = object1.x + object1.width;
  const width2 = object2.x + object2.width;
  const height1 = object1.y + object1.height;
  const height2 = object2.y + object2.height;
  return (
    object1.x < width2 &&
    object2.x < width1 &&
    object1.y < height2 &&
    object2.y < height1
  );
}

function collidePaddlesWithBall() {
  if (isCollides(ball, rightPaddle)) {
    ball.dx = -ball.dx;
    ball.x = rightPaddle.x - ball.width;
  } else if (isCollides(ball, leftPaddle)) {
    ball.dx = -ball.dx;
    ball.x = leftPaddle.x + leftPaddle.width;
  }
}

function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;
}

function movePaddles() {
  leftPaddle.y += leftPaddle.dy;
  rightPaddle.y += rightPaddle.dy;
}

function aiControl() {
  let direction = 0;

  if (ball.y < rightPaddle.y) {
    direction = -1;
  } else if (ball.y > rightPaddle.y + paddleHeight) {
    direction = 1;
  }

  rightPaddle.y += paddleSpeed * direction;
}

function isGoal() {
  if (ball.x == 0) {
    rightScore += 1;
    console.log("Right score + 1");
  } else if (ball.x == map.width) {
    leftScore += 1;
    console.log("Left score + 1");
  }
}

function renderScore() {
  leftScoreText.textContent = leftScore;
  rightScoreText.textContent = rightScore;
}

// ГЛАВНЫЙ цикл
function loop() {
  if (!pause) {
    pauseLabel.textContent = "";
    pauseLabel.classList.remove("border");
    scoreboard.classList.remove("vanish");
    guide.classList.add("vanish");
    map.classList.remove("vanish");
    canToggleMap = false;

    clearMap();

    renderLeftPaddle();
    renderRightPaddle();

    aiControl();

    movePaddles();

    collideWallsWithPaddle(leftPaddle);

    renderBall();
    moveBall();
    collideWallsWithBall();
    collidePaddlesWithBall();

    isGoal();
    renderScore();

    resetGame();

    renderMap();
  } else {
    canToggleMap = true;

    pauseLabel.classList.add("border");
    scoreboard.classList.add("vanish");
    guide.classList.remove("vanish");
    map.classList.add("vanish");
    if (hasMap) {
      map.classList.remove("vanish");
    }
    if (ball.x == map.width / 2 && ball.y == map.height / 2) {
      pauseLabel.textContent = "Нажмите SPACE чтобы начать";
    } else {
      pauseLabel.textContent = "Нажмите SPACE чтобы продолжить";
    }
  }

  requestAnimationFrame(loop);
}

document.addEventListener("keydown", (event) => {
  console.log(event.key);

  if (event.key === "w" || event.key === "ц") {
    leftPaddle.dy = -paddleSpeed;
  } else if (event.key === "s" || event.key === "ы") {
    leftPaddle.dy = paddleSpeed;
  } else if (event.key === " ") {
    if (pause == true) {
      pause = false;
    } else if (pause == false) {
      pause = true;
    }
  } else if (
    (event.key === "m" && canToggleMap) ||
    (event.key === "ь" && canToggleMap)
  ) {
    hasMap ? (hasMap = false) : (hasMap = true);
    console.log("карта переключилась");
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key === "w" || event.key === "ц") {
    leftPaddle.dy = 0;
  }
  if (event.key === "s" || event.key === "ы") {
    leftPaddle.dy = 0;
  }
});

requestAnimationFrame(loop);
