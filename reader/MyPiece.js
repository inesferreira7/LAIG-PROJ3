/**
 * MyPiece
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyPiece(scene) {
	CGFobject.call(this,scene);

  


    this.triangle1 = new Triangle(this.scene,-0.5,0,0,0,1,0.5,0.5,0,0);
    this.quad = new MyQuad(this.scene, 0, 1, 0, 1);
    this.quad.initBuffers();
	  this.triangle1.initBuffers();
};

MyPiece.prototype = Object.create(CGFobject.prototype);
MyPiece.prototype.constructor=MyPiece;

MyPiece.prototype.display = function() {

  this.scene.pushMatrix();
    this.triangle1.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
    this.scene.translate(0.5,0,0.5);
    this.scene.rotate(-Math.PI/2, 0, 1, 0);
    this.triangle1.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
    this.scene.translate(-0.5,0,0.5);
    this.scene.rotate(Math.PI/2, 0, 1, 0);
    this.triangle1.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
    this.scene.translate(0,0,1);
    this.scene.rotate(Math.PI, 0, 1, 0);
    this.triangle1.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
    this.scene.translate(0,0,0.5);
    this.scene.rotate(Math.PI/2,1,0,0);
    this.quad.display();
  this.scene.popMatrix();

	};
