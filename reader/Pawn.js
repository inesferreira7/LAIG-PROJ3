/**
 * MyPiece
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function Pawn(scene) {
	CGFobject.call(this,scene);

  this.pawn = new MyPiece(this.scene);
};

Pawn.prototype = Object.create(CGFobject.prototype);
Pawn.prototype.constructor=Pawn;

Pawn.prototype.display = function(){
  this.scene.pushMatrix();
  this.scene.scale(1,1,1);
  this.pawn.display();
  this.scene.popMatrix();
};
