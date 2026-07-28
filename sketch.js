// =====================================
// Load Assets
// =====================================

let health;

function preload() {
  health = loadImage("./images/health.jpg");
}

// =====================================
// Utility Function
// Returns a random integer or a random element from an array.
// Necessary because variables are determined randomly outside of p5.js section.
// =====================================

function random(a, b) {
  if (Array.isArray(a)) {
    return a[Math.floor(Math.random() * a.length)];
  }

  return Math.floor(Math.random() * (b - a + 1)) + a;
}

// =====================================
// Ball Class
// =====================================

class Ball {
  // Create a new ball
  constructor(x, y, xspd, yspd, xdir, ydir) {
    this.x = x;
    this.y = y;

    this.xspd = xspd;
    this.yspd = yspd;

    this.xdir = xdir;
    this.ydir = ydir;

    this.left = 0;
    this.right = 0;
    this.top = 0;
    this.bottom = 0;
  }

  // Move the ball
  move() {
    this.x += this.xspd * this.xdir;
    this.y += this.yspd * this.ydir;

    // Bounce off left/right walls
    if (this.x >= 475 || this.x <= 25) {
      this.xdir *= -1;
    }

    // Bounce off top/bottom walls
    if (this.y >= 475 || this.y <= 25) {
      this.ydir *= -1;
    }
  }

  // Draw the ball
  display() {
    circle(this.x, this.y, 50);
  }

  // Update collision box
  updateHitbox() {
    this.left = this.x - 21;
    this.right = this.x + 21;

    this.top = this.y - 21;
    this.bottom = this.y + 21;
  }
}

// =====================================
// Global Variables
// =====================================

// Change this number to create more balls
let amountOfBalls = 2;

let balls = [];

let lives = 3;
let recentHit = 60;

let paused = true;

let score = 0;
let appearance = 0;

// Player position
let myXPos = 100;
let myYPos = 100;

// Reward position
let rewardxpos = 400;
let rewardypos = 400;

let ballSlider;
let speedSlider;
let startButton;

let enemySpeed;

let state = 'start screen';

// =====================================
// Setup
// =====================================

function setup() {
  let myCanvas = createCanvas(500, 500);
  myCanvas.parent("canvas-holder");

  rectMode(CENTER);
  noStroke();

  startScreen();
}

function startScreen() {
  const centerX = 270;
  const sliderWidth = 200;
  const buttonWidth = 150;

  ballSlider = createSlider(1, 6, 2, 1);
  ballSlider.parent('canvas-holder');
  ballSlider.position(centerX - sliderWidth / 2, 250);
  ballSlider.size(sliderWidth);

  speedSlider = createSlider(0.1, 5.0, 2.5, 0.1);
  speedSlider.parent('canvas-holder');
  speedSlider.position(centerX - sliderWidth / 2, 320);
  speedSlider.size(sliderWidth);

  startButton = createButton('go dodge stuf');
  startButton.parent('canvas-holder');
  startButton.position(centerX - buttonWidth / 2, 390);
  startButton.size(buttonWidth, 40);
  startButton.style('cursor', 'pointer');
  startButton.mousePressed(startGame);
}

function startGame() {
  amountOfBalls = ballSlider.value();
  enemySpeed = speedSlider.value();

  ballSlider.hide();
  speedSlider.hide();
  startButton.hide();

  // Transition state to game loop
  state = 'game';

  for (let i = 0; i < amountOfBalls; i++) {
    balls.push(
      new Ball(
        random(150, 475),
        random(150, 475),
        random(enemySpeed, enemySpeed+2),
        random(enemySpeed, enemySpeed+2),
        random([-1, 1]),
        random([-1, 1])
      )
    );
  }
}

// =====================================
// Main Game Loop
// =====================================

function draw() {
  if (state === 'start screen') {
    background(20, 20, 35);
    fill(255);
    textAlign(CENTER);
    textSize(36);
    text("Ball dodgey Thingy", 250, 100);
    textSize(14);
    fill(180);
    text("u gotta dodge the red balls and collect the yellow squares. \nu can move with arrow keys\nand u use p to pause.", 250, 140);

   
    fill(255);
    textSize(16);
    textAlign(CENTER);
    text("ball amount: " + ballSlider.value(), 250, 225);
    text("ball speed: " + speedSlider.value().toFixed(1) + "x", 250, 295);

  } else if (state === "game") {
    background(0, 0, 0, 75);

    // Draw hearts
    for (let i = 1; i <= lives; i++) {
      image(health, 350 + i * 30, 20, 20, 20);
    }

    // Draw reward
    fill(249, 249, 193);
    rect(rewardxpos, rewardypos, 40, 40);

    // Draw player
    fill(255, 150, 225);
    rect(myXPos, myYPos, 50, 50);

    // Draw and move every ball
    fill(170, 20, 20);

    for (let b of balls) {
      b.move();
      b.display();
      b.updateHitbox();
    }

    // Player movement
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

    // Keep player inside the canvas
    myXPos = constrain(myXPos, 25, 475);
    myYPos = constrain(myYPos, 25, 475);

    // Player hitbox
    let myLeft = myXPos - 25;
    let myRight = myXPos + 25;
    let myTop = myYPos - 25;
    let myBottom = myYPos + 25;

    // Reward hitbox
    let rewardLeft = rewardxpos - 20;
    let rewardRight = rewardxpos + 20;
    let rewardTop = rewardypos - 20;
    let rewardBottom = rewardypos + 20;

    // =====================================
    // Ball Collision Detection
    // =====================================

    for (let i = 0; i < balls.length; i++) {
      let b = balls[i];

      // Check if the player is touching this ball
      if (!(myLeft > b.right ||
            myRight < b.left ||
            myTop > b.bottom ||
            myBottom < b.top)) {

        // Only lose a life if the cooldown has expired
        if (recentHit >= 60) {
          lives--;
          recentHit = 0;

          // Game over
          if (lives <= 0) {
            noLoop();

            fill(255);
            textAlign(CENTER);
            textSize(20);

            text(
              "You lose to ball " +
              (i + 1) +
              "\nPress R to reset",
              250,
              460
            );

            return;
          }
        }

        // Bounce the ball after a collision
        b.xdir *= -1;
        b.ydir *= -1;
      }
    }

    // =====================================
    // Reward Collision
    // =====================================

    if (!(myLeft > rewardRight ||
          myRight < rewardLeft ||
          myTop > rewardBottom ||
          myBottom < rewardTop)) {

      // Increase score
      score++;

      // Force reward to move next frame
      appearance = 360;
    }

    // =====================================
    // Reward Respawn Timer
    // =====================================

    appearance++;

    if (appearance >= 360) {
      appearance = 0;

      // Keep the reward away from the player
      do {
        rewardxpos = random(25, 475);
        rewardypos = random(25, 475);
      } while (dist(rewardxpos, rewardypos, myXPos, myYPos) < 80);
    }

    // =====================================
    // Display Score
    // =====================================

    fill(255);
    textAlign(LEFT);
    textSize(20);

    text("Score: " + score, 20, 30);

    // Increase the damage cooldown timer
    recentHit++;
  }
}

// =====================================
// Keyboard Controls
// =====================================

function keyPressed() {
  // -----------------------------
  // Pause / Unpause
  // -----------------------------
  if (key === "p") {
    paused = !paused;

    if (paused) {
      noLoop();
    } else {
      loop();
    }
  }

  // -----------------------------
  // Reset Game
  // -----------------------------
  if (key === "r") {
    // Reset game values
    score = 0;
    lives = 3;
    recentHit = 60;
    appearance = 0;

    // Reset player position
    myXPos = 100;
    myYPos = 100;

    // Reset every ball
    for (let b of balls) {
      // Random direction
      b.xdir = random([-1, 1]);
      b.ydir = random([-1, 1]);

      // Random speed
      b.xspd = random(3, 5);
      b.yspd = random(3, 5);

      // Spawn away from the player
      do {
        b.x = random(25, 475);
        b.y = random(25, 475);
      } while (dist(b.x, b.y, myXPos, myYPos) < 80);
    }

    // Reset reward position
    do {
      rewardxpos = random(25, 475);
      rewardypos = random(25, 475);
    } while (dist(rewardxpos, rewardypos, myXPos, myYPos) < 80);

    // Resume the game
    paused = false;
    loop();
  }

  if (key === "R") {
    state = "start screen"
    startScreen();
    loop();
  }
}