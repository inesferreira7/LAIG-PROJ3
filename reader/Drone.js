/**
 * MyPiece
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function Drone(scene) {
	CGFobject.call(this,scene);

  this.drone = new MyPiece(this.scene);
};

Drone.prototype = Object.create(CGFobject.prototype);
Queen.prototype.constructor=Drone;

Drone.prototype.display = function(){
  this.scene.pushMatrix();
  this.scene.scale(1,1.5,1);
  this.drone.display();
  this.scene.popMatrix();
};
