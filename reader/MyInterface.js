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

	this.type = 'P vs P';
	this.types = ['P vs P', 'P vs CPU', 'CPU vs CPU'];

	this.p1Points = 0;
	this.p2Points = 0;

this.gui.autoListen = false;
var self = this;
	this.defaultControls = [];

		this.defaultControls[0] = this.gui.add(this,'startGame').name('Start Game');
		this.defaultControls[1] = this.gui.add(this, 'playing').name('Playing').listen();
		this.defaultControls[2] = this.gui.add(this, 'p1Points', this.p1Points).name('Player1 Points').listen();
		this.defaultControls[3] = this.gui.add(this, 'p2Points', this.p2Points).name('Player2 Points').listen();
		this.defaultControls[4] = this.gui.add(this, 'type', this.types).name('Type of game').listen();
		this.optionsFolder = this.gui.addFolder('Options');
		this.optionsFolder.open();

		this.defaultControls[5] = this.optionsFolder.add(this, 'difficulty', this.difficulties).name('Difficulty').listen();
		//this.defaultControls[6] = this.optionsFolder.add(this,'undo').name('Undo');

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

	this.scene.setPickEnabled(true);

	if(this.scene.board.history.type == 3){
			if(this.scene.board.history.playing == this.scene.board.history.player1)
				this.points = this.scene.board.history.p1Points;
			else
				this.points = this.scene.board.history.p2Points;
				console.log(this.scene.board.history.difficulty);
			this.scene.board.makeRequest('bot_play(' + this.scene.board.boardToList() + ',' + this.scene.board.history.playing + ',' + this.points + ',' + this.scene.board.history.difficulty + ')');
	}
 }
