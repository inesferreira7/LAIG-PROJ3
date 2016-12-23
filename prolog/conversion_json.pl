matrix_to_json([], []).
matrix_to_json([List | R], [JsonList | Json]):-
  list_to_json(List, JsonList),
  matrix_to_json(R, Json).

list_to_json([], []).
list_to_json([Element | Rest], [JsonElem | JsonRest]):-
  atom_concat('"', Element, JsonTemp),
  atom_concat(JsonTemp, '"', JsonElem),
  list_to_json(Rest, JsonRest).
