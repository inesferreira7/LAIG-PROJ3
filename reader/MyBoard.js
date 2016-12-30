/**
 * MyObject
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

function MyBoard(scene){
  CGFobject.call(this,scene);
  this.scene = scene;

  this.initBoardMatrix();
  this.initAuxiliarBoard();
  this.initPieces();

  this.isReplay = false;

  this.history = null;

  //NOT SMOOTH CAMERA ANIMATION
  //this.scene.changeCamera('Player2');

this.finished=false;


};

MyBoard.prototype = Object.create(CGFobject.prototype);
MyBoard.prototype.constructor = MyBoard;

MyBoard.prototype.initAuxiliarBoard = function(){

   this.auxiliar=[];
   var color;

   for(var x=0; x<5; x++){
     this.auxiliar.push([]);
     for(var y=0; y<4; y++){
       this.auxiliar[x].push(new MyCell(this.scene, x, y, new Cube(this.scene, 2, 0.2, 2), "transp"));
     }
   }
 };

MyBoard.prototype.initBoardMatrix = function(){

   this.matrix=[];

   var color;

   for(var x=0; x<8; x++){
     this.matrix.push([]);
     for(var y=0; y<4; y++){
       if((x+y) % 2 == 0){
         color = "white";
       }
       else{
         color="black";
       }
       this.matrix[x].push(new MyCell(this.scene, x, y, new Cube(this.scene, 2, 0.2, 2), color));
     }
   }
 };

 MyBoard.prototype.initPieces = function(){

  this.pieces = [];

  for(var x=0; x<8; x++){
    this.pieces.push([]);
    for(var y=0; y<4; y++){
      if((x==0 && y==0) || (x==0 && y==1) || (x==1 && y==0) || (x==7 && y==2) || (x==7 && y==3) || (x==6 && y==3)){
        this.pieces[x].push(new Queen(this.scene,x,y));
      }
      else if((x==0 && y==2) || (x==1 && y==1) || (x==2 && y==0) || (x==7 && y==1) || (x==6 && y==2) || (x==5 && y==3)){
        this.pieces[x].push(new Drone(this.scene,x,y));
      }
      else if((x==1 && y==2) || (x==2 && y==2) || (x==2 && y==1) || (x==6 && y==1) || (x==5 && y==1) || (x==5 && y==2)){
        this.pieces[x].push(new Pawn(this.scene,x,y));
      }
      else
        this.pieces[x].push("");
    }
  }
};


 MyBoard.prototype.display = function(){
   this.scene.pushMatrix();
   this.scene.translate(-2.5,0,1);
   this.scene.scale(0.35,0.35,0.35);

   var i=0; //necessario para atribuir ids

   for(var x=0; x<this.matrix.length; x++){
    for (var y=0; y<4; y++){
      this.scene.pushMatrix();
            this.scene.registerForPick(i, this.matrix[x][y]);
            i++;
            this.matrix[x][y].setId(i-1);

       this.matrix[x][y].display();
       this.scene.popMatrix();

       if(this.pieces[x][y] != ""){
         this.scene.pushMatrix();

              this.scene.registerForPick(i, this.pieces[x][y]);
              i++;
              this.pieces[x][y].setId(i-1);
         this.scene.multMatrix(this.matrix[x][y].transfMat);
         this.pieces[x][y].display();
         this.scene.popMatrix();
       }
     }
   }
   this.scene.popMatrix();

   this.scene.pushMatrix();
   this.scene.translate(-1.5,-0.1,-1.5);
   this.scene.scale(0.30,0.30,0.26);
   for(var x=0; x <5;x++){
     for(var y=0; y < 4; y++){
       this.auxiliar[x][y].display();
        }
   }
   this.scene.popMatrix();
 };

 MyBoard.prototype.update = function(currTime){
	for(var x=0; x<this.matrix.length; x++){
		for (var y=0; y<4; y++){
			if(this.pieces[x][y] != "")
				if(this.pieces[x][y].animation != null){
					this.pieces[x][y].animation.update(currTime);
				}
		}
	}
};

MyBoard.prototype.make_move = function(xi,yi,xf,yf,playing,points){
  if(this.finished == false){
    this.pieces[xi][yi].animation = new MyPieceAnimation(this.pieces[xi][yi], xi, yi, xf, yf, 0.5);
    this.pieces[xi][yi].moving = true;

        console.log("initial " + xi + " " + yi + " final " + xf + " " + yf );
        this.history.insertMove(new MyMove(this.scene, xi, yi, xf, yf, this.pieces[xi][yi], this.pieces[xf][yf], playing, points));

        break_loop:
        if(this.pieces[xf][yf] != ""){
        for(var x=0; x < 5; x++){
          for(var y=0; y < 4; y++){
            if(this.auxiliar[x][y].free == true){
              this.pieces[xf][yf].animation = new MyPieceAnimation(this.pieces[xf][yf],1,1,-x,-y, 0.5);
              this.pieces[xf][yf].moving = true;
              this.auxiliar[x][y] = this.pieces[xf][yf];
              this.auxiliar[x][y].selected = false;
              console.log("Substituicao");
              this.auxiliar[x][y].free = false;
              console.log("Passou a falso");
              console.log(this.auxiliar[x][y].type);
              break break_loop;

            }
          }
        }
      }

        this.pieces[xf][yf] = this.pieces[xi][yi];
	      this.pieces[xi][yi] = "";

	      this.pieces[xf][yf].x = xf;
	      this.pieces[xf][yf].y = yf;

      }


}


MyBoard.prototype.get_bot_move = function(msg){
  if(this.finished == false){
 var yi = parseFloat(msg.substring(1,2));
 var xi = parseFloat(msg.substring(3,4));
 var yf = parseFloat(msg.substring(5,6));
 var xf = parseFloat(msg.substring(7,8));
 if(msg.length == 11)
 var np = parseFloat(msg.substring(9,10));
 else {
   var np = parseFloat(msg.substring(9,11));
 }

 this.make_move(xi, yi, xf, yf, this.history.playing, np);
 }
}

MyBoard.prototype.showWinner = function(){
 	if(this.history.p1Points > this.history.p2Points){
 		this.winnerP = this.history.p1Points;
 		this.winner = this.history.player1;
    this.finished=true;
 	} else{
 		this.winner = this.history.player2;
 		this.winnerP = this.history.p2Points;
    this.finished=true;
 	}
 	console.log("The winner is " + this.winner + " with " + this.winnerP + " points!!");
 }

 MyBoard.prototype.undo = function(){
	if(this.history.type == 1){

		if(this.history.moves.length < 1)
			return;

		var lastMove = this.history.moves[this.history.moves.length - 1];
		this.history.moves.pop();


		if(lastMove.initialElement != ""){
			lastMove.initialElement.x = lastMove.xi;
			lastMove.initialElement.y = lastMove.yi;
		}

		if(lastMove.finalElement != ""){
			lastMove.finalElement.x = lastMove.xf;
			lastMove.finalElement.y = lastMove.yf;
		}

		this.pieces[lastMove.xf][lastMove.yf] = lastMove.finalElement;
		this.pieces[lastMove.xi][lastMove.yi] = lastMove.initialElement;

		this.history.playing = lastMove.playing;
		this.scene.myInterface.playing = lastMove.playing;

		if(this.history.playing == this.history.player1){
			this.history.p1Points = lastMove.points;
		}
	}
	else if(this.history.type == 2){

		if(this.history.moves.length < 2)
			return;

		var penultimateMove = this.history.moves[this.history.moves.length - 1];
		var lastMove = this.history.moves[this.history.moves.length - 2];

		this.history.moves.pop();
		this.history.moves.pop();

    var xi = lastMove.xi;
    var yi = lastMove.yi;
    var xf = lastMove.xf;
    var yf = lastMove.yf;

		if(lastMove.initialElement != ""){
			lastMove.initialElement.x = lastMove.xi;
			lastMove.initialElement.y = lastMove.yi;
		}

		if(lastMove.finalElement != ""){
			lastMove.finalElement.x = lastMove.xf;
			lastMove.finalElement.y = lastMove.yf;
		}

		this.pieces[lastMove.xf][lastMove.yf] = lastMove.finalElement;
		this.pieces[lastMove.xi][lastMove.yi] = lastMove.initialElement;

    var xi1 = penultimateMove.xi;
		var yi1 = penultimateMove.yi;
		var xf1 = penultimateMove.xf;
		var yf1 = penultimateMove.yf;



		if(penultimateMove.initialElement != ""){
			penultimateMove.initialElement.x =  xi1;
			penultimateMove.initialElement.y =  yi1;
		}

		if(penultimateMove.finalElement != ""){
			penultimateMove.finalElement.x = xf1;
			penultimateMove.finalElement.y = yf1;
		}

		this.pieces[xf1][yf1] = penultimateMove.finalElement;
		this.pieces[xi1][yi1] = penultimateMove.initialElement;
	}
}
