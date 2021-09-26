var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var ballRadius = 12;
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;
var paddleWidth = 100;
var paddleHeight = 20;
var paddleX = (canvas.width - paddleWidth) / 2;
var leftPressed = false;
var rightPressed = false;
var brickRowCount = 5;
var brickColumnCount = 8;
var brickWidth = 100;
var brickHeight = 28;
var brickOffsetLeft = 22;
var brickOffsetTop = 60;
var brickPadding = 16;
var score =0;
var highscore =0;
highscore = localStorage.getItem('Highscore');

let gameOver = new Audio();
gameOver.src = "others/life_lost.mp3";
const BRICK_HIT = new Audio();
BRICK_HIT.src = "others/brick_hit.mp3";

let winGame = new Audio();
winGame.src="win.mp3";

let paddleHit = new Audio();
paddleHit.src="others/paddle_hit.mp3";

var bricks = [];
for (c = 0; c < brickColumnCount; c++) {
     bricks[c] = [];
     for (r = 0; r < brickRowCount; r++) {
          bricks[c][r] = { x: 0, y: 0, status:1 };
          
     }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function collisionDetection() {
     for (c = 0; c < brickColumnCount; c++) {
          for (r = 0; r < brickRowCount; r++) {
               var b = bricks[c][r];
               if (b.status==1) {
                    if (x > b.x && b.x + brickWidth > x && y > b.y && b.y + brickHeight > y) {
                         dy = -dy;
                         b.status = 0;
                         score++;
                         BRICK_HIT.play();
                         if(score == brickRowCount*brickColumnCount)
                         {
                              winGame.play();
                              alert("Congractulation You Won the Game!!");
                              document.location.reload();
                         }
                    }
               }
          }
     }
     if(highscore < score)
     {
          highscore = score;
     }
     localStorage.setItem('Highscore', highscore);
}

function drawBall() {
     ctx.beginPath();
     ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
     ctx.fillStyle = "red";
     ctx.fill();
     ctx.closePath();
}

function drawPaddle() {
     ctx.beginPath();
     ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
     ctx.fillStyle = "green";
     ctx.fill();
     ctx.closePath();
}
function drawBricks() {
     for (c = 0; c < brickColumnCount; c++) {
          for (r = 0; r < brickRowCount; r++) {
               if (bricks[c][r].status == 1) {
                    var bricksX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                    var bricksY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                    bricks[c][r].x = bricksX;
                    bricks[c][r].y = bricksY;
                    ctx.beginPath();
                    ctx.rect(bricksX, bricksY, brickWidth, brickHeight);
                    ctx.fillStyle = "blue";
                    ctx.fill();
                    ctx.closePath();
               }
          }
     }
}

function drawScore() {
     ctx.font = "24px Arial";
     ctx.fillStyle = "brown";
     ctx.fillText("Score: " + score, 8, 35); //fillText(String,x,y)
 }
 
 function drawHighScore() {
     ctx.font = "24px Arial";
     ctx.fillStyle = "brown";
     ctx.fillText("Highscore: " + highscore, 780, 35); //fillText(String,x,y)
 }

 

function draw() {

     ctx.clearRect(0, 0, canvas.width, canvas.height);
    
     drawBricks();
     drawBall();
     drawPaddle();
     drawScore();
     drawHighScore();
     collisionDetection();
   

     if (rightPressed && paddleX < canvas.width - paddleWidth) {
          paddleX += 7;
     }
     else if (leftPressed && paddleX > 0) {
          paddleX -= 7;
     }

     if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
          paddleHit.play();
          dx = -dx
     }
     if (y + dy < ballRadius) {
          paddleHit.play();
          dy = -dy
     }
     else if (y + dy > canvas.height - ballRadius) {
          if (x > paddleX && x < paddleX + paddleWidth) {
               paddleHit.play();
               dy = -dy
          }
          else {
              
               gameOver.play();
                clearInterval(game);
               alert("Game over!!! Your Score is "+score);
                   document.location.reload();
              }
     }
     x += dx;
     y += dy;
}

function keyDownHandler(e) {
     if (e.keyCode == 39) {
          rightPressed = true;
     }
     else if (e.keyCode == 37) {
          leftPressed = true;
     }
}

function keyUpHandler(e) {
     if (e.keyCode == 39) {
          rightPressed = false;
     }
     else if (e.keyCode == 37) {
          leftPressed = false;
     }
}

function mouseMoveHandler(e){
     var relativeX = e.clientX - canvas.offsetLeft;
     if(relativeX> 0 && relativeX<canvas.width)
     {
          paddleX = relativeX - paddleWidth/2;
     }
}

function playGame(){
    game = setInterval(draw,2);
}


// 200- x-coordinate
     // 150- y-coordinate
     // 20-radius
     // 0-starting angle
     // Math.PI*2 - closing angle
     // false - clockwise
     //default anticlockwise-true