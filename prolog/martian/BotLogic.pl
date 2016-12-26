is_valid_movement(Board, Xi, Yi, Xf, Yf, Piece, Player):-
    verify_empty_path(Board, Xi, Yi, Xf, Yf),
    check_post_movement_events(Board, Xf, Yf, Player, 0, _, Piece, _).

add_valid_movement(Board, Xi, Yi, XInc, YInc, Piece, Player, Movs, [[Xi, Yi, Xf, Yf] | Movs]):-
    Xf is Xi + XInc,
    Yf is Yi + YInc,
    is_valid_movement(Board, Xi, Yi, Xf, Yf, Piece, Player).

add_valid_movement(_, _, _, _, _, _, _, Movs, Movs).


valid_movements(Board, Xi, Yi, pawn, Player, Movs, NewMovs):-
    add_valid_movement(Board, Xi, Yi, 1, 1, pawn, Player, Movs, Movs1),
    add_valid_movement(Board, Xi, Yi, 1, -1, pawn, Player, Movs1, Movs2),
    add_valid_movement(Board, Xi, Yi, -1, 1, pawn, Player, Movs2, Movs3),
    add_valid_movement(Board, Xi, Yi, -1, -1, pawn, Player, Movs3, NewMovs).

valid_movements(Board, Xi, Yi, drone, Player, Movs, NewMovs):-
    add_valid_movement(Board, Xi, Yi, 0, 1, pawn, Player, Movs, Movs1),
    add_valid_movement(Board, Xi, Yi, 1, 0, pawn, Player, Movs1, Movs2),
    add_valid_movement(Board, Xi, Yi, 0, -1, pawn, Player, Movs2, Movs3),
    add_valid_movement(Board, Xi, Yi, -1, 0, pawn, Player, Movs3, Movs4),
    add_valid_movement(Board, Xi, Yi, 0, 2, pawn, Player, Movs4, Movs5),
    add_valid_movement(Board, Xi, Yi, 2, 0, pawn, Player, Movs5, Movs6),
    add_valid_movement(Board, Xi, Yi, 0, -2, pawn, Player, Movs6, Movs7),
    add_valid_movement(Board, Xi, Yi, -2, 0, pawn, Player, Movs7, NewMovs).

valid_movements(Board, Xi, Yi, queen, Player, Movs, NewMovs):-
    queen_even_quadrant_diagonal_movements(Board, Xi, Yi, queen, Player, Movs, Movs1, 1, 1),
    queen_even_quadrant_diagonal_movements(Board, Xi, Yi, queen, Player, Movs1, Movs2, -1, -1),
    queen_odd_quadrant_diagonal_movements(Board, Xi, Yi, queen, Player, Movs2, Movs3, 1, 1),
    queen_odd_quadrant_diagonal_movements(Board, Xi, Yi, queen, Player, Movs3, Movs4, -1, -1),
    queen_vertical_movements(Board, Xi, Yi, queen, Player, Movs4, Movs5, 1, 1),
    queen_vertical_movements(Board, Xi, Yi, queen, Player, Movs5, Movs6, -1, -1),
    queen_horizontal_movements(Board, Xi, Yi, queen, Player, Movs6, Movs7, 1, 1),
    queen_horizontal_movements(Board, Xi, Yi, queen, Player, Movs7, Movs8, -1, -1),
    NewMovs = Movs8.

queen_odd_quadrant_diagonal_movements(Board, Xi, Yi, queen, Player, Movs, NewMovs, N, NInc):-
    Xf is Xi + N,
    Yf is Yi + N,
    Xf >= 0,
    Xf =< 3,
    Yf >= 0,
    Yf =< 7,
    add_valid_movement(Board, Xi, Yi, N, N, queen, Player, Movs, Movs1),
    N1 is N + NInc,
    queen_odd_quadrant_diagonal_movements(Board, Xi, Yi, queen, Player, Movs1, NewMovs, N1, NInc).

queen_odd_quadrant_diagonal_movements(_, _, _, _, _, Movs, Movs, _, _).

queen_even_quadrant_diagonal_movements(Board, Xi, Yi, queen, Player, Movs, NewMovs, N, NInc):-
    Xf is Xi + N,
    Yf is Yi - N,
    Xf >= 0,
    Xf =< 3,
    Yf >= 0,
    Yf =< 7,
    N2 is -N,
    add_valid_movement(Board, Xi, Yi, N, N2, queen, Player, Movs, Movs1),
    N1 is N + NInc,
    queen_even_quadrant_diagonal_movements(Board, Xi, Yi, queen, Player, Movs1, NewMovs, N1, NInc).

queen_even_quadrant_diagonal_movements(_, _, _, _, _, Movs, Movs, _, _).

queen_vertical_movements(Board, Xi, Yi, queen, Player, Movs, NewMovs, N, NInc):-
    Yf is Yi + N,
    Yf >= 0,
    Yf =< 7,
    add_valid_movement(Board, Xi, Yi, 0, N, queen, Player, Movs, Movs1),
    N1 is N + NInc,
    queen_vertical_movements(Board, Xi, Yi, queen, Player, Movs1, NewMovs, N1, NInc).

queen_vertical_movements(_, _, _, _, _, Movs, Movs, _, _).

queen_horizontal_movements(Board, Xi, Yi, queen, Player, Movs, NewMovs, N, NInc):-
    Xf is Xi + N,
    Xf >= 0,
    Xf =< 3,
    add_valid_movement(Board, Xi, Yi, N, 0, queen, Player, Movs, Movs1),
    N1 is N + NInc,
    queen_horizontal_movements(Board, Xi, Yi, queen, Player, Movs1, NewMovs, N1, NInc).

queen_horizontal_movements(_, _, _, _, _, Movs, Movs, _, _).

valid_movements_on_board_half(Board, Player, PlayerNr, Moves, NewMoves):-
    Line1 is 4 * PlayerNr,
    Line2 is 1 + 4 * PlayerNr,
    Line3 is 2 + 4 * PlayerNr,
    Line4 is 3 + 4 * PlayerNr,
    valid_movements_on_line(Board, Player, PlayerNr, Moves, Moves1, Line1, 0),
    valid_movements_on_line(Board, Player, PlayerNr, Moves1, Moves2, Line2, 0),
    valid_movements_on_line(Board, Player, PlayerNr, Moves2, Moves3, Line3, 0),
    valid_movements_on_line(Board, Player, PlayerNr, Moves3, NewMoves, Line4, 0).

valid_movements_on_line(_, _, _, Moves, Moves, _, 8).

valid_movements_on_line(Board, Player, PlayerNr, Moves, NewMoves, Yi, Xi):-
    get_board_element(Board, Xi, Yi, Elem),
    valid_movements(Board, Xi, Yi, Elem, Player, Moves, Moves1),
    Xi1 is Xi +1,
    valid_movements_on_line(Board, Player, PlayerNr, Moves1, NewMoves, Yi, Xi1).

valid_movements_on_line(Board, Player, PlayerNr, Moves, NewMoves, Yi, Xi):-
    Xi1 is Xi + 1,
    valid_movements_on_line(Board, Player, PlayerNr, Moves, NewMoves, Yi, Xi1).

valid_moves(Board, Player, Moves):-
    player_nr(Player, PlayerNr),
    valid_movements_on_board_half(Board, Player, PlayerNr, [], Moves).

move_value(Board, Player, Move, Value):-
    nth0(2, Move, Xf),
    nth0(3, Move, Yf),
    crosses_board_half(Yf, Player),
    get_board_element(Board, Xf, Yf, EatenCell),
    piece_value(EatenCell, Value).

move_value(Board, Player, Move, Value):-
    nth0(0, Move, Xi),
    nth0(1, Move, Yi),
    nth0(2, Move, Xf),
    nth0(3, Move, Yf),
    is_in_own_half(Yf, Player),
    get_board_element(Board, Xi, Yi, MergeCell1),
    get_board_element(Board, Xf, Yf, MergeCell2),
    MergeCell1 \= empty,
    MergeCell2 \= empty,
    piece_value(MergeCell1, Val1),
    piece_value(MergeCell2, Val2),
    Value is Val1 + Val2.


move_value(_, _, _, 0).

list_size([_|Ls], Size):-
  list_size(Ls, Size1),
  Size is Size1 + 1.
list_size([], 0).

get_move_with_value(Board, Player, [Move|_], Value, Move):-
    move_value(Board, Player, Move, Value).

get_move_with_value(Board, Player, [_|Rest], Value, Move):-
    get_move_with_value(Board, Player, Rest, Value, Move).

get_best_move(Board, Player, Moves, Move):-
    get_move_with_value(Board, Player, Moves, 3, Move).

get_best_move(Board, Player, Moves, Move):-
    get_move_with_value(Board, Player, Moves, 2, Move).

get_best_move(Board, Player, Moves, Move):-
    get_move_with_value(Board, Player, Moves, 1, Move).

get_best_move(_, _, Moves, Move):-
    list_size(Moves, NoMoves),
    random(0, NoMoves, ChosenMoveIndex),
    nth0(ChosenMoveIndex, Moves, Move).
