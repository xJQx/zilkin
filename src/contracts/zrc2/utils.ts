export const utils = `
let zero = Uint128 0

(* Dummy user-defined ADT *)
type Unit =
| Unit

let get_val =
  fun (some_val: Option Uint128) =>
  match some_val with
  | Some val => val
  | None => zero
  end
`;

export const utils_operator = `
(* A util function to test equality *)
let f_eq =
  fun (a : ByStr20) =>
  fun (b : ByStr20) =>
    builtin eq a b

(* Instantiate a type function to test membership in a list *)
let is_default_operator = @list_mem ByStr20
`;
