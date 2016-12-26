/**
 * MyPiece
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function Drone(scene) {
	CGFobject.call(this,scene);

  this.drone = new MyPiece(this.scene);

  this.droneAppearance = new CGFappearance(this.scene);
	this.droneAppearance.loadTexture("res/green.jpg");
	this.droneAppearance.setDiffuse(0,0,0,1);
	this.droneAppearance.setSpecular(0.5,0.5,0.5,1);
	this.droneAppearance.setShininess(100);
};

Drone.prototype = Object.create(CGFobject.prototype);
Queen.prototype.constructor=Drone;

Drone.prototype.display = function(){
  this.scene.pushMatrix();
  this.scene.scale(1,1.5,1);
  this.droneAppearance.apply();
  this.drone.display();
  this.scene.popMatrix();
};
