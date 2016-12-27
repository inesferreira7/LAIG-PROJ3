function MyCell(scene, x, y, object, color) {
	CGFobject.call(this, scene);

  this.scene=scene;
  this.cell=object;
  this.x = x;
  this.y = y;
	this.id=null;

  this.transfMat = mat4.create();
  mat4.identity(this.transfMat);
  var posx = 2 * this.x;
  var posy =  -2 * this.y;

  this.appearance = new CGFappearance(this.scene);

  if(color == "black"){
    this.appearance.setAmbient(0, 0, 0, 1);
    this.appearance.setDiffuse(0, 0, 0, 1);
    this.appearance.setSpecular(0, 0, 0, 1);
  }

	if(color == "white"){
    this.appearance.setAmbient(1, 1, 1, 1);
    this.appearance.setDiffuse(1, 1, 1, 1);
    this.appearance.setSpecular(1, 1, 1, 1);
  }


  mat4.translate(this.transfMat, this.transfMat, [posx, 0, posy]);

  this.originalTransfMat = mat4.create();
   mat4.identity(this.originalTransfMat);
   mat4.copy(this.originalTransfMat, this.transfMat);
	 this.type = "empty";
   };

MyCell.prototype = Object.create(CGFobject.prototype);
MyCell.prototype.constructor=MyCell;

MyCell.prototype.setId = function(id){
	this.id=id;
}

MyCell.prototype.getId = function(){
	console.log("Picked cell with id " + this.id);
}

MyCell.prototype.display = function(){

  this.scene.pushMatrix();
  this.appearance.apply();
  this.scene.multMatrix(this.transfMat);
  this.cell.display();
  this.scene.popMatrix();
};
