export const contract_definition = `
contract NonfungibleToken
(
  initial_contract_owner: ByStr20,
  (* Initial Base URI. e.g. \`https://creatures-api.zilliqa.com/api/creature/\` *)
  initial_base_uri: String,
  name: String,
  symbol: String
)

(* Contract constraints *)
with
  (* \`initial_contract_owner\` must not be the zero address *)
  let is_contract_owner_invalid = builtin eq initial_contract_owner zero_address in
  (* \`name\` must not be an empty string *)
  let is_name_invalid = builtin eq name empty_string in
  (* \`symbol\` must not be an empty string *)
  let is_symbol_invalid = builtin eq symbol empty_string in
  (* Check if any parameter is invalid *)
  let is_name_or_symbol_invalid = orb is_name_invalid is_symbol_invalid in

  let is_invalid = orb is_contract_owner_invalid is_name_or_symbol_invalid in
  negb is_invalid
=>
`;
