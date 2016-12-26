/**
 * MyObject
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyQuad(scene, minS , maxS , minT , maxT ) {
	CGFobject.call(this,scene);
	this.minS = minS || 0;
	this.maxS = maxS || 1;
	this.minT = minT || 0;
	this.maxT = maxT || 1;

	this.initBuffers();
};

MyQuad.prototype = Object.create(CGFobject.prototype);
MyQuad.prototype.constructor=MyQuad;

MyQuad.prototype.initBuffers = function () {
	this.vertices = [
            -0.5, -0.5, 0,
            0.5, -0.5, 0,
            -0.5, 0.5, 0,
            0.5, 0.5, 0,
	];

	this.indices = [
            0, 1, 2,
            3, 2, 1
    ];

    this.normals = [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1
    ];

	this.texCoords = [
			this.minS, this.minS,
			this.maxS, this.minS,
			this.minS, this.maxS,
			this.maxS, this.maxS
	]

	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};
