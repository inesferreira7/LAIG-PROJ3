/**
 * MyObject
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

function MyBoard(scene){
  CGFobject.call(this,scene);
  this.scene = scene;

  this.initBoardMatrix();
  this.initPieces();

  this.history = new MyHistory(this.scene);


  this.p1 = "player1";
	this.p1Points = 0;
  this.p2 = "player2";
	this.p2Points = 0;
  this.playing = this.p1;

  //NOT SMOOTH CAMERA ANIMATION
  //this.scene.changeCamera('Player2');




};

MyBoard.prototype = Object.create(CGFobject.prototype);
MyBoard.prototype.constructor = MyBoard;

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
   this.scene.scale(0.4,0.4,0.4);

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

  this.pieces[xi][yi].animation = new MyPieceAnimation(this.pieces[xi][yi], xi, yi, xf, yf, 2);
  this.pieces[xi][yi].moving = true;

        console.log("initial " + xi + " " + yi + " final " + xf + " " + yf );

        this.pieces[xf][yf] = this.pieces[xi][yi];
	      this.pieces[xi][yi] = "";

	      this.pieces[xf][yf].x = xf;
	      this.pieces[xf][yf].y = yf;

        this.history.insertMove(xi,yi,xf,yf,playing,points);

};


MyBoard.prototype.showWinner = function(){
 	if(this.history.p1Points > this.history.p2Points){
 		this.winnerP = this.history.p1Points;
 		this.winner = this.history.player1;
 	} else{
 		this.winner = this.history.player2;
 		this.winnerP = this.history.p2Points;
 	}
 	console.log("The winner is " + this.winner + " with " + this.winnerP + " points!!");
 }
