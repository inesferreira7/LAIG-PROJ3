function MyHistory(scene){

this.scene=scene;
this.player1="player1";
this.player2="player2";
this.playing = this.player1;
this.p1Points=0;
this.p2Points=0;

this.moves=[];

}

MyHistory.prototype.insertMove = function(move){
  this.moves.push(move);

  if(this.playing == this.player1){
    this.playing = this.player2;
    this.p1Points = move.points;
  } else{
    this.playing = this.player1;
    this.p2Points = move.points;
  }

  this.scene.myInterface.playing = this.playing;
}
