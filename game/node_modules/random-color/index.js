module.exports = color;

function num(cap){
  return Math.floor( Math.random() * cap );
}

function color(cap){
  cap || ( cap = 255 );
  return 'rgb(' + num(cap) + ', ' + num(cap) + ', ' + num(cap) + ')';
}
