%%%%%%%%%%%%%% Clears screen screen %%%%%%%%%%%%%%%%%
clearScreen:-
        printBlank(65).

%%%%%%%%%%%%%% Blank %%%%%%%%%%%%%%%%
printBlank(X):-
        X > 0,
        nl,
        X1 is X-1,
        printBlank(X1).

printBlank(_).

%%%%%%%%%%%% Interface - menu %%%%%%%%%%%%%%%

mainMenu:-
        clearScreen,
        printMainMenu,
        get_char(In),
        (
          In = '1' -> write('Player vs Player\n'), playMenu;
          In = '2' -> write('Instructions\n'), instructionsMenu;
          In = '3' -> write('Exit\n');

          mainMenu

        ).

%%%%%%%%%%% Choose Player %%%%%%%%%%%%%%

choose_player(X):-
        get_char(In),
        (
        (In = '1' -> X = 1;
        In = '2' -> X = 0
        );
        choose_player(X))
        .

%%%%%%%%%%% Play menu %%%%%%%%%%%%%%

playMenu:-
                clearScreen,
                write('Who is the player whose hair is closest to red? '),
                choose_player(X),
                start_game(X,0,0).

%%%%%%%%%%% Instructions menu %%%%%%%%%%%%%%

instructionsMenu:-
        clearScreen,
        printInstructions.

        %%%%%%%%%%%%% Print instructions %%%%%%%%%%%%%

printInstructions:-
        write('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n'),
        write('%%                     Instructions                     %%\n'),
        write('%%                                                      %%\n'),
        write('%%   You can only move pieces sitting in your own       %%\n'),
        write('%%   quadrant and if you move a piece to another        %%\n'),
        write('%%   quadrant, it changes ownership.                    %%\n'),
        write('%%   Queens(O) may move in any direction, straight or   %%\n'),
        write('%%   diagonally, as far as you like. Drones(o) move     %%\n'),
        write('%%   only on straight paths, one or two spaces at a     %%\n'),
        write('%%   time. Pawns(.) move one space at a time, in any    %%\n'),
        write('%%   direction along the diagonal.                      %%\n'),
        write('%%   The game ends as soon as one player runs out of    %%\n'),
        write('%%   pieces. The player with the highest score wins.    %%\n'),
        write('%%   Queens - 3 points                                  %%\n'),
        write('%%   Drones - 2 points                                  %%\n'),
        write('%%   Pawns - 1 point                                    %%\n'),
        write('%%                                                      %%\n'),
        write('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n').

%%%%%%%%%%%% Print of main menu %%%%%%%%%%%%

printMainMenu:-
        write('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n'),
        write('%%         Martian Chess         %%\n'),
        write('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n'),
        write('%%                               %%\n'),
        write('%%      1 - Player vs Player     %%\n'),
        write('%%         2 - Instrucoes        %%\n'),
        write('%%           3 - Exit            %%\n'),
        write('%%                               %%\n'),
        write('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n').


%%%%%%%%%%%% Print of player 1 turn %%%%%%%%%%%%

print_turn1:-
        nl,
        write('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n'),
        write('%%         Player 1 TURN         %%\n'),
        write('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n').

%%%%%%%%%%%% Print of player 1 turn %%%%%%%%%%%%

print_turn2:-
        nl,
        write('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n'),
        write('%%         Player 2 TURN         %%\n'),
        write('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n').

%%%%%%%%%%%% Print of player 1 turn %%%%%%%%%%%%

print_winner1:-
        nl,
        write('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n'),
        write('%%         Player 1 WIN          %%\n'),
        write('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n').

%%%%%%%%%%%% Print of player 1 turn %%%%%%%%%%%%

print_winner2:-
        nl,
        write('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n'),
        write('%%         Player 2 WIN          %%\n'),
        write('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n').
