/**
 * MyPiece
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function Queen(scene) {
	CGFobject.call(this,scene);

  this.queen = new MyPiece(this.scene);

	this.queenAppearance = new CGFappearance(this.scene);
	this.queenAppearance.loadTexture("res/red.jpg");
	this.queenAppearance.setDiffuse(0,0,0,1);
	this.queenAppearance.setSpecular(0.5,0.5,0.5,1);
	this.queenAppearance.setShininess(100);
};

Queen.prototype = Object.create(CGFobject.prototype);
Queen.prototype.constructor=Queen;

Queen.prototype.display = function(){
  this.scene.pushMatrix();
  this.scene.scale(1,2,1);
	this.queenAppearance.apply();
  this.queen.display();
  this.scene.popMatrix();
};