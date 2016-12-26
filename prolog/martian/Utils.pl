/* Identificar jogadores -----------------------------------------------------*/
translate_player_name(player1,'player top').
translate_player_name(player2,'player bottom').
player_nr(player1,0).
player_nr(player2,1).

/* Predicados para a interação do jogo com o utlizador -----------------------*/

askMenuOption(Option):-
  nl,
  write('Insert an option: '),
  !,
  read(Option).

receive_coordinates(Xi,Yi,Xf,Yf,Player):-
  nl,
  player_nr(Player,Num),
  translate_player_name(Player,Name),
  YMin is 4*Num,
  YMax is YMin+4,
  write('Time to play the '),write(Name),write('.'),nl,
  receive_coordinate(Xi,0,4,'Initial X: '),
  receive_coordinate(Yi,YMin,YMax,'Initial Y: '),
  receive_coordinate(Xf,0,4,'Final X: '),
  receive_coordinate(Yf,0,8,'Final Y: ').

receive_bot_level(BotLevel):-
  receive_coordinate(BotLevel, 1, 3, 'Bot Level (1 - Dumb, 2 - Smart)').

cpu_coordinates(Board,CPU,Xi,Yi,Xf,Yf,1):-
  nl,
  %player_nr(CPU,Num),
  %translate_player_name(CPU,Name),
  valid_moves(Board, CPU, Moves),
  list_size(Moves, NoMoves),
  random(0, NoMoves, MoveIndex),
  nth0(MoveIndex, Moves, Move),
  nth0(0, Move, Xi),
  nth0(1, Move, Yi),
  nth0(2, Move, Xf),
  nth0(3, Move, Yf),
  write('| '),write(Xi), nl,
  write(Yi), nl,
  write(Xf), nl,
  write(Yf),write(' | '), nl.

cpu_coordinates(Board,CPU,Xi,Yi,Xf,Yf,2):-
  nl,
  % player_nr(CPU,Num),
  % translate_player_name(CPU,Name),
  valid_moves(Board, CPU, Moves),
  get_best_move(Board, CPU, Moves, Move),
  nth0(0, Move, Xi),
  nth0(1, Move, Yi),
  nth0(2, Move, Xf),
  nth0(3, Move, Yf),
  write('Chosen Move: Xi='),write(Xi), write(', Yi='),
  write(Yi), nl,
  write('             Xf='),write(Xf), write(', Yf='),
  write(Yf), nl.


receive_coordinate(Coord,CoordMin,CoordMax,Line):-
  Coord=_,
  write(Line),
  read(Coord),
  Coord >=CoordMin,
  Coord<CoordMax.

receive_coordinate(Coord,CoordMin,CoordMax,Line):-
  nl,
  !,
  receive_coordinate(Coord,CoordMin,CoordMax,Line).
