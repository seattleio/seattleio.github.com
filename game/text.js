/* 
*
* TEXT UTILITIES
*
*/

module.exports = Text;

function Text(options){
  this.el = document.querySelector(options.el);
  if (options.html) {
    this.update(options.html);
  }
}

Text.prototype.update = function(text){
  this.el.innerHTML = text;
}

Text.prototype.empty = function(text){
  this.el.innerHTML = '';
}