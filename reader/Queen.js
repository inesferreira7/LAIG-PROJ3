/**
 * MyPiece
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function Queen(scene) {
	CGFobject.call(this,scene);

  this.queen = new MyPiece(this.scene);
};

Queen.prototype = Object.create(CGFobject.prototype);
Queen.prototype.constructor=Queen;

Queen.prototype.display = function(){
  this.scene.pushMatrix();
  this.scene.scale(1,2,1);
  this.queen.display();
  this.scene.popMatrix();
};
