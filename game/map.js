randomColor = require('random-color');

module.exports = Map;

function Map(game, width, height){
  this.game = game;
  this.width = width;
  this.height = height;
  this.image = null;
}

Map.prototype.generate = function(callback){
  var ctx = document.createElement('canvas').getContext('2d');

  ctx.canvas.width = this.width;
  ctx.canvas.height = this.height;

  var rows = parseInt(this.width/16+1);
  var columns = parseInt(this.height/16+1);

  ctx.save();     
  for (var x = 0, i = 0; i < rows; x+=16, i++) {
    for (var y = 0, j=0; j < columns; y+=16, j++) { 
      ctx.beginPath();      
      ctx.fillStyle = randomColor(155);                
      ctx.rect(x, y, 15, 15);        
      ctx.fill();
      ctx.closePath();
    }
    
  }   
  ctx.restore();  
  
  // store the generate map as this image texture
  this.image = new Image();
  this.image.src = ctx.canvas.toDataURL("image/png");         
  
  // clear context
  ctx = null;
}

// draw the map adjusted to camera
Map.prototype.draw = function(context, xView, yView){         
  context.drawImage(this.image, 0, 0, this.image.width, this.image.height, -xView, -yView, this.image.width, this.image.height);
}