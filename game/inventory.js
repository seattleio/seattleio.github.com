var inherits = require('inherits');

module.exports = Inventory;

function Inventory(game){
  this.game = game;
  this.game.inventory = {};

  this.createHTML();

  var self = this;

  this.game.on('update', function(interval){
    if (self.isEmpty() === false){
      self.el.style.display = 'block';
    } else {
      self.el.style.display = 'none';
    }
  });
}

Inventory.prototype.createHTML = function(){
  this.el = document.createElement('ul');

  var h3 = document.createElement('h3');
  h3.innerHTML = 'inventory';

  this.el.appendChild(h3);

  document.body.appendChild(this.el);
};

Inventory.prototype.add = function(item){
  var self = this;

  this.findItem(item.name, function(exists, items){

    if (exists === false){

      items[item.name] = {
        item: item,
        quantity: 1
      }

      var li = document.createElement('li');
      li.innerHTML = item.name;
      li.id = item.name;
      self.el.appendChild(li);

    } else {
      items[item.name].quantity += 1;
    }

  });
};

Inventory.prototype.remove = function(item){
  var self = this;

  this.findItem(item.name, function(exists, items){
    if (exists){
      if (items[item.name].quantity > 1){
        items[item.name].quantity -= 1;
      } else {
        delete items[item.name];
        var itemEl = document.getElementById(item.name);
        self.el.removeChild(itemEl);
      }
    }
  });
};

Inventory.prototype.list = function(){
  return this.game.inventory.join(', ');
};

Inventory.prototype.findItem = function(itemNameToFind, callback){
  if (this.isEmpty()){
    return callback(false, this.game.inventory);
  }

  this.each(function(item, items){
    if (itemNameToFind === item){
      return callback(true, items);
    } else {
      return callback(false, items);
    }
  });
};

Inventory.prototype.hasItem = function hasItem(itemName, callback){
  this.findItem(itemName, function(exists, items){
    if (exists){
      return callback(true);
    } else {
      return callback(false);
    }
  });
};

Inventory.prototype.each = function each(callback){
  for (var item in this.game.inventory){
    callback(item, this.game.inventory);
  }
};

Inventory.prototype.isEmpty = function isEmpty(){
  var inventory = this.game.inventory;

  for(var item in inventory) {
    if(inventory.hasOwnProperty(item)){
      return false;
    }      
  }
  return true;
};