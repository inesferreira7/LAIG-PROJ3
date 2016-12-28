  function MyCameraAnimation(origin, destination) {

 	this.origin = origin;
 	this.destination = destination;
	this.span = 100000;
 	var originPosition = this.origin.position;
 	var destinationPosition = this.destination.position;
	//set distance for position
 	this.positionDist = vec3.create();

 	vec3.subtract(this.positionDist, destinationPosition, originPosition);
	
	this.positionVelocity = vec3.create(); 
 	this.positionVelocity[0] = this.positionDist[0] / this.span;
 	this.positionVelocity[1] = this.positionDist[1] / this.span;
 	this.positionVelocity[2] = this.positionDist[2] / this.span;
	
 	this.travelledPositionDist = vec3.create(0, 0, 0);


 	var originDirection = this.origin.direction;
 	var destinationDirection = this.destination.direction;
	//set "distance" for direction to where the camera is faced
 	this.directionDist = vec3.create();

 	vec3.subtract(this.directionDist, destinationDirection, originDirection);
	
	this.directionVelocity = vec3.create(); 
 	this.directionVelocity[0] = this.directionDist[0] / this.span;
 	this.directionVelocity[1] = this.directionDist[1] / this.span;
 	this.directionVelocity[2] = this.directionDist[2] / this.span;
	
 	this.travelledDirectionDist = vec3.create(0, 0, 0);

 }