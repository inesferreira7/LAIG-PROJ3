
function XMLscene(myInterface) {
  CGFscene.call(this);
  this.myInterface=myInterface;


}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
  CGFscene.prototype.init.call(this, application);

  this.initCameras();

  this.initLights();

  this.gl.clearColor(0.5, 0.5, 0.5, 1.0);

  this.gl.clearDepth(100.0);
  this.gl.enable(this.gl.DEPTH_TEST);
  this.gl.enable(this.gl.CULL_FACE);
  this.gl.depthFunc(this.gl.LEQUAL);

  this.enableTextures(true);



  this.materials = new Stack(null);
  this.textures = new Stack(null);
  this.appearance = new CGFappearance(this);

  this.lightsBoolean=[];

  this.viewIndex=0;
  this.materialIndex = 0;
  this.setUpdatePeriod(100/6);

  this.startTime = 0;

  this.axis=new CGFaxis(this);
  this.board = new MyBoard(this);

  this.currentState = 1;

  this.objects = [];

  this.loadObjects();

  //this.setPickEnabled(true);

  this.objectPicked = null;
  this.destination = null;



};

//Percorrer a matriz para transformar peças em objetos
XMLscene.prototype.loadObjects = function(){
  for(var x=0; x<this.board.matrix.length;x++){
    for(var y=0; y<this.board.matrix[x].length; y++){
      this.objects.push(this.board.matrix[x][y]);
      if(this.board.pieces[x][y] != "")
        this.objects.push(this.board.pieces[x][y]);
    }
  }
};

XMLscene.prototype.initLights = function () {

  this.setGlobalAmbientLight(1,1,1, 1);
  this.lights[0].setPosition(2, 2, 2, 1);
  this.lights[0].setAmbient(0.8, 0.8, 0.8, 1);
  this.lights[0].setDiffuse(1, 1, 1, 1);
  this.lights[0].setSpecular(1, 1, 1, 1);
  this.lights[0].setVisible(true);
  this.lights[0].enable();
  this.lights[0].update();

   this.setGlobalAmbientLight(0,0,0, 1);
  this.lights[1].setPosition(2, 2, 2, 1);
  this.lights[1].setAmbient(0.8, 0.8, 0.8, 1);
  this.lights[1].setDiffuse(1, 1, 1, 1);
  this.lights[1].setSpecular(1, 1, 1, 1);
  this.lights[1].setVisible(true);
  this.lights[1].enable();
  this.lights[1].update();

   this.setGlobalAmbientLight(0,0,0, 1);
  this.lights[2].setPosition(2, 2, 2, 1);
  this.lights[2].setAmbient(0.8, 0.8, 0.8, 1);
  this.lights[2].setDiffuse(1, 1, 1, 1);
  this.lights[2].setSpecular(1, 1, 1, 1);
  this.lights[2].setVisible(true);
  this.lights[2].enable();
  this.lights[2].update();


};

 function Perspective(name, position, direction) {

 	position = typeof position !== 'undefined' ? position : vec3.fromValues(15, 15, 15);
	direction = typeof direction !== 'undefined' ? direction : vec3.fromValues(0, 0, 0);;

 	this.name = name;
 	this.position = position;
 	this.direction = direction;

 	this.cameraMatrix = mat4.create();
 	mat4.identity(this.cameraMatrix);

 }

XMLscene.prototype.initCameras = function () {
  this.perspectives = [];

  this.perspectives[0] = new Perspective('Default', vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
  this.perspectives[1] = new Perspective('Player2', vec3.fromValues(15, 8, 0), vec3.fromValues(0, 0, 0));
  this.perspectives[2] = new Perspective('Player1', vec3.fromValues(-15, 8, 0), vec3.fromValues(0, 0, 0));


  this.camera = new CGFcamera(0.4, 0.1, 500, this.perspectives[2].position, this.perspectives[2].direction);

  this.cameraAnimation = null;

};

// Handler called when the graph is finally loaded.
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function ()
{
  this.gl.clearColor(this.graph.illumination.background.r,this.graph.illumination.background.g,this.graph.illumination.background.b,this.graph.illumination.background.a );
  this.setGlobalAmbientLight(this.graph.illumination.ambient.r,this.graph.illumination.ambient.g,this.graph.illumination.ambient.b,this.graph.illumination.ambient.a);
  this.loadLights();

//  this.updateView();
};

XMLscene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);
};

XMLscene.prototype.logPicking = function ()
{
	if (this.pickMode == false) {
		if (this.pickResults != null && this.pickResults.length > 0) {
			for (var i=0; i< this.pickResults.length; i++) {
				var obj = this.pickResults[i][0];
				if (obj)
				{
					var customId = this.pickResults[i][1];
          if(this.objectPicked != null){
            this.destination = obj;
            if(this.board.history.playing == this.board.history.player1)
              this.points = this.board.history.p1Points;
            else
              this.points = this.board.history.p2Points;

            this.board.makeRequest('make_play(' + this.board.boardToList() + ',' + this.objectPicked.y + ',' +
            this.objectPicked.x + ',' + obj.y + ',' + obj.x + ',Nb,' + this.board.history.playing + ',' + this.points + ',Np)');
          }
          else{
          if(obj.type != "empty");
            this.objectPicked = obj;
				}
        for(var x = 0; x< 8; x++){
          for(var y = 0; y < 4 ; y++){
            if(obj.x == x && obj.y == y){
              console.log("peça selecionada");
                this.board.pieces[x][y].selected = true;
            }
            else {
              this.board.pieces[x][y].selected = false;
            }
          }
        }

        obj.getId();
      }
			}
			this.pickResults.splice(0,this.pickResults.length);
		}
	}
}

XMLscene.prototype.createGraph = function(initialNode){

  var material = null;

  if(initialNode != null){

    var newNode = this.graph.nodes[initialNode];

    if(newNode.material[this.materialIndex] != "inherit"){
      this.materials.push(this.graph.materials[newNode.material[this.materialIndex]]);
      material = this.materials.top();
      this.materials.pop();
      if(material != null){
        this.appearance.setEmission(material.emission.r, material.emission.g, material.emission.b, material.emission.a);
        this.appearance.setAmbient(material.ambient.r,material.ambient.g,material.ambient.b,material.ambient.a);
        this.appearance.setDiffuse(material.diffuse.r,material.diffuse.g,material.diffuse.b,material.diffuse.a);
        this.appearance.setSpecular(material.specular.r,material.specular.g,material.specular.b,material.specular.a);
        this.appearance.setShininess(material.shininess);


      }

    }

    else{

      this.materials.push(this.materials.top());
    }




    if(newNode.texture != "none" && newNode.texture!= "inherit" && newNode.texture != null){
      this.textures.push(newNode.texture.file);
      this.appearance.setTexture(this.textures.top());
      this.appearance.apply();
    }
    if(newNode.texture != null){
      if(newNode.texture == "inherit"){
        this.textures.push(this.textures.top());
      }
    }
    this.textures.pop();

    this.multMatrix(newNode.mat);

    for(var i = 0; i < newNode.animation.length; i++){
      var anim = this.graph.animations[newNode.animation[i]];
      anim.apply(this.elapsedTime, newNode);
      if(anim.complete == false)
        break;
      // this.elapsedTime = 0;
      // this.startTime = 0;
    }

    if(newNode.primitive != null){
      this.pushMatrix();
      newNode.primitive.display();

      this.popMatrix();
    }

    for(var i = 0; i < newNode.componentId.length; i++){
      this.pushMatrix();
      this.createGraph(newNode.componentId[i]);
      this.popMatrix();
    }

  }


};


XMLscene.prototype.update = function(currTime) {

 if (this.startTime == 0)		this.startTime = currTime;

    else{

 	   if(this.cameraAnimation != null){
 		   this.elapsedTime = currTime - this.startTime;
 		   this.moveCamera();
 	   }

   }

  this.elapsedTime = currTime / 1000;
 this.time = currTime;
 this.board.update(currTime);
};

XMLscene.prototype.changeCamera = function(perspective) {

	var temp = null;

	for(var i = 0; i < this.perspectives.length; i++) {

		if(perspective == this.perspectives[i].name)		temp = this.perspectives[i];

	}

	this.cameraAnimation = new MyCameraAnimation(this.camera, temp);

}

XMLscene.prototype.moveCamera = function() {

	var camera = this.camera;
	var anime = this.cameraAnimation;

	if (this.startTime != 0)

		if (Math.abs(anime.travelledPositionDist[0]) < Math.abs(anime.positionDist[0]) ||
			Math.abs(anime.travelledPositionDist[1]) < Math.abs(anime.positionDist[1]) ||
			Math.abs(anime.travelledPositionDist[2]) < Math.abs(anime.positionDist[2]) ||

			Math.abs(anime.travelledDirectionDist[0]) < Math.abs(anime.directionDist[0]) ||
			Math.abs(anime.travelledDirectionDist[1]) < Math.abs(anime.directionDist[1]) ||
			Math.abs(anime.travelledDirectionDist[2]) < Math.abs(anime.directionDist[2]) ) {


			var distPosX = anime.positionVelocity[0] * this.elapsedTime;
			var distPosY = anime.positionVelocity[1] * this.elapsedTime;
			var distPosZ = anime.positionVelocity[2] * this.elapsedTime;

			if(Math.abs(anime.travelledPositionDist[0]) < Math.abs(anime.positionDist[0])) {

				camera.position[0] += distPosX;
				anime.travelledPositionDist[0] += distPosX;

			}

			if(Math.abs(anime.travelledPositionDist[1]) < Math.abs(anime.positionDist[1])) {

				camera.position[1] += distPosY;
				anime.travelledPositionDist[1] += distPosY;

			}

			if(Math.abs(anime.travelledPositionDist[2]) < Math.abs(anime.positionDist[2])) {

				camera.position[2] += distPosZ;
				anime.travelledPositionDist[2] += distPosZ;

			}

			var distDirX = anime.directionVelocity[0] * this.elapsedTime;
			var distDirY = anime.directionVelocity[1] * this.elapsedTime;
			var distDirZ = anime.directionVelocity[2] * this.elapsedTime;

			if(Math.abs(anime.travelledDirectionDist[0]) < Math.abs(anime.directionDist[0])) {

				camera.target[0] += distDirX;
				camera.direction[0] += distDirX;
				anime.travelledDirectionDist[0] += distDirX;

			}

			if(Math.abs(anime.travelledDirectionDist[1]) < Math.abs(anime.directionDist[1])) {

				camera.target[1] += distDirY;
				camera.direction[1] += distDirY;
				anime.travelledDirectionDist[1] += distDirY;

			}

			if(Math.abs(anime.travelledDirectionDist[2]) < Math.abs(anime.directionDist[2])) {

				camera.target[2] += distDirZ;
				camera.direction[2] += distDirZ;
				anime.travelledDirectionDist[2] += distDirZ;

			}

		} else {

			vec3.copy(camera.position, anime.destination.position);
			vec3.copy(camera.direction, anime.destination.direction);
			vec3.copy(camera.target, anime.destination.direction);
			this.cameraAnimation = null;

		}


}


XMLscene.prototype.display = function () {

  this.logPicking();
  this.clearPickRegistration();

  // Clear image and depth buffer everytime we update the scene
  this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
  this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

  // Initialize Model-View matrix as identity (no transformation
  this.updateProjectionMatrix();
  this.loadIdentity();

  // Apply transformations corresponding to the camera position relative to the origin
  this.updateLights();
  this.applyViewMatrix();

  this.setDefaultAppearance();
  //this.axis.display();
  this.board.display();

   if(this.myInterface.started == 1){

	  this.cameraControl();
  }

 // this.board.setPosition(1,3,3);


  if (this.graph.loadedOk)
  {
    this.createGraph("start");
  }

};

XMLscene.prototype.readState = function(state){
  if(this.board.history.type == 1 ){
	if (this.currentState == state){
		return;
	}

	else{

		this.currentState = state;
		if(state == 1){
    //setTimeout(function(){
        	console.log('SUPPOSED TO BE 1' + state);
        this.changeCamera('Player1');
        this.startTime = 0;
    //  }, 1500);


		}
		else{
			if(state == 2){
        //setTimeout(function(){
          console.log('SUPPOSED TO BE 2' + state);
  				this.changeCamera('Player2');
  				this.startTime = 0;
        //},1500);


		}
			else{
				console.log ('WTF IS STATE VALUE HEERE!!!!!!!! ' + state);
				this.changeCamera('Default');
				this.startTime = 0;

			}
		}
	}
}

if(this.board.history.type == 3){
  this.changeCamera('Default');
}

};


XMLscene.prototype.cameraControl = function() {

		var state = 1;

	   if(this.board.isReplay == true)
	  this.changeCamera('Default');
	else{

	//	if(this.board.isDone == true){

		if(this.board.history.isP1 == true){

			state = 1;

		}
		if(this.board.history.isP1 == false){

			state = 2;

		}
	//	}
		this.readState(state);
	}

};

XMLscene.prototype.loadLights = function () {

  var index = 0;

  for(var i=0; i < this.graph.omniLights.length; i++, index++){

    //Percorrer vetor de luzes omni
    var omni = this.graph.omniLights[i];
    this.lights[index].setPosition(omni.location.x, omni.location.y, omni.location.z, omni.location.w);
    this.lights[index].setAmbient(omni.ambient.r, omni.ambient.g, omni.ambient.b, omni.ambient.a);
    this.lights[index].setDiffuse(omni.diffuse.r, omni.diffuse.g, omni.diffuse.b, omni.diffuse.a);
    this.lights[index].setSpecular(omni.specular.r, omni.specular.g, omni.specular.b, omni.specular.a);

    if (omni.enabled) this.lights[index].enable();
    this.lights[index].setVisible(false);
    this.lights[index].update();

    this.lightsBoolean[index] = omni.enabled;
  }

  for(var i=0; i < this.graph.spotLights.length;i++,index++){
    //Percorrer vetor de luzes spot

    var spot = this.graph.spotLights[i];

    this.lights[index].setPosition(spot.location.x, spot.location.y, spot.location.z, spot.location.w);
    this.lights[index].setAmbient(spot.ambient.r, spot.ambient.g, spot.ambient.b, spot.ambient.a);
    this.lights[index].setDiffuse(spot.diffuse.r, spot.diffuse.g, spot.diffuse.b, spot.diffuse.a);
    this.lights[index].setSpecular(spot.specular.r, spot.specular.g, spot.specular.b, spot.specular.a);
    this.lights[index].setSpotDirection((spot.target.x - spot.location.x),(spot.target.y - spot.location.y),(spot.target.z - spot.location.z));
    this.lights[index].setSpotExponent(spot.exponent);

    if (spot.enabled) this.lights[index].enable();
    this.lights[index].setVisible(false);
    this.lights[index].update();

    this.lightsBoolean[index] = spot.enabled;
  }

};

XMLscene.prototype.updateLights = function(){
  for(var i = 0; i < this.lightsBoolean.length; i++){
    this.lights[i].setVisible(true);
    if(this.lightsBoolean[i] == true)
    this.lights[i].enable();
    else
    this.lights[i].disable();

    this.lights[i].update();
  }
};

/*XMLscene.prototype.updateView = function () {
  this.camera = this.graph.perspectives[this.viewIndex];
  this.myInterface.setActiveCamera(this.graph.perspectives[this.viewIndex]);

  this.viewIndex = (++this.viewIndex) % this.graph.perspectives.length;
};
*/
XMLscene.prototype.updateMaterials = function(){

  if(this.materialIndex < this.graph.maxMaterial)
  this.materialIndex ++;
  else {
    this.materialIndex = 0;
  }

};
