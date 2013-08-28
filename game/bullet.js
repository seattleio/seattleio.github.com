var inherits = require('inherits');
var Entity = require('crtrdg-entity');

module.exports = Bullet;
inherits(Bullet, Entity);

function Bullet(options){  
  this.size = {
    x: 10,
    y: 10
  };

  this.target = {
    x: options.target.x,
    y: options.target.y
  }

  this.position = { 
    x: options.position.x - this.size.x / 2, 
    y: options.position.y - this.size.y / 2 
  };

  this.velocity = {
    x: 0,
    y: 0
  };

  this.camera = options.camera;

  this.dx = (this.target.x - this.position.x);
  this.dy = (this.target.y - this.position.y);
  this.mag = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
  this.speed = 20;
  this.color = '#fff';

  this.on('update', function(interval){

    this.velocity.x = (this.dx / this.mag) * this.speed;
    this.velocity.y = (this.dy / this.mag) * this.speed;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    this.boundaries();
  });

  this.on('draw', function(context){
    context.fillStyle = this.color;
    context.fillRect(this.position.x - this.camera.position.x, this.position.y - this.camera.position.y, this.size.x, this.size.y);
  });

  return this;
}

Bullet.prototype.boundaries = function(){
  if (this.position.x < 0){
    this.remove();
  }

  if (this.position.x > 3000){
    this.remove();
  }

  if (this.position.y < 0){
    this.remove();
  }

  if (this.position.y > 320){
    this.remove();
  }
};