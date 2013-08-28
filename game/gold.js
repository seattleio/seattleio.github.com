var inherits = require('inherits');
var Entity = require('crtrdg-entity');

module.exports = Gold;
inherits(Gold, Entity);

function Gold(options){
  this.name = options.name;

  this.position = {
    x: options.position.x,
    y: options.position.y
  };

  this.size = {
    x: 10,
    y: 10
  };

  this.color = options.color;
}