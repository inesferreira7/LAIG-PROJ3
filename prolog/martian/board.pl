:- use_module(library(lists)).
:-include('cli.pl').

board([
			[a,queen,queen,drone,vazio],
			[b,queen,drone,pawn,vazio],
			[c,drone,pawn,pawn,vazio],
			[d,drone,vazio,vazio,vazio],
      [e,drone,vazio,vazio,vazio],
      [f,vazio,pawn,pawn,drone],
      [g,vazio,pawn,drone,queen],
      [h,vazio,drone,queen,queen]
			]).

		board1vazio([
			[a,vazio,vazio,vazio,vazio],
			[b,vazio,vazio,vazio,vazio],
			[c,pawn,vazio,vazio,vazio],
			[d,vazio,pawn,vazio,vazio],
			[e,drone,pawn,vazio,vazio],
			[f,vazio,pawn,pawn,drone],
			[g,vazio,pawn,vazio,drone],
			[h,vazio,vazio,drone,vazio]
			]).

numbers([
			[vazio,um,dois,tres,quatro]
			]).


display_board_numbers([B1|BS]):- nl, display_numbers(B1), display_board_numbers(BS).

display_board_numbers([]):-nl.

display_numbers([E1|ES]) :- translate(E1,V), write(V), write('   '), display_numbers(ES).

display_numbers([]).


display_board([L1|LS], N) :-
        (
        N = 4 -> (write('   _______________\n'),nl, display_line(L1));
        (write('   ---------------\n'),display_line(L1))),
        N1 is N+1,
        nl,
        display_board(LS, N1)
        .

display_board([],_).



display_all(Board):-numbers(N), display_board_numbers(N), display_board(Board,0).

display_line([E1|ES]) :- translate(E1,V), write(V), write(' | '), display_line(ES).

display_line([]).



translate(vazio,' ').
translate(linha,'-').
translate(queen,'0').
translate(drone,'*').
translate(pawn,'.').
translate(a,'A').
translate(b,'B').
translate(c,'C').
translate(d,'D').
translate(e,'E').
translate(f,'F').
translate(g,'G').
translate(h,'H').
translate(um,'1').
translate(dois,'2').
translate(tres,'3').
translate(quatro,'4').

%%%%%% Find line with y=Letter %%%%%%

head(Elem, [Head|Rs],Rs) :- Elem = Head.
find_head(Elem, [Line|Rest],X):- head(Elem,Line,X); find_head(Elem,Rest,X).

line_board(Elem,Board,X):- find_head(Elem,Board,X).

removehead([_|Tail], Tail).


coordenates(Letter,Number,Piece,Board):-
				line_board(Letter,Board,X),
				Index is (Number-1),
				nth0(Index,X,Piece).

convert(Letter,Index):-
			(
			(
			Letter = a -> Index = 1;
			Letter = b -> Index = 2;
			Letter = c -> Index = 3;
			Letter = d -> Index = 4;
			Letter = e -> Index = 5;
			Letter = f -> Index = 6;
			Letter = g -> Index = 7;
			Letter = h -> Index = 8);
      write('Invalid letter! \n')
			).

convert_to_letter(Index,Letter):-
			(
			(
			Index = 1 -> Letter = a;
			Index = 2 -> Letter = b;
			Index = 3 -> Letter = c;
			Index = 4 -> Letter = d;
			Index = 5 -> Letter = e;
			Index = 6 -> Letter = f;
			Index = 7 -> Letter = g;
			Index = 8 -> Letter = h)
			; write('Invalid number! \n')
			).


is_inside(Val, ValMin, ValMax):-
			Val >= ValMin,
			Val =< ValMax.


inside_board(Xi,Yi,Xf,Yf):-
			is_inside(Xi,1,4),
			is_inside(Xf,1,4),
			convert(Yi,Indexi),
			convert(Yf,Indexf),
			is_inside(Indexi,1,8),
			is_inside(Indexf,1,8).

check_drone_position(Xi,Yi,Xf,Yf,CanMove):-
				convert(Yi,Indexi),
				convert(Yf,Indexf),
				Dx is abs(Xf - Xi),
				Dy is abs(Indexf - Indexi),
				%inside_board(Xf,Indexf),
				(
				((Dx \= 0 , Dy \= 0) ; Dx > 2 ; Dy > 2)
				-> (CanMove is 1)
				; (CanMove is 0)
				).


check_pawn_position(Xi,Yi,Xf,Yf,CanMove):-
				convert(Yi,Indexi),
				convert(Yf,Indexf),
				%inside_board(Xf,Indexf),
				Dx is (Xf - Xi),
				Dy is (Indexf - Indexi),
				(
				((Dx = -1 , Dy = -1) ; (Dx = -1 , Dy = 1) ; (Dx = 1 , Dy = 1) ; (Dx = 1 , Dy = -1))
				-> (CanMove is 0)
				; (CanMove is 1)
				).

check_queen_position(Xi,Yi,Xf,Yf,CanMove):-
				convert(Yi,Indexi),
				convert(Yf,Indexf),
				%inside_board(Xf,Indexf),
				Dx is abs(Xf - Xi),
				Dy is abs(Indexf - Indexi),
				(
				((Xi = Xf , Indexi \= Indexf) ; (Xi \= Xf , Indexi = Indexf) ; Dx = Dy)
				->(CanMove is 0)
				; (CanMove is 1)
				).

check_owner(Letter,X):-
				convert(Letter,Y),
				(
				Y =< 4 -> X is 1;
				Y > 4 -> X is 2
				).

check_piece(Letter, Number,X,BoardReceived):-
				coordenates(Letter,Number,Piece,BoardReceived),
				(

				(Piece = vazio) -> X is 3
				; check_owner(Letter,X)
				).

can_transform(Letter,Number,BoardReceived,PieceFinal):-
				coordenates(Letter,Number,Piece,BoardReceived),
				(
				Piece = pawn -> PieceFinal is 1;
				Piece = drone -> PieceFinal is 2;
				PieceFinal is 0
				).

move_pawn(Xi,Yi,Xf,Yf,BoardReceived,BoardOutput,P,S1,S1f,S2,S2f):-
				coordenates(Yi,Xi,InitialPiece,BoardReceived),
				coordenates(Yf,Xf,FinalPiece,BoardReceived),
				(
				InitialPiece = pawn ->(check_pawn_position(Xi,Yi,Xf,Yf,CanMove), 	/*can_transform(Yf,Xf,BoardReceived,Transform),**/
				(
				CanMove = 0 -> (
				check_piece(Yf,Xf,X,BoardReceived),
				(
				X = 1 ->(write('You can not jump over pieces! Insert new coordenates: \n'),
				(
				(P = 1 , FinalPiece = drone, \+exists_on_board_half(BoardReceived,0,queen)) -> (make_move(Xi,Yi,Xf,Yf,queen,BoardReceived,BoardOutput),update_score_vazio(S1,S2,S1f,S2f),display_all(BoardOutput));
				(P = 1 , FinalPiece = pawn, \+exists_on_board_half(BoardReceived,0,drone)) -> (make_move(Xi,Yi,Xf,Yf,drone,BoardReceived,BoardOutput),update_score_vazio(S1,S2,S1f,S2f),display_all(BoardOutput));
				P = 1 -> ask_coordenates_1(BoardReceived,BoardOutput, S1,S1f,S2,S2f);
				P = 2 -> (make_move(Xi,Yi,Xf,Yf,pawn,BoardReceived,BoardOutput), update_score2(S2,FinalPiece,S2f,S1,S1f), display_all(BoardOutput))
				)
				);
				X = 2 -> (write('You can not jump over pieces! Insert new coordenates: \n'),
				(
				(P = 2 , FinalPiece = drone , \+exists_on_board_half(BoardReceived,1,queen))-> (make_move(Xi,Yi,Xf,Yf,queen,BoardReceived,BoardOutput),update_score_vazio(S1,S2,S1f,S2f),display_all(BoardOutput));
				(P = 2 , FinalPiece = pawn , \+exists_on_board_half(BoardReceived,1,drone))-> (make_move(Xi,Yi,Xf,Yf,drone,BoardReceived,BoardOutput),update_score_vazio(S1,S2,S1f,S2f),display_all(BoardOutput));
				P = 1 -> (make_move(Xi,Yi,Xf,Yf,pawn,BoardReceived,BoardOutput), update_score1(S1,FinalPiece,S1f,S2,S2f),display_all(BoardOutput));
				P = 2 -> ask_coordenates_2(BoardReceived,BoardOutput,S1,S1f,S2,S2f)
				)
				);
				X = 3 -> (make_move(Xi,Yi,Xf,Yf,pawn,BoardReceived,BoardOutput), update_score_vazio(S1,S2,S1f,S2f),display_all(BoardOutput))
				)
				);
				CanMove = 1 -> write('Impossible movement for the pawn, it will not move! Insert new coordenates: \n'),
				(
				P = 1 -> ask_coordenates_1(BoardReceived,BoardOutput,S1,S1f,S2,S2f);
				P = 2 -> ask_coordenates_2(BoardReceived,BoardOutput,S1,S1f,S2,S2f)
				)
				)
				);
				write('The piece you selected is not a pawn, you can not move it! ')
				).

update_score1(S1,Piece,S1f,S2,S2f):-
				S2f is (S2 + 0),
				(
				Piece = queen -> S1f is (S1 + 3);
				Piece = drone -> S1f is (S1 + 2);
				Piece = pawn -> S1f is (S1 +1)
				).

update_score2(S2,Piece,S2f,S1,S1f):-
				S1f is (S1 + 0),
				(
				Piece = queen -> S2f is (S2 + 3);
				Piece = drone -> S2f is (S2 + 2);
				Piece = pawn -> S2f is (S2 + 1)
				).

update_score_vazio(S1,S2,S1f,S2f):-
				S1f = S1,
				S2f = S2.

move_drone(Xi,Yi,Xf,Yf,BoardReceived,BoardOutput,P,S1,S1f,S2,S2f):-
				coordenates(Yi,Xi,InitialPiece,BoardReceived),
				coordenates(Yf,Xf,FinalPiece,BoardReceived),
				convert(Yi, Indexi),
				convert(Yf, Indexf),
				(
				InitialPiece = drone ->(check_drone_position(Xi,Yi,Xf,Yf,CanMove),/**can_transform(Yf,Xf,BoardReceived,Transform),**/
				(
				CanMove = 0 -> (
				check_path_drone(Xi,Yi,Xf,Yf,P1,P2,BoardReceived),(NewY is abs(Indexf - 1)),(NewY2 is abs(Indexi-1)),(NewX is abs(Xf -1)), (NewX2 is abs(Xi - 1)),

				(
				%para baixo
				%trace,
				(P = 1 , P1 = 1, NewY = Indexi , FinalPiece = pawn, \+exists_on_board_half(BoardReceived,0,queen)) ->  (make_move(Xi,Yi,Xf,Yf,queen,BoardReceived,BoardOutput),update_score_vazio(S1,S2,S1f,S2f),display_all(BoardOutput));
				(P = 1 , P1 = 1 ) -> write('(1)You can not jump over pieces! Insert new coordenates: \n'), ask_coordenates_1(BoardReceived,BoardOutput,S1,S1f,S2,S2f);
				(P = 1 , P1 = 2 , NewY = Indexi ) -> make_move(Xi,Yi,Xf,Yf,drone,BoardReceived,BoardOutput), update_score1(S1,FinalPiece,S1f,S2,S2f),display_all(BoardOutput);
				(P = 1 , P1 = 2 , NewY > Indexi ) -> write('(2)You can not jump over pieces! Insert new coordenates: \n'), ask_coordenates_1(BoardReceived,BoardOutput,S1,S1f,S2,S2f);
				(P = 1 , P1 = 3 , P2 = 2) -> make_move(Xi,Yi,Xf,Yf,drone,BoardReceived,BoardOutput), update_score1(S1,FinalPiece,S1f,S2,S2f),display_all(BoardOutput);

				%lados
				(P = 1 , P1 = 1, NewX = Xi , FinalPiece = pawn, \+exists_on_board_half(BoardReceived,0,queen)) ->  (make_move(Xi,Yi,Xf,Yf,queen,BoardReceived,BoardOutput),update_score_vazio(S1,S2,S1f,S2f),display_all(BoardOutput));
				(P = 1 , P1 = 1, NewX2 = Xf , FinalPiece = pawn, \+exists_on_board_half(BoardReceived,0,queen)) ->  (make_move(Xi,Yi,Xf,Yf,queen,BoardReceived,BoardOutput),update_score_vazio(S1,S2,S1f,S2f),display_all(BoardOutput));

				(P = 2 , P1 = 2, NewX = Xi , FinalPiece = pawn, \+exists_on_board_half(BoardReceived,1,queen)) ->  (make_move(Xi,Yi,Xf,Yf,queen,BoardReceived,BoardOutput),update_score_vazio(S1,S2,S1f,S2f),display_all(BoardOutput));
				(P = 2 , P1 = 2, NewX2 = Xf , FinalPiece = pawn, \+exists_on_board_half(BoardReceived,1,queen)) ->  (make_move(Xi,Yi,Xf,Yf,queen,BoardReceived,BoardOutput),update_score_vazio(S1,S2,S1f,S2f),display_all(BoardOutput));

				(P = 1 , P1 = 3 , P2 = 1 , FinalPiece = pawn , \+exists_on_board_half(BoardReceived,0,queen)) -> (make_move(Xi,Yi,Xf,Yf,queen,BoardReceived,BoardOutput),update_score_vazio(S1,S2,S1f,S2f),display_all(BoardOutput));
				(P = 2 , P1 = 3 , P2 = 2 , FinalPiece = pawn , \+exists_on_board_half(BoardReceived,1,queen)) -> (make_move(Xi,Yi,Xf,Yf,queen,BoardReceived,BoardOutput),update_score_vazio(S1,S2,S1f,S2f),display_all(BoardOutput));

				%para cima
				(P = 2 , P1 = 2, NewY2 = Indexf , FinalPiece = pawn, \+exists_on_board_half(BoardReceived,1,queen)) ->  (make_move(Xi,Yi,Xf,Yf,queen,BoardReceived,BoardOutput),update_score_vazio(S1,S2,S1f,S2f),display_all(BoardOutput));
				(P = 2 , P1 = 2) -> write('(3)You can not jump over pieces! Insert new coordenates: \n'), ask_coordenates_2(BoardReceived,BoardOutput,S1,S1f,S2,S2f);
				(P = 2 , P1 = 1 , NewY2 = Indexf ) -> make_move(Xi,Yi,Xf,Yf,drone,BoardReceived,BoardOutput), update_score2(S2,FinalPiece,S2f,S1,S1f),display_all(BoardOutput);
				(P = 2 , P1 = 1 , NewY2 > Indexf ) -> write('You can not jump over pieces! Insert new coordenates: \n'), ask_coordenates_2(BoardReceived,BoardOutput,S1,S1f,S2,S2f);
				(P = 2 , P1 = 3 , P2 = 1)-> make_move(Xi,Yi,Xf,Yf,drone,BoardReceived,BoardOutput), update_score2(S2,FinalPiece,S2f,S1,S1f),display_all(BoardOutput);

				(P1 = 3 , P2 = 3 )-> make_move(Xi,Yi,Xf,Yf,drone,BoardReceived,BoardOutput), update_score_vazio(S1,S2,S1f,S2f),display_all(BoardOutput)
				)

				);
				CanMove = 1 -> write('Impossible movement for the drone, it will not move! Insert new coordenates: \n'),
				(
				P = 1 -> ask_coordenates_1(BoardReceived,BoardOutput,S1,S1f,S2,S2f);
				P = 2 -> ask_coordenates_2(BoardReceived,BoardOutput,S1,S1f,S2,S2f)
				)
				)
				);
				write('The piece you selected is not a drone, you can not move it! ')
				)
				.

move_queen(Xi,Yi,Xf,Yf,BoardReceived,BoardOutput,P,S1,S1f,S2,S2f):-
				coordenates(Yi,Xi,InitialPiece,BoardReceived),
				coordenates(Yf,Xf,FinalPiece,BoardReceived),
				(
				InitialPiece = queen ->(check_queen_position(Xi,Yi,Xf,Yf,CanMove),
				(
				CanMove = 0 ->(

				check_path_queen(Xi,Yi,Xf,Yf,Move,BoardReceived),
				(
				Move = 1 -> (write('You can not jump over pieces! Insert new coordenates: \n'),
				(
				P = 1 -> ask_coordenates_1(BoardReceived,BoardOutput,S1,S1f,S2,S2f);
				P = 2 -> ask_coordenates_2(BoardReceived,BoardOutput,S1,S1f,S2,S2f)
				)
				);
				Move = 2 ->(write('You can not jump over pieces! Insert new coordenates: \n'),
				(
				P = 1 -> ask_coordenates_1(BoardReceived,BoardOutput,S1,S1f,S2,S2f);
				P = 2 -> ask_coordenates_2(BoardReceived,BoardOutput,S1,S1f,S2,S2f)


				)
				);
				Move = 3 -> make_move(Xi,Yi,Xf,Yf,queen,BoardReceived,BoardOutput), update_score_vazio(S1,S2,S1f,S2f),display_all(BoardOutput);
				(Move  = 4 , P = 1) ->(write('You can not jump over pieces! Insert new coordenates: \n'), ask_coordenates_1(BoardReceived,BoardOutput,S1,S1f,S2,S2f));
				(Move  = 5 , P = 2) -> (write('You can not jump over pieces! Insert new coordenates: \n'),ask_coordenates_2(BoardReceived,BoardOutput,S1,S1f,S2,S2f));
				(Move  = 4 ,  P = 2  ) -> make_move(Xi,Yi,Xf,Yf,queen,BoardReceived,BoardOutput), update_score2(S2,FinalPiece,S2f,S1,S1f),display_all(BoardOutput);
				(Move  = 5 ,  P = 1  ) -> make_move(Xi,Yi,Xf,Yf,queen,BoardReceived,BoardOutput), update_score1(S1,FinalPiece,S1f,S2,S2f),display_all(BoardOutput)
				)
				);
				CanMove = 1 -> write('Impossible movement for the queen, it will not move! Insert new coordenates:\n'),
				(
				P = 1 -> ask_coordenates_1(BoardReceived,BoardOutput,S1,S1f,S2,S2f);
				P = 2 -> ask_coordenates_2(BoardReceived,BoardOutput,S1,S1f,S2,S2f)
				)
				)
				);
				write('The piece you selected is not a queen, you can not move it! ')
				)
				.

check_path_queen(Xi,Yi,Xf,Yf,Move,BoardReceived):-
				convert(Yi,Indexi),
				convert(Yf,Indexf),
				Dx is abs(Xf - Xi),
				Dy is abs(Indexf- Indexi),
				NewDy is (Indexf - Indexi),
				NewDx is (Xf - Xi),

				/**Verificar o movimento da rainha no eixo do x **/
				(
				((Dx \= 0 , Dy = 0 )->((
										(Xf > Xi) -> (X is Xi+1);
										(Xf < Xi) -> (X is Xi-1)
										),
										check_piece(Yi,X,Piece,BoardReceived),(Dnew is Dx-1),
										(
										(Dnew  = 0 , Piece = 1 ) -> Move is 4; % ultima peça do player 1
										(Dnew  = 0 , Piece = 2 ) -> Move is 5; % ultima peça do player 2
										(Piece = 1 ) -> Move is 1;
										(Piece = 2 ) -> Move is 2;
										(Piece = 3 )-> check_path_queen(X,Yi,Xf,Yf,Move,BoardReceived)
										)
										)
				);

				((Dy \= 0 , Dx = 0 )-> ((

										(Indexf > Indexi) -> (Y is Indexi+1);
										(Indexf < Indexi) -> (Y is Indexi-1)
										),
										convert_to_letter(Y,NewY),
										check_piece(NewY,Xi,Piece,BoardReceived),(Dnew is Dy-1),
										(
										(Dnew = 0 , Piece = 1 ) -> Move is 4; % ultima peça do player 1
										(Dnew = 0 , Piece = 2 ) -> Move is 5; % ultima peça do player 2
										(Piece = 1 )-> 	Move is 1;
										(Piece = 2 ) -> Move is 2;
										(Piece = 3 )-> check_path_queen(Xi,NewY,Xf,Yf,Move,BoardReceived)
										)
										)
				);
				%diagonais
				%direita
				((NewDx > 0) -> (
												(
												((NewDy > 0) -> ( (X is Xi+1) ,(Y is Indexi + 1)));  %baixo
												((NewDy < 0) -> ( (X is Xi+1) ,(Y is Indexi - 1)))	 %cima
												),
												convert_to_letter(Y,NewY),
												check_piece(NewY,X,Piece,BoardReceived),(Dnew is (abs(NewDx) -1)),
												(
												(Dnew = 0 , Piece = 1 ) -> Move is 4; % ultima peça do player 1
												(Dnew = 0 , Piece = 2 ) -> Move is 5; % ultima peça do player 2
												(Piece = 1 )-> Move is 1;
												(Piece = 2 ) -> Move is 2;
												(Piece = 3 )-> check_path_queen(X,NewY,Xf,Yf,Move,BoardReceived)
												)
												)

				);
				%esquerda
				((NewDx < 0) -> (
												(
												((NewDy > 0) -> ( (X is Xi-1) ,(Y is Indexi + 1)));  %baixo
												((NewDy < 0) -> ( (X is Xi-1) ,(Y is Indexi - 1)))	 %cima
												),
												convert_to_letter(Y,NewY),
												check_piece(NewY,X,Piece,BoardReceived),(Dnew is (abs(NewDy) -1)),
												(
												(Dnew = 0 , Piece = 1 ) -> Move is 4; % ultima peça do player 1
												(Dnew = 0 , Piece = 2 ) -> Move is 5; % ultima peça do player 2
												(Piece = 1 )-> Move is 1;
												(Piece = 2 ) -> Move is 2;
												(Piece = 3 )-> check_path_queen(X,NewY,Xf,Yf,Move,BoardReceived)
												)
												)

				);


				((NewDx = 0, NewDy = 0) -> Move is 3);
				((Dx = 0 , Dy = 0) -> Move is 3
				)
				)

				.

make_move(Xi,Yi,Xf,Yf,Piece,BoardReceived,BoardOutput):-
				convert(Yi, Numi),
				convert(Yf,Numf),
				Indexi is (Numi - 1),
				Indexf is (Numf - 1),
				replace(BoardReceived,Indexi,Xi,vazio,BoardInt),
				replace(BoardInt,Indexf,Xf,Piece,BoardOutput).

check_path_drone(Xi,Yi,Xf,Yf,Piece, Piece2,BoardReceived):-
					convert(Yi,Indexi),
					convert(Yf,Indexf),
					Dx is abs(Xf-Xi),
					Dy is abs(Indexf-Indexi),
					(
					(Dx = 1) -> (Piece2 is 3 ,  check_piece(Yf,Xf,Piece,BoardReceived));
					(Dy = 1) -> (Piece2 is 3 , check_piece(Yf,Xf,Piece,BoardReceived));
					(Dx = 2, Xf > Xi) -> (check_piece(Yf,Xf,Piece2,BoardReceived), X1 is (Xf-1), check_piece(Yf,X1,Piece,BoardReceived));
					(Dx = 2, Xf < Xi) -> (check_piece(Yf,Xf,Piece2,BoardReceived), X1 is (Xf+1), check_piece(Yf,X1,Piece,BoardReceived));
					(Dy = 2, Indexf > Indexi) -> (check_piece(Yf,Xf,Piece2,BoardReceived), Y1 is (Indexf-1), convert_to_letter(Y1,L), check_piece(L,Xf,Piece,BoardReceived));
					(Dy = 2, Indexf < Indexi) -> (check_piece(Yf,Xf,Piece2,BoardReceived), Y1 is (Indexf+1), convert_to_letter(Y1,L), check_piece(L,Xf,Piece,BoardReceived))
		).


play_1(Xi,Yi,Xf,Yf,BoardReceived,BoardOutput,S1,S1f,S2,S2f):-
				coordenates(Yi,Xi,Piece,BoardReceived),
				convert(Yi,Num),
				(
				Num > 4 -> (write('Not your piece! Insert new coordenates: \n'),ask_coordenates_1(BoardReceived,BoardOutput,S1,S1f,S2,S2f));
				(
				Piece = pawn -> move_pawn(Xi,Yi,Xf,Yf,BoardReceived,BoardOutput,1,S1,S1f,S2,S2f);
				Piece = drone -> move_drone(Xi,Yi,Xf,Yf,BoardReceived,BoardOutput,1,S1,S1f,S2,S2f);
				Piece = queen -> move_queen(Xi,Yi,Xf,Yf,BoardReceived,BoardOutput,1,S1,S1f,S2,S2f);
				Piece = vazio -> (write('Nothing to move on those coordenates. Insert new ones: \n'),ask_coordenates_1(BoardReceived,BoardOutput,S1,S1f,S2,S2f))
				)).

play_2(Xi,Yi,Xf,Yf,BoardReceived,BoardOutput,S1,S1f,S2,S2f):-
				coordenates(Yi,Xi,Piece,BoardReceived),
				convert(Yi,Num),
				(
				Num =< 4 -> (write('Not your piece! Insert new coordenates: \n'), ask_coordenates_2(BoardReceived,BoardOutput,S1,S1f,S2,S2f));
				(
				Piece = pawn -> move_pawn(Xi,Yi,Xf,Yf,BoardReceived,BoardOutput,2,S1,S1f,S2,S2f);
				Piece = drone -> move_drone(Xi,Yi,Xf,Yf,BoardReceived,BoardOutput,2,S1,S1f,S2,S2f);
				Piece = queen -> move_queen(Xi,Yi,Xf,Yf,BoardReceived,BoardOutput,2,S1,S1f,S2,S2f);
				Piece = vazio -> (write('Nothing to move on those coordenates. Insert new ones: \n'), ask_coordenates_2(BoardReceived,BoardOutput,S1,S1f,S2,S2f))
				)).

verify_board_1(Board,Line,X) :-
				(
				Line = 5 ->X=2 %player 2 ganhou porque o board1 esta vazio
				);
				nth1(Line,Board,Elem),
				removehead(Elem,Elem1),
				(
				Elem1 \= [vazio,vazio,vazio,vazio] -> X = 0
				;
				Line1 is (Line + 1),
				verify_board_1(Board,Line1,X)
				).

verify_board_1(Board,Line,X).

verify_board_2(Board,Line,X) :-
				(
				Line = 9 -> X=1 %player 1 ganhou porque o board2 esta vazio
				);
				nth1(Line,Board,Elem),
				removehead(Elem,Elem1),
				(
				Elem1 \= [vazio,vazio,vazio,vazio] -> X = 0
				;
				Line1 is (Line + 1),
				verify_board_2(Board,Line1,X)
				).

verify_board_2(Board,Line,X).


ask_coordenates_1(BoardReceived,BoardOutput,S1,S1f,S2,S2f):-
				write('Initial x:'), nl,
				read(Xi),
				write('Initial y:'), nl,
				read(Yi),
				write('Final x:'), nl,
				read(Xf),
				write('Final y:'), nl,
				read(Yf),
				inside_board(Xi,Yi,Xf,Yf),
				play_1(Xi,Yi,Xf,Yf,BoardReceived,BoardOutput,S1,S1f,S2,S2f).

ask_coordenates_1(BoardReceived,BoardOutput,S1,S1f,S2,S2f):-
	write('Invalid coordenates! Please insert new ones: '), nl,
	ask_coordenates_1(BoardReceived,BoardOutput,S1,S1f,S2,S2f).

ask_coordenates_2(BoardReceived,BoardOutput,S1,S1f,S2,S2f):-
				write('Initial x:'), nl,
				read(Xi),
				write('Initial y:'), nl,
				read(Yi),
				write('Final x:'), nl,
				read(Xf),
				write('Final y:'), nl,
				read(Yf),
				inside_board(Xi,Yi,Xf,Yf),
				play_2(Xi,Yi,Xf,Yf,BoardReceived,BoardOutput,S1,S1f,S2,S2f).

ask_coordenates_2(BoardReceived,BoardOutput,S1,S1f,S2,S2f):-
				write('Invalid coordenates! Please insert new ones: '), nl,
				ask_coordenates_2(BoardReceived,BoardOutput,S1,S1f,S2,S2f).

endGame(Board,X):-
				verify_board_1(Board,1,X),
				verify_board_2(Board,5,X).

isPar(N):- N mod 2 =:= 0.

display_scores(S1,S2):-
				nl,
				write('Player 1: '),
				write(S1), nl,
				write('Player 2: '),
				write(S2),nl.


start_game(N,S1,S2):-
	board1vazio(Board),
	display_all(Board),
	display_scores(S1,S2),
	make_play(N,Board,S1,S2).

compare(S1,S2):-
			(
			S1 < S2 -> print_winner2;
			S1 > S2 -> print_winner1
			).


	make_play(N,Board,S1,S2):-
			endGame(Board,X),
			(
			(
			(X = 1 ; X = 2) ->compare(S1,S2)
			);
			(
			N1 is N+1,
			(
			isPar(N1) -> (print_turn1,ask_coordenates_1(Board,BoardOutput,S1,S1f,S2,S2f), display_scores(S1f,S2f));
			(print_turn2,ask_coordenates_2(Board,BoardOutput,S1,S1f,S2,S2f), display_scores(S1f,S2f))
			),
			make_play(N1,BoardOutput,S1f,S2f))
			).

replace( L , X , Y , Z , R ) :-
				append(RowPfx,[Row|RowSfx],L),
				length(RowPfx,X) ,
				append(ColPfx,[_|ColSfx],Row) ,
				length(ColPfx,Y) ,
				append(ColPfx,[Z|ColSfx],RowNew) ,
				append(RowPfx,[RowNew|RowSfx],R)
				.

exists_on_line([Piece|_], Piece).

exists_on_line([_|Line], Piece):-
	  exists_on_line(Line, Piece)
		.

exists_on_board_half(Board, Player, Piece):-
    exists_on_board_half(Board, Player, Piece, 1)
		.

exists_on_board_half(Board, PlayerNr, Piece, N):-
	  N<4,
	  LineNr is N + PlayerNr * 4,
    nth1(LineNr, Board, Line),
    exists_on_line(Line, Piece);
    N<4,
    N1 is N + 1,
    exists_on_board_half(Board, PlayerNr, Piece, N1)
		.
