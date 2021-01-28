//Initial Canvas Setup
var canvas = document.getElementById("drawing");
var ctx = canvas.getContext("2d");

//Paddle y-values
var yLeft = 275;
var yRight = 275;

//ballX
var ballX = 490;
var ballY = 340;//340 middle
var xDirection = 1;//left: -1 right: +1
var ballSpeedX = 1;
var ballSpeedY = 0;
var powerCreepInt = .0001;
const MAX_ANGLE = 1;

var middleLeftPaddle = yLeft + 75;
var middleRightPaddle = yRight + 75;
var placement;//middle_____Paddle - ballY
var anglePercentage;

//game
var gameSpeed = 1;//higher to slow
var gamePaused = false;

//mousePosition
var mx;
var my;

//score
var leftScore = 0;
var rightScore = 0;

//colors
var netColor = "white";
var ballColor = "white";
var leftPaddleColor = "white";
var rightPaddleColor = "white";
var scoreColor = "red";
var backgroundColor = "black";

//movement variables
var rightMovingUp;
var rightMovingDown;
var leftMovingUp;
var leftMovingDown;

//dev variables
var devCode = "9108";
var devMode = false;

var reap = setInterval(animate,gameSpeed);  

document.addEventListener("keydown", function(event){
  if(event.keyCode == "83"){//s is pressed
    leftMovingDown = true;
  }
  else if(event.keyCode == "87"){//w is pressed
    leftMovingUp = true;
  }
  else if(event.keyCode == "73"){//i is pressed
    rightMovingUp = true;
  }
  else if(event.keyCode == "75"){//k is pressed
    rightMovingDown = true;
  }

  if(event.keyCode == "192"){
    devTool();
  }

});

document.addEventListener("keyup", function(event){
  if(event.keyCode == "83"){//s is pressed
    leftMovingDown = false;
  }
  else if(event.keyCode == "87"){//w is pressed
    leftMovingUp = false;
  }
  else if(event.keyCode == "73"){//i is pressed
    rightMovingUp = false;
  }
  else if(event.keyCode == "75"){//k is pressed
    rightMovingDown = false;
  }

});

ctx.canvas.addEventListener('mousemove', function(e) {
  mx = e.x - ctx.canvas.offsetLeft;
  my = e.y - ctx.canvas.offsetTop;
});

ctx.canvas.addEventListener('mousedown',function(e){
  if(mx >= 925 && mx <= 973){
    if(my >= 22 && my <= 68){
      if(gamePaused){
        gamePaused = false;
        reap = setInterval(animate,gameSpeed);
      }
      else{
        gamePaused = true;
        clearInterval(reap);
        animate();
      }
    }
  }
});

function score(){
  ctx.fillStyle = scoreColor;
  if(leftScore == 0){
    ctx.fillRect(350,20,100,20);//top of zero
    ctx.fillRect(350,20,20,120);//left side of zero
    ctx.fillRect(350,140,100,20);//bottom side of zero
    ctx.fillRect(430,20,20,120);//right side of zero
  }
  else if(leftScore == 1){
    ctx.fillRect(400,20,20,120);//middle
  }
  else if(leftScore == 2){
    ctx.fillRect(365,20,70,20);//top
    ctx.fillRect(430,20,20,70);//right side
    ctx.fillRect(365,70,70,20);//middle layer
    ctx.fillRect(365,70,20,70);//left side
    ctx.fillRect(365,120,80,20);//bottom
  }
  else if(leftScore == 3){
    ctx.fillRect(365,20,90,20);//top
    ctx.fillRect(435,20,20,120);//right side
    ctx.fillRect(365,130,90,20);//bottom
    ctx.fillRect(365,75,90,20);//middle
  }
  else if(leftScore == 4){
    ctx.fillRect(365,20,20,70);//left side
    ctx.fillRect(365,80,90,20);//middle
    ctx.fillRect(435,20,20,120);//right side
  }
  else if(leftScore == 5){
    ctx.fillRect(365,20,80,20);//top
    ctx.fillRect(365,20,20,70);//right side
    ctx.fillRect(365,70,70,20);//middle layer
    ctx.fillRect(430,70,20,70);//left side
    ctx.fillRect(365,120,80,20);//bottom
  }
  else{
    leftScore = 0;
    rightScore = 0;
  }

  if(rightScore == 0){
    ctx.fillRect(550,20,100,20);//top of zero
    ctx.fillRect(550,20,20,120);//left side of zero
    ctx.fillRect(550,140,100,20);//bottom side of zero
    ctx.fillRect(630,20,20,120);//right side of zero
  }
  else if(rightScore == 1){
    ctx.fillRect(560,20,20,120);//middle
  }
  else if(rightScore == 2){
    ctx.fillRect(545,20,70,20);//top
    ctx.fillRect(610,20,20,70);//right side
    ctx.fillRect(545,70,70,20);//middle layer
    ctx.fillRect(545,70,20,70);//left side
    ctx.fillRect(545,120,80,20);//bottom
  }
  else if(rightScore == 3){
    ctx.fillRect(540,20,90,20);//top
    ctx.fillRect(610,20,20,120);//right side
    ctx.fillRect(540,130,90,20);//bottom
    ctx.fillRect(540,75,90,20);//middle
  }
  else if(rightScore == 4){
    ctx.fillRect(540,20,20,70);//left side
    ctx.fillRect(540,80,90,20);//middle
    ctx.fillRect(610,20,20,120);//right side
  }
  else if(rightScore == 5){
    ctx.fillRect(540,20,80,20);//top
    ctx.fillRect(540,20,20,70);//right side
    ctx.fillRect(540,70,70,20);//middle layer
    ctx.fillRect(605,70,20,70);//left side
    ctx.fillRect(540,120,80,20);//bottom
  }
  else{
    rightScore = 0;
    leftScore = 0;
  }
}

function ball(){
  ctx.fillStyle = ballColor;
  ctx.fillRect(ballX,ballY,20,20);
  ballX = ballX + ballSpeedX * xDirection;
  ballY = ballY + ballSpeedY;

  //Left paddle collision detection
  if(ballX <= 35){
    //Top right corner: (35,0)
    //Bottom right corner: (35,150)
    //Ball can be in the range 0,150
    if(ballY+20 > yLeft && ballY < yLeft + 150){
      xDirection = -1 * xDirection;
      placement = middleLeftPaddle - (ballY + 10);
      anglePercentage = placement / 80;
      ballSpeedY = MAX_ANGLE * -anglePercentage;
      // console.log("Left Ball Speed: " + ballSpeedY);
      // console.log("Left Placement: " + placement);
      // console.log("Left Angle Percentage: " + anglePercentage);
    }

  }
  //Right paddle collision detection
  if(ballX >= 945){
    if(ballY+20 > yRight && ballY < yRight + 150){
      xDirection = -1 * xDirection;
      placement = middleRightPaddle - (ballY + 10);
      anglePercentage = placement / 80;
      ballSpeedY = MAX_ANGLE * -anglePercentage;
      // console.log("Right Placement: " + placement);
      // console.log("Right Ball Speed: " + ballSpeedY);
      // console.log("Right Placement: " + placement);
      // console.log("Right Angle Percentage: " + anglePercentage);

    }
  }

  //CODE HERE
  if(ballY <= 0 || ballY >= 680){

    //y-direction: -1;
    //*hits top wall*
    //y-direction = 1;
    //*hits botom of right paddle*
    //ballSpeedY = -5
    //ballY = ballY + ballSpeedY * yDirection

    //y-direction : 1;
    //*hit bottom wall*
    //y-direction: -1;
    //*hit top right paddle*
    //ballSpeedY = 2
    //ballY = ballY + 2 * -1 = ballY - 2
    ballSpeedY = -1 * ballSpeedY;
  }

  if(ballX <= 0){
    rightScore++;
    xDirection = -1 * xDirection;
    ballX = 490;
    ballY = 340;
    ballSpeedY = 0;
    yLeft = 275;
    yRight = 275;
    middleLeftPaddle = yLeft + 75;
    middleRightPaddle = yRight + 75;
    ballSpeedX = 1;
  }
  else if(ballX >= 980){
    leftScore++;
    xDirection = -1 * xDirection;
    ballX = 490;
    ballY = 340;
    ballSpeedY = 0
    yRight = 275;
    yLeft = 275;
    middleLeftPaddle = yLeft + 75;
    middleRightPaddle = yRight + 75;
    ballSpeedX = 1;
  }
}

function cover(){//draws background
  ctx.fillStyle = backgroundColor;//blue: #5653ff
  ctx.fillRect(0,0,1000,700);
}

function paddleLeft(){//draws left paddle
  if(leftMovingUp){
    if(yLeft > 10){
      yLeft--;
      middleLeftPaddle--;
    }
  }
  if(leftMovingDown){
    if(yLeft < 540){
      yLeft++;
      middleLeftPaddle++;
    }
  }
  ctx.fillStyle = leftPaddleColor;
  ctx.fillRect(10,yLeft,25,150);
}

function paddleRight(){//draws right paddle
  if(rightMovingUp){
    if(yRight > 10){
      yRight--;
      middleRightPaddle--;
    }
  }
  if(rightMovingDown){
    if(yRight < 540){
      yRight++;
      middleRightPaddle++;
    }
  }
  ctx.fillStyle = rightPaddleColor;
  ctx.fillRect(965,yRight,25,150);
}

function net(){
  ctx.fillStyle = netColor;
  for (var y = 15; y < 20*34; y+= 34){
    ctx.fillRect(475,y,25,25);
  }
}

function pauseButton(){
  if(gamePaused){
    ctx.beginPath();//left side
    ctx.moveTo(925,20);
    ctx.lineTo(925,70);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "white";
    ctx.stroke();

    ctx.beginPath();//bottom side
    ctx.moveTo(925,68);
    ctx.lineTo(975,68);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "white";
    ctx.stroke();

    ctx.beginPath();//right side
    ctx.moveTo(973,68);
    ctx.lineTo(973,20);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "white";
    ctx.stroke();

    ctx.beginPath();//top side
    ctx.moveTo(925,22);
    ctx.lineTo(973,22);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "white";
    ctx.stroke();

    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.moveTo(937,30);
    ctx.lineTo(937,60);
    ctx.lineTo(965,45);
    ctx.closePath()
    ctx.fill();
    ctx.stroke();
  }
  else{
    ctx.beginPath();//left side
    ctx.moveTo(925,20);
    ctx.lineTo(925,70);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "white";
    ctx.stroke();

    ctx.beginPath();//bottom side
    ctx.moveTo(925,68);
    ctx.lineTo(975,68);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "white";
    ctx.stroke();

    ctx.beginPath();//right side
    ctx.moveTo(973,68);
    ctx.lineTo(973,20);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "white";
    ctx.stroke();

    ctx.beginPath();//top side
    ctx.moveTo(925,22);
    ctx.lineTo(973,22);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "white";
    ctx.stroke();

    ctx.fillStyle = "white";
    ctx.fillRect(937,30,7,30);
    ctx.fillRect(955,30,7,30);
  }
}

function devTool(){
  if(devMode){
    var input = prompt("");
    input = input.toLowerCase();
    if(input == "pause"){//pause game
      clearInterval(reap);
    }
    else if(input == "resume"){//resume game
      reap = setInterval(animate,gameSpeed);
    }
    else{
      var command = eval(input);
      console.log(command);
    }
    // var input = input.replace(" ","");
    // var input = input.split("=");
    // console.log(input);
    // alert(input);

    //netColor = white
    //ballSpeedX = 10
    //ballColor = blue
    //scoreLeft = 9
    //ballX = 100
    //scoreLeft = 10
    //scoreLeft=10

    //each command has one word on the LHS
    //each command has an equal sign
    //each command has the change on thr RHS
    //each command has one word on the RHS

    // var txt = "1,2,3,4,5"
    // var newTxt = txt.split(",");

    //var txt = "netColor = blue"
    //var cmmnd = txt.split("=");
    //cmmnd[0] == "netColor "
    //if cmnd[0] == "netColor"
    
    //Work on the dev tools
    //Use the split function to split the entered command into variable and change
    //How to deal with spaces? (look up function to get rid of whitespace)
    //Try to make it as efficient as possible.
  }
  else{
    var input = prompt("Code");
    if(input == devCode){
      alert("access granted");
      devMode = true;
    }
  }
}

function powerCreep(){
  if(!(ballSpeedX > 10)){
    ballSpeedX += powerCreepInt;
  }
}

function cursor(){
  if(mx >= 925 && mx <= 973){
    if(my >= 22 && my <= 68){
      document.getElementById("drawing").style.cursor = "pointer";
    }
    else{
      document.getElementById("drawing").style.cursor = "default";
    }
  }
  else{
    document.getElementById("drawing").style.cursor = "default";
  }
}

function animate(){
  cover();
  paddleLeft();
  paddleRight();
  net();
  score();
  pauseButton()
  ball();
  powerCreep();
  cursor();
}