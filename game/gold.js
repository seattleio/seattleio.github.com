var inherits = require('inherits');
var Entity = require('crtrdg-entity');

module.exports = Gold;
inherits(Gold, Entity);

function Gold(options){
  var self = this;

  this.name = options.name;

  this.position = {
    x: options.position.x,
    y: options.position.y
  };

  this.size = {
    x: 20,
    y: 20
  };

  this.velocity = {
    x: 0,
    y: 0
  };

  this.color = options.color;
  this.camera = options.camera;
  this.growing = true;

  this.on('update', function(){
    self.move();
    self.velocity.y += .8;
    self.growAndShrink(); 
    self.boundaries();
  })

  this.on('draw', function(c){
    c.fillStyle = this.color;
    c.fillRect(this.position.x - this.camera.position.x, this.position.y - this.camera.position.y, this.size.x, this.size.y);  
  });
}

Gold.prototype.move = function(){
  this.position.x += this.velocity.x * 0.1;
  this.position.y += this.velocity.y * 0.1;
};

Gold.prototype.growAndShrink = function(){
  if (this.growing){
    this.position.x -= .1;
    this.size.x += .2;
    this.size.y += .1;
    if (this.size.x >= 22){
      this.growing = false;
    }
  } else {
    this.position.x += .1;
    this.size.x -= .2;
    this.size.y -= .1;
    if (this.size.x <= 18){
      this.growing = true;
    }
  }
}

Gold.prototype.boundaries = function(){
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