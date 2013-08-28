var inherits = require('inherits');
var Entity = require('crtrdg-entity');

module.exports = Enemy;
inherits(Enemy, Entity);

function Enemy(options){
  var self = this;

  this.position = { 
    x: options.position ? options.position.x : randomInteger(100, 2500), 
    y: options.position ? options.position.y : 120 
  };

  this.size = {
    x: options.size ? options.size.x : 200,
    y: options.size ? options.size.x : 200
  };

  this.velocity = {
    x: options.velocity ? options.velocity.x : 10,
    y: options.velocity ? options.velocity.y : 10
  };

  this.camera = options.camera;
  this.health = options.health || 200;
  this.speed = options.speed || 15;
  this.friction = options.friction || 0.8;
  this.color = options.color;
  
  this.on('update', function(interval){
    self.move();
    this.velocity.y += 1.5;
    self.boundaries();
  });

  this.on('draw', function(c){
    c.fillStyle = randomColor();
    c.fillRect(this.position.x - this.camera.position.x, this.position.y - this.camera.position.y, this.size.x, this.size.y);  
  });
}

Enemy.prototype.move = function(){
  this.position.x += this.velocity.x * this.friction;
  this.position.y += this.velocity.y * this.friction;
};

Enemy.prototype.boundaries = function(){
  if (this.position.x <= 0){
    this.velocity.x *= -1;
  }

  if (this.position.x >= 3000 - this.size.x){
    this.velocity.x *= -1;
  }

  if (this.position.y <= 0){
    this.position.y = 0;
  }

  if (this.position.y >= 320 - this.size.y){
    this.position.y = 320 - this.size.y;
    this.velocity.y = -10;
    this.jumping = false;
  }
};

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}