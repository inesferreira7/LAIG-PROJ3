/**
 * MyPiece
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function Pawn(scene,x,y) {
	CGFobject.call(this,scene);

  this.pawn = new MyPiece(this.scene);
	this.id=null;

	this.pawnAppearance = new CGFappearance(this.scene);
	this.pawnAppearance.loadTexture("res/blue.jpg");
	this.pawnAppearance.setDiffuse(0,0,0,1);
	this.pawnAppearance.setSpecular(0.5,0.5,0.5,1);
	this.pawnAppearance.setShininess(100);

	this.selectedPiece = new CGFappearance(this.scene);
  this.selectedPiece.setDiffuse(0.8,0.8,0,1);
  this.selectedPiece.setSpecular(0.8,0.8,0,1);
  this.selectedPiece.setAmbient(0.8,0.8,0,1);

	this.type = "pawn";
	this.x = x;
	this.y = y;
	this.selected = false;

	this.animation = null;
  this.moving = false;
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

	if(this.animation != null && this.moving){
	  this.animation.apply();

	}
	
	if(this.selected ){
		this.selectedPiece.apply();
	}
	else
		this.pawnAppearance.apply();
  this.pawn.display();
  this.scene.popMatrix();
};
