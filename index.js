// Getting DOM Elements
const btnStart = document.querySelector('.startButton');
const myShip = document.querySelector('.myShip');
const container = document.querySelector('.container');
const fire = document.querySelector('.fireme');
const scoreOutput = document.querySelector('.score');
const levelOutput = document.querySelector('.level');
const message = document.querySelector('.message');
const welcome = document.querySelector('.welcome');
const gameArea = document.querySelector('.game-area');
const containerDim = container.getBoundingClientRect();


// Initialize player object for tracking player activities
let player = {
      score: 0,
      speed: 5,
      gameOver: true,
      fireOn: false,
      alienSpeed: 5,
      level: 1
}

// Initialize keys object for tracking which keys are being pressed
let keys = {};

// Setting Events
btnStart.addEventListener('click', startGame);
document.addEventListener('keydown', keyPress);
document.addEventListener('keyup', keyLeave);

// Setting Press On
function keyPress(e) {
      let key = e.keyCode;
      if (key === 37) {
          keys.left = true;
      }
      else if (key === 39) {
          keys.right = true;
      }
      else if (key === 38 || key === 32) {
          if (!player.fireOn) {
              addShoot();
          }
      }
}

// Setting Press Off
function keyLeave(e) {
      let key = e.keyCode;
      if (key === 37) {
          keys.left = false;
      }
      else if (key === 39) {
          keys.right = false;
      }
}

// Starting the game
function startGame() {
      if (player.gameOver) {
            clearAliens();
            player.gameOver = false;
            welcome.classList.add('hide');
            btnStart.style.display = 'none';
            player.alienSpeed = 10;
            player.score = 0;
            player.level = 1;
            // player.isTrue = false;
            scoreOutput.textContent = player.score;
            levelOutput.textContent = player.level;
            player.fireOn = false;
            setupAliens(10);
            messageOutput('Start Game')
            player.animationFrame = requestAnimationFrame(update);
      }
}

// Ending the game
function gameOver() {
      btnStart.style.display = 'block';
      btnStart.innerHTML = 'RESTART NEW GAME';
      player.fireOn = true;
      fire.classList.add('hide');
      clearAliens();
}
     
// Remove Enemy
function clearAliens() {
       tempAliens = document.querySelectorAll('.alien');

      for (let i = 0; i < tempAliens.length; i++) {
            tempAliens[i].parentNode.removeChild(tempAliens[i]);
      }
}

function setupAliens(num) {
      let tempWidth = 70;
      let lastCol = containerDim.width - tempWidth;
      let row = {
            x: containerDim.left,
            y: 70
      }
      for (let i = 0; i < num; i++) {
            if (row.x > lastCol) {
                  
                  row.y += 70;
                  row.x = containerDim.left;
            }
            alienMaker(row, tempWidth);
            row.x += tempWidth + 10;
      }
      
}
// generation of different colors
function randomColor() {
      return '#'+Math.floor(Math.random()*0xffffff).toString(16)
}

// Creating and positioning the enemy
function alienMaker(row, tempWidth) {

      // Creating according to screen dimensions
      if (row.y > (containerDim.height - 200)) {
            return;
      }
      // Creating and appending
      let enemy = document.createElement('div');
      enemy.classList.add('enemy');
      let alien = document.createElement('div');
      alien.classList.add('alien');
      enemy.appendChild(alien);
      let body = document.createElement('div');
      body.classList.add('body');
      alien.appendChild(body);
      let earOne = document.createElement('div');
      earOne.classList.add('ear');
      body.appendChild(earOne);
      let earTwo = document.createElement('div');
      earTwo.classList.add('ear');
      body.appendChild(earTwo);
      let mouth = document.createElement('div');
      mouth.classList.add('mouth');
      body.appendChild(mouth);
      let tooth = document.createElement('div');
      tooth.classList.add('tooth')
      mouth.appendChild(tooth); 
      let eyeLid = document.createElement('div');
      eyeLid.classList.add('eye-lid');
      alien.appendChild(eyeLid);
      let eyes = document.createElement('div');
      eyes.classList.add('eyes');
      eyeLid.appendChild(eyes);
      let eye = document.createElement('div');
      eye.classList.add('eye');
      eyes.appendChild(eye); 
      alien.style.width = tempWidth + 'px';
      alien.posX = Math.floor(row.x);
      alien.posY = Math.floor(row.y);
      body.style.backgroundColor = randomColor();
      earOne.style.color = randomColor();
      earTwo.style.color = randomColor();
      alien.style.left = alien.posX + 'px';
      alien.style.top =  alien.posY + 'px';
      alien.directionMove = 1;
      container.appendChild(enemy);
}

// Setting horizontal and vertical coordinates of fire
function addShoot() {
      player.fireOn = true;
      fire.classList.remove('hide');
      fire.posX = (myShip.offsetLeft + 25);
      fire.posY = myShip.offsetTop + 20;
      fire.style.left = fire.posX + 'px';
      fire.style.top = fire.posY + 'px';
}


// fire collision detection
function isCollide(a, b) {
      let recA = a.getBoundingClientRect();
      let recB = b.getBoundingClientRect();

      return !(
            (recA.bottom < recB.top) || (recA.top > recB.bottom) || (recA.right < recB.left) || (recA.left > recB.right)
      )
}

// Outputing the message
function messageOutput(msg) {
      message.innerHTML = msg;
}


function update() {
      if (!player.gameOver) {
      let tempAliens = document.querySelectorAll('.alien');
      
      if (tempAliens.length === 0) {
            setupAliens(22);
            player.alienSpeed++;
            player.level++;
            levelOutput.textContent = player.level;
            messageOutput(`Congratulations You're on Level ${player.level}`);
      }

      for (let i = 0; i < tempAliens.length; i++) {
            let el = tempAliens[i];
            if (isCollide(el, fire)) {
                  messageOutput('HIT');
                  player.score++;
                  scoreOutput.textContent = player.score;
                  player.fireOn = false;
                  fire.classList.add('hide');
                  el.parentNode.removeChild(el);
                  fire.posY = containerDim.height + 100;
            }
            if (el.posX > (containerDim.width - el.offsetWidth) || el.posX < containerDim.left) {
                  el.directionMove *= -1;
                  el.posY += 40;
                  if (el.posY > (myShip.offsetTop - 50)) {
                        player.gameOver = true;
                        gameOver();
                        messageOutput('Game Over');
                  }
            }
            el.posX += (player.alienSpeed * el.directionMove);
            el.style.left = el.posX + 'px';
            el.style.top =  el.posY + 'px';
            
      }

      let posX = myShip.offsetLeft;
      // console.log(posX)

      if (player.fireOn) {
            if (fire.posY > 0) {
                  fire.posY -= 25;
                  fire.style.top = fire.posY + 'px'; 
            }  else {
                  player.fireOn = false;
                  fire.classList.add('hide');
                  fire.posY = containerDim.height + 100;
            }
      }

      //  Setting horizontal position within the boundary area  
       if (keys.left && posX > containerDim.left) {
            posX -= player.speed;
       }

       if (keys.right && (posX + myShip.offsetWidth) < (containerDim.right - 10)) {
            posX += player.speed;
       }

       myShip.style.left = posX +'px';
      
            player.animationFrame = requestAnimationFrame(update);
       }

}