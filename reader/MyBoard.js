function MyBoard(scene){
  CGFobject.call(this,scene);

  this.initBoardMatrix();
};

MyBoard.prototype = Object.create(CGFobject.prototype);
MyBoard.prototype.constructor=MyBoard;

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
 }

 MyBoard.prototype.display = function(){
   this.scene.pushMatrix();
   this.scene.translate(-4,0,5);
   this.scene.scale(0.6,0.6,0.6);
   for(var x=0; x<this.matrix.length; x++){
    for (var y=0; y<4; y++){
       this.matrix[x][y].display();
     }
   }
   this.scene.popMatrix();
 }
