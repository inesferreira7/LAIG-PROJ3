/* Menu inicial --------------------------------------------------------------*/
initial_menu:-
  display_menu,
  askMenuOption(Opt),
	(
		Opt = 1 -> player_vs_player;
		Opt = 2 -> player_vs_cpu;
		Opt = 3 -> cpu_vs_cpu;
    Opt = 4;
    nl,
		write('Not a valid input. Choose again.\n'),
    main
	).

player_vs_player:-
  nl,
  initialize_board(Board,Columns,Rows),
  display_total_board(Board,Rows,Columns),
  calc_divisions_points(Board,Rows,BottomPoints1,TopPoints1),
  display_players_points(0,0),
  display_points_division(TopPoints1,BottomPoints1),
  game_play(Board,_,Columns,Rows,0,0).

make_play(Board,NewBoard,Columns,Rows,ActivePlayerPoints,NewPoints,Player):-
  receive_coordinates(Xi1,Yi1,Xf1,Yf1,Player),!,
  (move(Board,Xi1,Yi1,Xf1,Yf1,NewBoard, Player, ActivePlayerPoints, NewPoints) ->
  (display_total_board(NewBoard,Rows,Columns));
  display_error('Invalid movement.'),
  make_play(Board,NewBoard,Columns,Rows,ActivePlayerPoints,NewPoints, Player)).

game_play(Board,NewBoard,Columns,Rows,PlayerTopPoints,PlayerBottomPoints):-
    make_play(Board,NewBoard,Columns,Rows,PlayerTopPoints,NewTopPoints,player1),
    calc_divisions_points(NewBoard,Rows,BottomPoints1,TopPoints1),
    (verify_end_game(TopPoints1,BottomPoints1,NewTopPoints,PlayerBottomPoints) -> end_menu(NewTopPoints,PlayerBottomPoints);
    (
    display_players_points(NewTopPoints,PlayerBottomPoints),
    display_points_division(TopPoints1,BottomPoints1),
    make_play(NewBoard,NewBoard1,Columns,Rows,PlayerBottomPoints,NewBottomPoints,player2),
    calc_divisions_points(NewBoard1,Rows,BottomPoints2,TopPoints2),
    (verify_end_game(TopPoints2,BottomPoints2,NewBottomPoints,PlayerTopPoints) -> end_menu(NewTopPoints,NewBottomPoints);
    (display_players_points(NewTopPoints,NewBottomPoints),
    display_points_division(TopPoints2,BottomPoints2),
    game_play(NewBoard1,_,Columns,Rows,NewTopPoints,NewBottomPoints))))).


player_vs_cpu:-
  nl,
  initialize_board(Board,Columns,Rows),
  display_total_board(Board,Rows,Columns),
  receive_bot_level(BotLevel),
  game_play_wih_cpu(Board,_,Columns,Rows,0,0, BotLevel).

make_play_cpu(Board,NewBoard,Columns,Rows,ActivePlayerPoints,NewPoints,CPU, BotLevel):-
  cpu_coordinates(Board,CPU,Xi1,Yi1,Xf1,Yf1,BotLevel),
  !,
  (move(Board,Xi1,Yi1,Xf1,Yf1,NewBoard, CPU, ActivePlayerPoints, NewPoints) ->
  (display_total_board(NewBoard,Rows,Columns));
  make_play_cpu(Board,NewBoard,Columns,Rows,ActivePlayerPoints,NewPoints,CPU, BotLevel)).


game_play_wih_cpu(Board,NewBoard,Columns,Rows,PlayerTopPoints,PlayerBottomPoints, BotLevel):-
  make_play_cpu(Board,NewBoard,Columns,Rows,PlayerTopPoints,NewTopPoints,player1, BotLevel),
  calc_divisions_points(NewBoard,Rows,BottomPoints1,TopPoints1),
  (verify_end_game(TopPoints1,BottomPoints1,NewTopPoints,PlayerBottomPoints) -> end_menu(NewTopPoints,PlayerBottomPoints);
  (
  display_players_points(NewTopPoints,PlayerBottomPoints),
  display_points_division(NewTopPoints,PlayerBottomPoints),
  make_play(NewBoard,NewBoard1,Columns,Rows,PlayerBottomPoints,NewBottomPoints,player2),
  calc_divisions_points(NewBoard1,Rows,BottomPoints2,TopPoints2),
  (verify_end_game(TopPoints2,BottomPoints2,NewBottomPoints,PlayerTopPoints) -> end_menu(NewTopPoints,NewBottomPoints);
  (display_players_points(NewTopPoints,NewBottomPoints),
  display_points_division(NewTopPoints,NewBottomPoints),
  game_play_wih_cpu(NewBoard1,_,Columns,Rows,NewTopPoints,NewBottomPoints, BotLevel))))).

cpu_vs_cpu:-
  nl,
  initialize_board(Board,Columns,Rows),
  display_total_board(Board,Rows,Columns),
  receive_bot_level(BotLevel1),
  receive_bot_level(BotLevel2),
  game_play_wih_cpu_vs_cpu(Board,_,Columns,Rows,0,0, BotLevel1, BotLevel2).

game_play_wih_cpu_vs_cpu(Board,NewBoard,Columns,Rows,PlayerTopPoints,PlayerBottomPoints,BotLevel1, BotLevel2):-
  make_play_cpu(Board,NewBoard,Columns,Rows,PlayerTopPoints,NewTopPoints,player1,BotLevel1),
  calc_divisions_points(NewBoard,Rows,BottomPoints1,TopPoints1),
  (verify_end_game(TopPoints1,BottomPoints1,NewTopPoints,PlayerBottomPoints) -> end_menu(NewTopPoints,PlayerBottomPoints);
  (
  display_points_division(NewTopPoints,PlayerBottomPoints),
  get_char(_),
  make_play_cpu(NewBoard,NewBoard1,Columns,Rows,PlayerBottomPoints,NewBottomPoints,player2,BotLevel2),
  calc_divisions_points(NewBoard1,Rows,BottomPoints2,TopPoints2),
  (verify_end_game(TopPoints2,BottomPoints2,NewBottomPoints,PlayerTopPoints) -> end_menu(NewTopPoints,NewBottomPoints);
  (display_points_division(NewTopPoints,NewBottomPoints),
  get_char(_),
  game_play_wih_cpu_vs_cpu(NewBoard1,_,Columns,Rows,NewTopPoints,NewBottomPoints,BotLevel1,BotLevel2))))).



/* Menu fim de jogo ----------------------------------------------------------*/
end_menu(PlayerTopPoints,PlayerBottomPoints):-
  PlayerTopPoints>PlayerBottomPoints,
  nl,nl,
  write('----------------------------------\n'),
	write('----------- Game Over ------------\n'),
	write('----------------------------------\n'),
  write('--- Player top won the game ! ----\n'),
  write('--- Player Top Points: '),write(PlayerTopPoints),
  nl,
  write('--- Player Bottom Points: '),write(PlayerBottomPoints),
	nl,
  initial_menu.

  end_menu(PlayerTopPoints,PlayerBottomPoints):-
    nl,nl,
    write('----------------------------------\n'),
  	write('----------- Game Over ------------\n'),
  	write('----------------------------------\n'),
    write('---Player bottom won the game ! --\n'),
    write('--- Player Top Points: '),write(PlayerTopPoints),write(' ---------\n'),
    write('--- Player Bottom Points: '),write(PlayerBottomPoints),write(' ------\n'),
    write('----------------------------------\n'),
    nl,
    initial_menu.
