/**
 * MyInterface
 * @constructor
 */

function MyInterface() {
	CGFinterface.call(this);
};

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

/**
 * init
 * @param {CGFapplication} application
 */
MyInterface.prototype.init = function(application) {
	// call CGFinterface init
	CGFinterface.prototype.init.call(this, application);

	this.gui = new dat.GUI();

	this.playing = 'player1';
	this.difficulty = 'Dumb';
	this.difficulties = [ 'Dumb', 'Smart'];
	var self = this;
	this.type = 'P vs P';
	this.types = ['P vs P', 'P vs CPU', 'CPU vs CPU'];
	this.gui.autoListen = false;



/*	this.defaultControls = [];

	this.defaultControls[0] = this.gui.add(this,'startGame').name('Start Game');
	this.defaultControls[1] = this.gui.add(this, 'playing').name('Playing').listen();
	this.defaultControls[2] = this.gui.add(this, 'type', this.types).name('Type of game').listen();
	this.optionsFolder = this.gui.addFolder('Options');
	this.optionsFolder.open();

	this.defaultControls[3] = this.optionsFolder.add(this, 'difficulty', this.difficulties).name('Difficulty').listen();*/

	return true;
};



MyInterface.prototype.processKeyDown = function(event) {
	CGFinterface.prototype.processKeyboard.call(this,event);
    switch (event.keyCode) {
        case (86):
        case (118): //v maiusculo ou minusculo
            this.scene.updateView();
            break;
				case(77):
				case(109):
						this.scene.updateMaterials();
						break;
    };

};

MyInterface.prototype.startGame = function(){
	this.scene.board.history = new MyHistory(this.scene);
 	this.scene.board.makeRequest('init');
 }
