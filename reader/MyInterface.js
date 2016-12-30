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

	this.skin = 'proj3.xml'
	this.skins = ['casino.xml', 'proj3.xml'];

	this.type = 'P vs P';
	this.types = ['P vs P', 'P vs CPU', 'CPU vs CPU'];

	this.started = 0;
	this.p1Points = 0;
	this.p2Points = 0;
	this.timeLeft = 20;
	this.countdownTimer;

this.gui.autoListen = false;
var self = this;
	this.defaultControls = [];

		this.defaultControls[0] = this.gui.add(this,'startGame').name('Start Game');
		this.defaultControls[1] = this.gui.add(this, 'playing').name('Playing').listen();
		this.defaultControls[2] = this.gui.add(this, 'timeLeft').name('Countdown').listen();
		this.defaultControls[3] = this.gui.add(this, 'p1Points', this.p1Points).name('Player1 Points').listen();
		this.defaultControls[4] = this.gui.add(this, 'p2Points', this.p2Points).name('Player2 Points').listen();
		this.defaultControls[5] = this.gui.add(this, 'type', this.types).name('Type of game').listen();
		this.optionsFolder = this.gui.addFolder('Options');
		this.optionsFolder.open();

		this.defaultControls[6] = this.optionsFolder.add(this, 'difficulty', this.difficulties).name('Difficulty').listen();
		this.defaultControls[7] = this.optionsFolder.add(this,'lastMove').name('Undo');
		this.defaultControls[8] = this.optionsFolder.add(this,'gameMovie').name('See Game Movie');
		this.defaultControls[9] = this.optionsFolder.add(this, 'skin',this.skins).name('Appearance').listen();
		this.defaultControls[10] = this.optionsFolder.add(this, 'change').name('Change');



	return true;
};

MyInterface.prototype.change = function(){
	this.scene.changeApp(this.skin);
}

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

MyInterface.prototype.gameMovie = function(event){
			if(this.scene.board.finished == true){
				this.p1Points = this.p1Points;
				this.p2Points = this.p2Points;
				this.scene.board.initBoardMatrix();
				this.scene.board.initAuxiliarBoard();
				this.scene.board.initPieces();
				if(this.scene.board.history.type != 3){
						this.scene.changeCamera('Default');
				}

				this.replayIndex = 0;

				this.replayAll();
			}

}

MyInterface.prototype.replayAll = function(){
	setTimeout(function () {
		console.log("repeat");
		if(this.replayIndex < this.scene.board.history.moves.length){
			this.replay();
			this.replayAll();
			this.replayIndex++;
		}
		else{
			console.log("acabou!");
		}
	}.bind(this), 1100);

}

MyInterface.prototype.replay = function(){
	var move = this.scene.board.history.moves[this.replayIndex];

		var xi = move.xi;
		var yi = move.yi;
		var xf = move.xf;
		var yf = move.yf;


		this.scene.board.pieces[xi][yi].animation = new MyPieceAnimation(this.scene.board.pieces[xi][yi], xi, yi, xf, yf, 0.5);
		this.scene.board.pieces[xi][yi].moving = true;

		break_loop:
		if(this.scene.board.pieces[xf][yf] != ""){
		for(var x=0; x < 5; x++){
			for(var y=0; y < 4; y++){
				if(this.scene.board.auxiliar[x][y].free == true){
					this.scene.board.pieces[xf][yf].animation = new MyPieceAnimation(this.scene.board.pieces[xf][yf],1,1,-x,-y, 0.5);
					this.scene.board.pieces[xf][yf].moving = true;
					this.scene.board.auxiliar[x][y] = this.scene.board.pieces[xf][yf];
					this.scene.board.auxiliar[x][y].selected = false;
					console.log("Substituicao");
					this.scene.board.auxiliar[x][y].free = false;
					console.log("Passou a falso");
					console.log(this.scene.board.auxiliar[x][y].type);
					break break_loop;

				}
			}
		}
	}

	this.scene.board.pieces[xf][yf] = this.scene.board.pieces[xi][yi];
	this.scene.board.pieces[xi][yi] = "";

	this.scene.board.pieces[xf][yf].x = xf;
	this.scene.board.pieces[xf][yf].y = yf;
}

MyInterface.prototype.startGame = function(){

	this.scene.board.history = new MyHistory(this.scene);
	this.scene.board.makeRequest('init');
	this.started = 1;

	this.scene.setPickEnabled(true);
	//this.scene.board.countdown();
	this.countdown();

	if(this.scene.board.history.type == 3){
			if(this.scene.board.history.playing == this.scene.board.history.player1)
				this.points = this.scene.board.history.p1Points;
			else
				this.points = this.scene.board.history.p2Points;
				console.log(this.scene.board.history.difficulty);
			this.scene.board.makeRequest('bot_play(' + this.scene.board.boardToList() + ',' + this.scene.board.history.playing + ',' + this.points + ',' + this.scene.board.history.difficulty + ')');
	}
 }

 MyInterface.prototype.lastMove = function(){
	this.scene.board.undo();
}

MyInterface.prototype.countdown = function(){

	var _this = this;

	_this.countdownTimer = setInterval(function () {
				_this.countUp();
		}, 1000);
}

MyInterface.prototype.countUp = function(){
	if(this.timeLeft >0){
		this.timeLeft--;
	}
	else{
		this.scene.board.history.changeJogada();
			clearInterval(this.countdownTimer);
			this.timeLeft = 20;
			this.countdown();
		}


	}
