/**
 * MyPiece
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function Queen(scene,x,y) {
	CGFobject.call(this,scene);

  this.queen = new MyPiece(this.scene);
	this.id=null;

	this.queenAppearance = new CGFappearance(this.scene);
	this.queenAppearance.loadTexture("res/red.jpg");
	this.queenAppearance.setDiffuse(0,0,0,1);
	this.queenAppearance.setSpecular(0.5,0.5,0.5,1);
	this.queenAppearance.setShininess(100);

	this.selectedPiece = new CGFappearance(this.scene);
  this.selectedPiece.setDiffuse(0.8,0.8,0,1);
  this.selectedPiece.setSpecular(0.8,0.8,0,1);
  this.selectedPiece.setAmbient(0.8,0.8,0,1);
	this.type = "queen";

	this.x = x;
	this.y = y;
	this.selected = false;

	this.animation = null;
  this.moving = false;
};

Queen.prototype = Object.create(CGFobject.prototype);
Queen.prototype.constructor=Queen;

Queen.prototype.setId = function(id){
	this.id=id;
}

Queen.prototype.getId = function(){
	console.log("Picked queen with id " + this.id);
}

Queen.prototype.display = function(){
  this.scene.pushMatrix();
	this.scene.translate(0,0,-0.5);
	this.scene.scale(1,2,1);

	if(this.animation != null && this.moving){
	  this.animation.apply();

	}

	if(this.selected ){
		this.selectedPiece.apply();
	}
	else
		this.queenAppearance.apply();
  this.queen.display();
  this.scene.popMatrix();
};
