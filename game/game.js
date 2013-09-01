var randomColor = require('random-color');
var domready = require('domready');

var Game = require('crtrdg-gameloop');
var Keyboard = require('crtrdg-keyboard');
var Mouse = require('crtrdg-mouse');
var Levels = require('crtrdg-scene');
var Goals = require('crtrdg-goal');

var Inventory = require('./inventory');
var Gold = require('./gold');
var Player = require('./player');
var Bullet = require('./bullet');
var Camera = require('./camera');
var Enemy = require('./enemy');
var Map = require('./map');
var Text = require('./text');
var Log = require('./log');

/* create game */
var game = new Game({
  canvasId: 'game',
  width: window.innerWidth,
  height: 320,
  backgroundColor: '#000'
});

game.paused = false;

game.over = function(){
  levels.set(gameOver);
  log.add('hey, um. i think the game is over.')
};

game.win = function(){
  levels.set(gameWin);
  log.add('you got 100 gold oh shit you win!')
}


/*
*
* GAME EVENT LISTENERS
*
*/

game.on('update', function(interval){
  camera.update();
});

game.on('draw', function(context){
  map.draw(context, camera.position.x, camera.position.y)
});

game.on('pause', function(){});

game.on('resume', function(){});

game.on('tick', function(ticks){
  game.currentScene.emit('tick', ticks);
});


/*
*
* GOALS & LEVELS
*
*/

var goals = new Goals(game);
var levels = new Levels(game);


/*
*
* yes, this is for the 10 seconds theme.
* i mean, there'll be more to it than this.
* but it would be sorta funny if this is all i did
* that related to the theme.
*
*/

var ticks = 0;
var tickStarted = false;
function tick(){
   setTimeout(function(){
    ticks++;

    game.emit('tick', ticks);
    map.generate(ticks);
    player.tick();

    tick();

  }, 10000);
}


/*
*
* KEYBOARD
*
*/

var keyboard = new Keyboard(game);
var keysdown = keyboard.keysdown;

keyboard.on('keydown', function(key){
  if (key === 'S'){
    if (!player.scrunched){
      player.velocity.y = -5;
    }
  }

  if (key === '<space>'){
    if (game.currentScene.name === 'menu'){
      levels.set(levelOne);
      //game.resume();      
    }

    if (game.currentScene.name === 'game over'){
      location.reload();
    }
  }
});

keyboard.on('keyup', function(key){
  if (key === 'S'){
    player.scrunched = false;
    player.velocity.y = -5;
  }
});


/*
*
* MOUSE
*
*/

var mouse = new Mouse(game);

mouse.on('click', function(location){
  new Bullet({
    position: { 
      x: player.position.x + player.size.x / 2, 
      y: player.position.y + player.size.y / 2
    },

    target: { 
      x: location.x + camera.position.x, 
      y: location.y + camera.position.y 
    },
    camera: camera
  }).addTo(game)
    .on('update', function(interval){
      for (var i=0; i<monsters.length; i++){
        if (this.touches(monsters[i])){
          this.remove();
          monsters[i].health -= 11;
          monsters[i].size.x -= 9;
          monsters[i].size.y -= 9;
          monsters[i].colorMax += 30;
          monsters[i].blockSize -= .1;
          if (monsters[i].health <= 0){
            monsters[i].blowUp();
            monsters[i].remove();
            player.color = '#fff';
            player.eyeColor = '#f00';
            gold[i].addTo(game);
            gold[i].position.x = monsters[i].position.x;
          }
        }
      }
    }
  );
});


/*
*
* PLAYER
*
*/

var player = new Player({
  size: {
    x: 40,
    y: 55
  },
  position: {
    x: 100,
    y: 10,
  },
  color: '#fff',
  eyeColor: '#cececa',
  speed: 11,
  friction: 0.9,
  health: 100,
  camera: camera,
  coins: 0
});

player.addTo(game);

player.on('update', function(interval){
  if (player.health <= 0){
    player.kill();
  }

  if (player.coins >= 100){
    game.win();
  }

  this.input(keyboard.keysDown);
  this.move();
  this.velocity.x *= this.friction;
  this.velocity.y += 1.5;
  this.boundaries();
});

player.on('draw', function(context){
  if (player.visible){
    context.save();

    /* the body */
    context.fillStyle = this.color;

    if(this.scrunched){
      context.fillRect(this.position.x - camera.position.x-10, this.position.y - camera.position.y+30, this.size.x+20, this.size.y-30);

      /* the eye */
      context.fillStyle = this.eyeColor;

      /* direction of eye */
      if (this.direction === 'right') {
        context.fillRect(this.position.x+this.size.x-5 - camera.position.x, this.position.y - camera.position.y+35, 10, 10);
      } else {
        context.fillRect(this.position.x - camera.position.x-5, this.position.y - camera.position.y+35, 10, 10);
      }

    } else {
      context.fillRect(this.position.x - camera.position.x, this.position.y - camera.position.y, this.size.x, this.size.y);
    
      /* the eye */
      context.fillStyle = this.eyeColor;

      /* direction of eye */
      if (this.direction === 'right') {
        context.fillRect(this.position.x+this.size.x-15 - camera.position.x, this.position.y+5 - camera.position.y, 10, 10);
      } else {
        context.fillRect(this.position.x+5 - camera.position.x, this.position.y+5 - camera.position.y, 10, 10);
      }
    }

    context.restore();
  }
});

player.tick = function(){
  if (this.health > 0){
    this.setHealth(5);
  }

  if (this.health <= 0){
    player.kill();
  }

  if (this.health < 4 && this.health > 0){
    log.add('oh, gosh. your health is getting kinda low.')
  }
};

player.setHealth = function(n){
  this.health += n;
  health.update(this.health);
}

player.setCoins = function(n){
  this.coins += n;
  coins.update(this.coins);
}

player.setStrength = function(n){
  this.strength += n;
  strength.update(this.strength);
}

player.kill = function(){
  player.remove();
  game.over();
}


/*
*
* MAP & CAMERA
*
*/

var map = new Map(game, 3000, 320);
map.generate();

var camera = new Camera({
  follow: player,
  followPoint: { x: game.width / 2 },
  viewport: { width: game.width, height: game.height },
  map: map
});


/*
*
* MAIN MENU
*
*/

var menu = levels.create({
  name: 'menu',
  backgroundColor: '#000'
});

menu.on('start', function(){
  console.log('menu screen')
  player.visible = false;
  //game.pause();
});

// set main menu as first screen
levels.set(menu);



/*
*
* GAME OVER
*
*/

var gameOver = levels.create({
  name: 'game over',
  backgroundColor: '#000'
});

gameOver.on('start', function(){
  player.visible = false;
  title.update('GAME OVER YOU LOST SO BAD TRY AGAIN!');
  game.pause();
});


/*
*
* GAME WIN
*
*/

var gameWin = levels.create({
  name: 'game win',
  backgroundColor: '#000'
});

gameWin.on('start', function(){
  title.update("YOU WIN YOU ARE SO GREAT HEY IF YOU DIDN'T FIND IT THERE'S A SECRET FLYING ABILITY!");
  game.pause();
});


/*
*
* PAUSE MENU
*
*/

var pauseMenu = levels.create({
  name: 'pause menu',
  backgroundColor: 'blue'
});

pauseMenu.on('start', function(){

});


/*
*
* LEVEL ONE
*
*/

var gold = [];
var monsters = [];

var levelOne = levels.create({
  name: 'level one',
  backgroundColor: '#000'
});

levelOne.goal = goals.create({
  name: 'level one goal'
});

levelOne.goal.on('active', function(){
  console.log(this.name, 'active')
});

levelOne.goal.on('met', function(){
  levels.set(levelTwo);
});

levelOne.on('start', function(){
  if (!tickStarted){
    tick();
    tickStarted = true;
  }
  //enemy.addTo(game);
  title.update('shoot monsters and collect gold!')
  player.visible = true;
  goals.set(levelOne.goal);
});

levelOne.on('tick', function(ticks){
  console.log(ticks)
  monsters.push(new Enemy({
    camera: camera,
    color: '#fe123d'
  }));
  monsters[ticks-1].addTo(game);

  gold.push(new Gold({
    name: 'gold',
    color: '#FFD700',
    camera: camera,
    position: {
      x: 0,
      y: game.height - 30
    }
  }));
});

levelOne.on('update', function(){
  for (var i=0; i<gold.length; i++){
    if(player.touches(gold[i])){
      log.add('you found gold!');
      gold[i].remove();
      player.setCoins(5);
    }
  }

  for (var i=0; i<monsters.length; i++){
    if(player.touches(monsters[i])){
      player.setHealth(-1);
      player.color = '#f00'
      player.eyeColor = '#fff'
    }
  }
});

levelOne.on('draw', function(context){});

levelOne.on('end', function(){});


/*
*
* LEVEL TWO
*
*/

var levelTwo = levels.create({
  name: 'level one',
  backgroundColor: '#000'
});

levelTwo.on('start', function(){
  log.add('oh, shit! level two!');
})


/*
*
* UI
*
*/

var health = new Text({ 
  el: '#health', 
  html: player.health
});

var coins = new Text({ 
  el: '#coins', 
  html: '0'
});

/*
var strength = new Text({
  el: '#strength',
  html: player.strength
});
*/

var title = new Text({
  el: '#game-title',
  html: 'press space to play!'
});

var log = new Log({
  height: '50px',
  width: '300px',
  appendTo: 'header .container'
});