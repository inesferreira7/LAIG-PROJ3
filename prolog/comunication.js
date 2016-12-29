MyBoard.prototype.getPrologRequest = function(requestString, onSuccess, onError, port)
{
  var requestPort = port || 8081
  var request = new XMLHttpRequest();

  var board = this;
  request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

  request.onload = onSuccess || function(data){
    console.log("Request successful. Reply: " + data.target.response);

 		var response = data.target.response;

    if(response == 'goodbye')
    return;

    if(response == 'play')
      console.log("Game is not over, pls continue playing");

      if(response == 'endgame'){
       board.showWinner();
       board.finished = true;
       return;
     }

      var cmd = requestString.substring(0, 9);
      console.log("cmg " + cmd);
      var bot = requestString.substring(0,3);
      console.log("bot " + bot);
      if(bot == 'bot'){

       if(response != 'Bad Request'){
         board.get_bot_move(response);
         board.makeRequest('checkend(' + board.boardToList() + ',8,P1,P2)');
         if(board.history.type == 3){
             setTimeout(function(){
               var points;
               if(board.history.playing == board.history.player1)
                 points = board.history.p1Points;
               else
                 points = board.history.p2Points;
               board.makeRequest('bot_play(' + board.boardToList() + ',' + board.history.playing + ',' + points + ',' + board.history.difficulty + ')');
             }, 1200);
       }
     }
     }

      if(cmd == 'make_play'){
        if(response == 'invalid'){
          console.log("Invalid play, pls try another move...");
        }
        else if(response != 'Bad Request'){

          board.make_move(board.scene.objectPicked.x, board.scene.objectPicked.y, board.scene.destination.x, board.scene.destination.y,board.history.playing,parseFloat(response));
          board.makeRequest('checkend(' + board.boardToList() + ',8,P1,P2)');

          if(board.history.type == 2){
             setTimeout(function(){
               var points;
               if(board.history.playing == board.history.player1)
                 points = board.history.p1Points;
               else
                 points = board.history.p2Points;
               board.makeRequest('bot_play(' + board.boardToList() + ',' + board.history.playing + ',' + points + ',' + board.history.difficulty + ')');
             }, 1200);
           }
         }


        board.scene.objectPicked = null;
        board.scene.destination = null;
      }
  };



  request.onerror = onError || function(){console.log("Error waiting for response, please check if SICStus server is running.");};

  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  request.send();
}

MyBoard.prototype.makeRequest = function(request)
{
  // Make Request
  this.getPrologRequest(request);
}

MyBoard.prototype.boardToList = function(){

  var list = "[";

  for(var x=0; x<this.matrix.length; x++){
    list += "[";
    for (var y=0; y<4; y++){
      if(this.pieces[x][y] != "")
        list += this.pieces[x][y].type;
      else
        list += this.matrix[x][y].type;
      if(y<3)
        list += ",";
    }
    if(x<this.matrix.length - 1)
      list += "],";
    else
      list += "]";
  }

  list += "]";

  return list;
}
