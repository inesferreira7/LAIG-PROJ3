/**
 * MyPieceAnimation
 * @constructor
 */
 function MyPieceAnimation(piece, xi, yi, xf, yf, span) {
   MyAnimation.apply(this, arguments);
   this.deltaX = xi-xf;
   this.deltaZ = -(yi-yf);

   this.piece = piece;

   this.span=span;

   this.initialTime = this.piece.scene.time;

   this.matrix = mat4.create();
   mat4.translate(this.matrix, this.matrix, [this.deltaX, 0, this.deltaZ]);
 }

MyPieceAnimation.prototype = new MyAnimation();
MyPieceAnimation.prototype.constructor = MyPieceAnimation;

MyPieceAnimation.prototype.isComplete = function(currentTime){
  var timePassed = (currentTime - this.initialTime)/1000;

  return timePassed > this.span;
};

MyPieceAnimation.prototype.update = function(currentTime){
  var timePassed = (currentTime - this.initialTime)/1000;
  this.matrix = mat4.create();

  if(timePassed >= this.span){
    this.piece.moving = false;
    this.piece.animation = null;
    return;
  }
  var movementRatio = 1- (timePassed/this.span);

  mat4.translate(this.matrix, this.matrix, [this.deltaX*movementRatio*2, 0, this.deltaZ*movementRatio*2]);
};

MyPieceAnimation.prototype.apply = function(){
  this.piece.scene.multMatrix(this.matrix);
};
