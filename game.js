const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const pResult = document.querySelector('#result');


let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;

let timeStart;
let timePLayer;
let timeInterval;

 
const playerPosition = {
  x: undefined, 
  y: undefined,
};

const giftPosition = {
  x: undefined,
  y: undefined,
};

let enemyPosition = {};

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);


function setCanvasSize() {
    if (window.innerHeight > window.innerWidth) {
      canvasSize = window.innerWidth * 0.8;
    } else {
      canvasSize = window.innerHeight * 0.8;
    };
    
      canvasSize = Number(canvasSize.toFixed(0));

      canvas.setAttribute('width', canvasSize)
      canvas.setAttribute('height', canvasSize)
  
     elementsSize = canvasSize / 10;

     playerPosition.x = undefined;
     playerPosition.y = undefined;
     startGame();
      
}

function startGame () {
    console.log({canvasSize, elementsSize});
    
    game.font = elementsSize + 'px Verdana';
    game.textAlign = 'end';
    
    const map = maps[level];

    if (!map){
      gameWin();
      return
    }

    if (!timeStart) {
      timeStart = Date.now();
      timeInterval = setInterval(showTime, 100);
      showRecord ();
    }


    const mapRows = map.trim().split('\n');
    const mapRowCols = mapRows.map(row => row.trim().split(''));
    
    showLives();

    enemyPosition = [];
    game.clearRect(0,0, canvasSize, canvasSize);
    
    mapRowCols.forEach((row, rowI) => {
        row.forEach((col, colI) => {
           const emoji = emojis[col];
           const posX = elementsSize * (colI + 1);
           const posY = elementsSize * (rowI + 1);

          if (col =='O') {
            if (!playerPosition.x && !playerPosition.y) {
              playerPosition.x = posX;
              playerPosition.y = posY;
            }
          } else if (col == 'I') {
            giftPosition.x = posX;
            giftPosition.y = posY;
          } else if ( col == 'X') {
            enemyPosition.push({
              x: posX,
              y: posY,
            });
          }
           game.fillText(emoji, posX, posY)
        });
    });

    movePLayer();

  }

function movePLayer () {
  const giftCollisionX = playerPosition.x.toFixed(2) == giftPosition.x.toFixed(2);
  const giftCollisionY = playerPosition.y.toFixed(2) == giftPosition.y.toFixed(2);
  const giftCollision = giftCollisionX && giftCollisionY;

  if (giftCollision) {
    levelWin();
  }

  const enemyCollision = enemyPosition.find(enemy => {
    const enemyCollisionX = enemy.x.toFixed(2) == playerPosition.x.toFixed(2);
    const enemyCollisionY = enemy.y.toFixed(2) == playerPosition.y.toFixed(2);
    return enemyCollisionX && enemyCollisionY;
  });

  if (enemyCollision) {
    levelFail();
  }

  game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);

}

function levelWin () {
  console.log('subiste de nivel');
  level++;
  startGame();
}

function levelFail () {
  lives --;


  if (lives <= 0) {
    level = 0;
    lives = 3;
    timeStart = undefined;
  }

  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();
}

function gameWin () {
  console.log('terminaste el juego');
  clearInterval(timeInterval)

const recordTime = localStorage.getItem('record_time');
const playerTime = Date.now() - timeStart;

  if (recordTime) {
    if (recordTime >= playerTime) {
      localStorage.setItem('record_time', playerTime)
      pResult.innerHTML = 'Superaste el record :D';
    } else {
      pResult.innerHTML = 'No superaste el record :(';
    }
  } else {
    localStorage.setItem('record_time', playerTime);
    pResult.innerHTML = 'Primera vez? Muy bien, pero ahora trata de superar tu record'
  }

  console.log ({recordTime, playerTime})
}

function showLives () {
 const heartsArray = Array(lives).fill(emojis['HEART']) //[0,1,2]array con posiciones que diga mi variable live
  
 spanLives.innerHTML = "";
 heartsArray.forEach(heart => spanLives.append(heart));

  // spanLives.innerHTML = heartsArray; ACA APARECE CON LAS COMAS
}

function showTime () {
 spanTime.innerHTML = Date.now() - timeStart;
}

function showRecord () {
spanRecord.innerHTML = localStorage.getItem('record_time')
}

window.addEventListener('keydown', moveByKeys);
btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);

function moveByKeys(event){
if (event.key == 'ArrowUp') moveUp();
else if (event.key == 'ArrowLeft') moveLeft();
else if (event.key == 'ArrowRight') moveRight();
else if (event.key == 'ArrowDown') moveDown();

  /*   if (event.key == 'ArrowUp') {
    moveUp();
  }
   else if (event.key == 'ArrowLeft') {
    moveLeft();
  }
  else if (event.key == 'ArrowRight') {
    moveRight();
  }
  else if (event.key == 'ArrowDown') {
    moveDown();
  } */
}

function moveUp() {
  console.log('Me quiero mover hacia arriba');
  if ((playerPosition.y - elementsSize) < elementsSize) { 
    
  } else {
    playerPosition.y -= elementsSize;
    startGame();
  }
}
function moveLeft() {
  console.log('Me quiero mover hacia la izquierda');
  if((playerPosition.x - elementsSize) < elementsSize) {

  }else {
  playerPosition.x -= elementsSize;
  startGame();}
}
function moveRight() {
  console.log('Me quiero mover hacia la derecha');
 if ((playerPosition.x + elementsSize) > canvasSize){

 }else{
  playerPosition.x += elementsSize;
  startGame();}
}
function moveDown() {
  console.log('Me quiero mover hacia abajo');
  if((playerPosition.y + elementsSize) > canvasSize) {

  }else {
  playerPosition.y += elementsSize;
  startGame();}
}





/*     for (let row = 1; row <= 10; row++) {
       for (let col = 1; col <= 10; col++) {
        game.fillText(emojis[mapRowCols[row -1][col -1]], elementsSize * col, elementsSize * row);
        
       }    
    } */


   
   
    
/*     game.fillRect(0,0,100,100);
    game.clearRect(); */
/*     game.font = '25px Verdana'
    game.textAlign = 'end';
    game.fillStyle = 'purple';
    game.fillText('Hola', 150, 150); */
