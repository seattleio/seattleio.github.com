var inherits = require('inherits');
var Entity = require('crtrdg-entity');

module.exports = Coin;
inherits(Coin, Entity);

function Coin(options){
  this.name = options.name;

  this.position = {
    x: options.position.x,
    y: options.position.y
  };

  this.size = {
    x: 50,
    y: 50
  };

  this.color = options.color;
}