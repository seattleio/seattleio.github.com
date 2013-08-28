var inherits = require('inherits');
var Entity = require('crtrdg-entity');

module.exports = Item;
inherits(Item, Entity);

function Item(options){
  this.name = options.name;

  this.position = {
    x: options.position.x,
    y: options.position.y
  };

  this.size = {
    x: 20,
    y: 20
  };

  this.color = options.color;
  this.camera = options.camera;

  this.on('draw', function(c){
    c.fillStyle = this.color;
    c.fillRect(this.position.x - this.camera.position.x, this.position.y - this.camera.position.y, this.size.x, this.size.y);  
  });
}