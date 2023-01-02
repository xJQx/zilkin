export const main = `
(* Emit Errors *)
procedure Throw(error: Error)
  e = make_error error;
  throw e
end

procedure RequireNotPaused()
  (* Reference: *)
  (* https://consensys.github.io/smart-contract-best-practices/general_philosophy/#prepare-for-failure *)
  paused <- is_paused;
  match paused with
  | False =>
  | True =>
    (* Contract is paused *)
    error = PausedError;
    Throw error
  end
end

procedure RequireContractOwner()
  cur_owner <- contract_owner;
  is_contract_owner = builtin eq cur_owner _sender;
  match is_contract_owner with
  | True => 
  | False =>
    error = NotContractOwnerError;
    Throw error
  end
end

procedure RequireNotSelf(address_a: ByStr20, address_b: ByStr20)
  is_self = builtin eq address_a address_b;
  match is_self with
  | False =>
  | True =>
    error = SelfError;
    Throw error
  end
end

procedure RequireExistingToken(token_id: Uint256)
  has_token <- exists token_owners[token_id];
  match has_token with
  | True =>
  | False =>
    error = TokenNotFoundError;
    Throw error
  end
end

procedure RequireValidDestination(to: ByStr20)
  (* Reference: https://github.com/ConsenSys/smart-contract-best-practices/blob/master/docs/tokens.md *)
  is_zero_address = builtin eq to zero_address;
  match is_zero_address with
  | False =>
  | True =>
    error = ZeroAddressDestinationError;
    Throw error
  end;

  is_this_address = builtin eq to _this_address;
  match is_this_address with
  | False =>
  | True =>
    error = ThisAddressDestinationError;
    Throw error
  end
end

procedure IsMinter(address: ByStr20)
  has_minter <- exists minters[address];
  match has_minter with
  | True =>
  | False =>
    error = NotMinterError;
    Throw error
  end
end

procedure RequireTokenOwner(token_id: Uint256, address: ByStr20)
  maybe_token_owner <- token_owners[token_id];
  match maybe_token_owner with
  | None =>
    error = TokenNotFoundError;
    Throw error
  | Some addr => 
    is_token_owner = builtin eq addr address;
    match is_token_owner with
    | True =>
    | False =>
      error = NotTokenOwnerError;
      Throw error
    end
  end
end

procedure RequireOwnerOrOperator(address: ByStr20)
  is_owner = builtin eq _sender address;
  has_operator <- exists operators[address][_sender];
  is_allowed = orb is_owner has_operator;
  match is_allowed with
  | True =>
  | False =>
    error = NotOwnerOrOperatorError;
    Throw error
  end
end

procedure RequireAccessToTransfer(token_owner: ByStr20, token_id: Uint256)  
  (* check if _sender is token owner *)
  is_token_owner = builtin eq token_owner _sender;
  
  (* check if _sender is spender *)
  maybe_spender <- spenders[token_id];
  is_spender = match maybe_spender with
    | None => False
    | Some spender => 
      builtin eq spender _sender
    end;

  (* check if _sender is operator *)
  is_operator <- exists operators[token_owner][_sender];
  
  is_spender_or_operator = orb is_spender is_operator;
  is_allowed = orb is_spender_or_operator is_token_owner;
  match is_allowed with
  | True =>
  | False =>
    error = NotAllowedToTransferError;
    Throw error
  end
end

procedure UpdateBalance(operation: Operation, address: ByStr20)
  match operation with
  | Add =>
    maybe_count <- balances[address];
    new_count = 
      let cur_count = get_bal maybe_count in
      (* if overflow occurs, it throws CALL_CONTRACT_FAILED *)
      builtin add cur_count one;
    balances[address] := new_count
  | Sub =>
    maybe_count <- balances[address];
    new_count = 
      let cur_count = get_bal maybe_count in
      (* if underflow occurs, it throws CALL_CONTRACT_FAILED *)
      builtin sub cur_count one;
    balances[address] := new_count
  end
end

(* @Requirements: *)
(* - \`to\` must not be the zero address. Otherwise, it must throw \`ZeroAddressDestinationError\` *)
(* - \`to\` must not be \`_this_address\`. Otherwise, it must throw \`ThisAddressDestinationError\` *)
(* - \`_sender\` must be a minter. Otherwise, it must throw \`NotMinterError\` *)
procedure MintToken(to: ByStr20)
  RequireValidDestination to;

  IsMinter _sender;

  (* generate ID *)
  current_token_id_count <- token_id_count;
  new_token_id_count = builtin add current_token_id_count one;
  token_id_count := new_token_id_count;
  token_id = new_token_id_count;

  (* mint a new token *)
  token_owners[token_id] := to;

  (* add one to the token owner balance *)
  UpdateBalance add_operation to;
  
  (* add one to the total supply *)
  current_supply <- total_supply;
  new_supply = builtin add current_supply one;
  total_supply := new_supply
end

procedure SetTokenURI(token_id: Uint256, token_uri: String)
  is_empty_string = builtin eq token_uri empty_string;
  match is_empty_string with 
  | True => 
    (* noop *)
  | False =>
    token_uris[token_id] := token_uri
  end
end

procedure HandleMint(info: Pair ByStr20 String)
  match info with
  | Pair to token_uri =>
    MintToken to;
    token_id <- token_id_count;
    SetTokenURI token_id token_uri
  end
end

(* @Requirements: *)
(* - \`token_id\` must exist. Otherwise, it must throw \`TokenNotFoundError\` *)
(* - \`_sender\` must be a token owner or an operator. Otherwise, it must throw \`NotOwnerOrOperatorError\` *)
procedure BurnToken(token_id: Uint256)
  (* Check if token exists *)
  maybe_token_owner <- token_owners[token_id];
  match maybe_token_owner with
  | None =>
    error = TokenNotFoundError;
    Throw error
  | Some token_owner =>
    RequireOwnerOrOperator token_owner;
    (* Destroy existing token *)
    delete token_owners[token_id];
    delete token_uris[token_id];
    delete spenders[token_id];

    (* subtract one from the balance *)
    UpdateBalance sub_operation token_owner;
    (* subtract one from the total supply *)
    current_supply <- total_supply;
    new_supply = builtin sub current_supply one;
    total_supply := new_supply;

    e = {
      _eventname: "Burn";
      token_owner: token_owner;
      token_id: token_id
    };
    event e
  end
end

(* @Requirements: *)
(* - \`to\` must not be the zero address. Otherwise, it must throw \`ZeroAddressDestinationError\` *)
(* - \`to\` must not be \`_this_address\`. Otherwise, it must throw \`ThisAddressDestinationError\` *)
(* - \`token_id\` must exist. Otherwise, it must throw \`TokenNotFoundError\` *)
(* - \`_sender\` must be a token owner, spender, or operator. Otherwise, it must throw \`NotAllowedToTransferError\` *)
(* - \`_sender\` must not be \`to\`. Otherwise, it must throw \`SelfError\` *)
procedure TransferToken(to: ByStr20, token_id: Uint256)
  RequireValidDestination to;

  maybe_token_owner <- token_owners[token_id];
  match maybe_token_owner with
  | None =>
    error = TokenNotFoundError;
    Throw error
  | Some token_owner =>
    RequireAccessToTransfer token_owner token_id;
    RequireNotSelf token_owner to;
    
    (* change token_owner for that token_id *)
    token_owners[token_id] := to;

    delete spenders[token_id];

    (* subtract one from previous token owner balance *)
    UpdateBalance sub_operation token_owner;
    (* add one to the new token owner balance *)
    UpdateBalance add_operation to;

    e = {
      _eventname: "TransferFrom"; 
      from: token_owner;
      to: to;
      token_id: token_id
    };
    event e
  end
end

procedure HandleTransfer(info: Pair ByStr20 Uint256)
  match info with
  | Pair to token_id =>
    TransferToken to token_id
  end
end
`;

export const royalty = `
procedure RequireValidRoyaltyFee(fee_bps: Uint128)
  is_gte_min = uint128_ge fee_bps min_fee_bps;
  is_lte_max = uint128_le fee_bps max_fee_bps;
  
  is_valid = andb is_gte_min is_lte_max;
  match is_valid with 
    | True => 
    | False =>
      error = InvalidFeeBPSError;
      Throw error
  end
end
`;
