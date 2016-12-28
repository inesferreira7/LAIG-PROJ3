/**
 * MyPiece
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function Drone(scene,x,y) {
	CGFobject.call(this,scene);

  this.drone = new MyPiece(this.scene);
	this.id=null;

  this.droneAppearance = new CGFappearance(this.scene);
	this.droneAppearance.loadTexture("res/green.jpg");
	this.droneAppearance.setDiffuse(0,0,0,1);
	this.droneAppearance.setSpecular(0.5,0.5,0.5,1);
	this.droneAppearance.setShininess(100);

	this.selectedPiece = new CGFappearance(this.scene);
  this.selectedPiece.setDiffuse(0.8,0.8,0,1);
  this.selectedPiece.setSpecular(0.8,0.8,0,1);
  this.selectedPiece.setAmbient(0.8,0.8,0,1);

	this.type = "drone";

	this.x = x;
	this.y = y;
	this.selected = false;
};

Drone.prototype = Object.create(CGFobject.prototype);
Queen.prototype.constructor=Drone;

Drone.prototype.setId = function(id){
	this.id=id;
}

Drone.prototype.getId = function(){
	console.log("Picked drone with id " + this.id + " selected: " + this.selected);
}

Drone.prototype.display = function(){
  this.scene.pushMatrix();
	this.scene.translate(0,0,-0.5);
  this.scene.scale(1,1.5,1);
	if(this.selected ){
		this.selectedPiece.apply();
	}
	else
  	this.droneAppearance.apply();
  this.drone.display();
  this.scene.popMatrix();
};
