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
       return;
     }

      var cmd = requestString.substring(0, 9);

      if(cmd == 'make_play'){
        if(response == 'invalid'){
          console.log("Invalid play, pls try another move...");
        }
        else if(response != 'Bad Request'){
          board.make_move(board.scene.objectPicked.x, board.scene.objectPicked.y, board.scene.destination.x, board.scene.destination.y);
          board.makeRequest('checkend(' + board.boardToList() + ',8,P1,P2)');
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
