let health;
function preload() {
    health = loadImage('health.jpg');
}

function random(a,b){
    return Math.floor(Math.random()*(b-a+1))+a;
}

let recentHit = 30;
let lives = 3;
let appearance = 0;
let paused = true;
let score = 0;
let myXPos = 100;
let myYPos = 100;
let rewardxpos = 400;
let rewardypos = 400;
let ballXPos = random(150,475);
let ballYPos = random(150,475);
let xspd = random(3,5);
let yspd = random(3,5);
let xdirect = 1;
let ydirect = 1;
let ballXPos2 = random(150,475);
let ballYPos2 = random(150,475);
let xspd2 = random(3,5);
let yspd2 = random(3,5);
let xdirect2 = -1;
let ydirect2 = -1;
let myLeft,myRight,myBottom,myTop;
let ballLeft,ballRight,ballTop,ballBottom;
let ballLeft2,ballRight2,ballTop2,ballBottom2;
let rewardLeft,rewardRight,rewardTop,rewardBottom;


function setup() {
    noLoop();
    let myCanvas = createCanvas(500, 500);
    noStroke();
 
    rectMode(CENTER);
    myCanvas.parent('canvas-holder');
   
}




function draw() {
   
    for (let i = 1; i <= lives; i++){
        image(health, 350+(i*30), 20,20,20)
    }
    background(0,0,0,75);
    fill(249, 249, 193);
    rect(rewardxpos,rewardypos,40,40);
    fill(255,150,225);
    rect(myXPos, myYPos,50,50);
    fill(170,20,20);
    circle(ballXPos,ballYPos,50);
    circle(ballXPos2,ballYPos2,50);
   
    if (keyIsDown(LEFT_ARROW)) {
       myXPos -= 3;
    }
    if (keyIsDown(RIGHT_ARROW)) {
       myXPos += 3;
    }
    if (keyIsDown(UP_ARROW)) {
       myYPos -= 3;
    }
    if (keyIsDown(DOWN_ARROW)) {
       myYPos += 3;
    }


   


    ballXPos+=xspd*xdirect;
    ballYPos+=yspd*ydirect;
    ballXPos2+=xspd2*xdirect2;
    ballYPos2+=yspd2*ydirect2;


    if (ballXPos>=475 || ballXPos<=25){
        xdirect*=-1;
    }
    if (ballYPos>=475 || ballYPos<=25){
        ydirect*=-1;
    }
    if (ballXPos2>=475 || ballXPos2<=25){
        xdirect2*=-1;
    }
    if (ballYPos2>=475 || ballYPos2<=25){
        ydirect2*=-1;
    }
    if (myXPos>=475){
        myXPos=475;
    }
    if(myXPos<=25){
        myXPos=25;
    }
    if (myYPos>=475){
        myYPos=475;
    }
    if (myYPos<=25){
        myYPos=25
    }
    myLeft = myXPos - 25;
    myRight = myXPos + 25;
    myTop = myYPos - 25;
    myBottom = myYPos + 25;


    ballLeft = ballXPos - 21;
    ballRight = ballXPos + 21;
    ballTop = ballYPos - 21;
    ballBottom = ballYPos + 21;


    ballLeft2 = ballXPos2 - 21;
    ballRight2 = ballXPos2 + 21;
    ballTop2 = ballYPos2 - 21;
    ballBottom2 = ballYPos2 + 21;


    rewardleft = rewardxpos - 20;
    rewardRight = rewardxpos + 20;
    rewardTop = rewardypos - 20;
    rewardBottom = rewardypos + 20;


    if (myLeft > ballRight || myRight < ballLeft || myTop >ballBottom || myBottom < ballTop){


    } else {
        if (recentHit >= 60){
            lives--;
            recentHit = 0;
        } 
        if (lives <= 0){
            noLoop();
            fill(255,255,255);
            textSize(20);
            text('u lose to ball 1.\npress r to reset', 300, 460);
            recentHit = 0;
        }
        xdirect*= -1;
        ydirect*= -1;
    }


    if (myLeft > ballRight2 || myRight < ballLeft2 || myTop >ballBottom2 || myBottom < ballTop2){


    } else {
        if (recentHit >= 60){
            lives--
            recentHit = 0
        }
        if (lives <= 0){
            noLoop();
            fill(255,255,255);
            textSize(20);
            text('u lose to ball 2.\npress r to reset', 300, 460);
            recentHit = 0;
        }
        xdirect2*= -1;
        ydirect2*= -1;
        
    }
    if (myLeft > rewardRight || myRight < rewardleft || myTop > rewardBottom || myBottom < rewardTop){


    } else {
        score++;    
        appearance = 360;    
    }
    fill(255,255,255);
    textSize(20);
    text("score: " + score,20,30);
    appearance++
    if (appearance >= 360){
        appearance = 0;
        do{
            rewardxpos = random(20,480);
            rewardypos = random(20,480);
        } while (dist(rewardxpos,rewardypos,myXPos,myYPos)<80);
    }
    recentHit++

}




function keyPressed() {
   
    if (key === 'p'){
        if (paused === true){
            paused = !paused;
            loop();
        } else if (paused === false) {
            paused = !paused;
            noLoop();
        }
    }
    if (key === 'r'){
        score = 0;
        ballXPos = random(150,475);
        ballYPos = random(150,475);
        xdirect = 1;
        ydirect = 1;
        do {
            ballXPos = random(125, 475);
            ballYPos = random(125, 475);
            ballXPos2 = random(125,475);
            ballYPos2 = random(125,475);
            rewardxpos = random(125,475);
            rewardypos = random(125,475);
        } while (dist(ballXPos, ballYPos, myXPos, myYPos) < 80);
        xspd2 = random(3,5);
        yspd2 = random(3,5);
        xdirect2 = 1;
        ydirect2 = 1;
        myXPos = 100;
        myYPos = 100;
        lives = 3;
        recentHit = 30;
        loop();
    }
   
}


