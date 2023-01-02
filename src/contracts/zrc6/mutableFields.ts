export const main = `
(* Mutable fields *)

(* Emergency stop mechanism *)
(* Defaults to False *)
field is_paused: Bool = false

(* Token Name *)
(* Defaults to \`name\` *)
(* No need to mutate this field since this is for remote fetch to retrieve the immutable parameter. *)
field token_name: String = name

(* Token Symbol *)
(* Defaults to \`symbol\` *)
(* No need to mutate this field since this is for remote fetch to retrieve the immutable parameter. *)
field token_symbol: String = symbol

(* Contract Owner *)
(* Defaults to \`initial_contract_owner\` *)
field contract_owner: ByStr20 = initial_contract_owner

(* Base URI *)
(* Defaults to \`initial_base_uri\` *)
field base_uri: String = initial_base_uri

(* Token URIs *)
field token_uris: Map Uint256 String = Emp Uint256 String

(* Mapping from token ID to its owner *)
field token_owners: Map Uint256 ByStr20 = Emp Uint256 ByStr20

(* The total number of tokens minted *)
field token_id_count: Uint256 = Uint256 0

(* The total number of existing tokens *)
field total_supply: Uint256 = Uint256 0

(* Mapping from token owner to the number of existing tokens *)
field balances: Map ByStr20 Uint256 = Emp ByStr20 Uint256

(* Set for minters *)
(* \`initial_contract_owner\` is a minter by default *)
field minters: Map ByStr20 Bool =
    let emp_map = Emp ByStr20 Bool in
    builtin put emp_map initial_contract_owner true

(* Mapping from token ID to a spender *)
field spenders: Map Uint256 ByStr20 = Emp Uint256 ByStr20

(* Mapping from token owner to operators authorized by the token owner *)
field operators: Map ByStr20 (Map ByStr20 Bool) = Emp ByStr20 (Map ByStr20 Bool)
`;

export const contractOwnershipRecipient = `
(* Contract ownership recipient *)
(* Defaults to \`zero_address\` *)
field contract_ownership_recipient: ByStr20 = zero_address
`;

export const royalty = `
(* Address to send royalties to *)
(* Defaults to \`initial_contract_owner\` *)
field royalty_recipient: ByStr20 = initial_contract_owner

(* Royalty fee BPS *)
(* e.g. 1 = 0.01%, 10000 = 100% *)
(* Defaults to 1000 *)
field royalty_fee_bps: Uint128 = Uint128 1000
`;
