/**
 * MyPiece
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function Pawn(scene) {
	CGFobject.call(this,scene);

  this.pawn = new MyPiece(this.scene);
	this.id=null;

	this.pawnAppearance = new CGFappearance(this.scene);
	this.pawnAppearance.loadTexture("res/blue.jpg");
	this.pawnAppearance.setDiffuse(0,0,0,1);
	this.pawnAppearance.setSpecular(0.5,0.5,0.5,1);
	this.pawnAppearance.setShininess(100);
};

Pawn.prototype = Object.create(CGFobject.prototype);
Pawn.prototype.constructor=Pawn;

Pawn.prototype.setId = function(id){
	this.id=id;
}

Pawn.prototype.getId = function(){
	console.log("Picked pawn with id " + this.id);
}

Pawn.prototype.display = function(){
  this.scene.pushMatrix();
	this.scene.translate(0,0,-0.5);
  this.scene.scale(1,1,1);
	this.pawnAppearance.apply();
  this.pawn.display();
  this.scene.popMatrix();
};
