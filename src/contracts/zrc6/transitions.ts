export const main = `
(* Mints a token with a specific \`token_uri\` and transfers it to \`to\`. *)
(* Pass empty string to \`token_uri\` to use the concatenated token URI. i.e. \`<base_uri><token_id>\`. *)
(* @param: to - Address of the token recipient *)
(* @param: token_uri - URI of a token *)
(* @Requirements: *)
(* - The contract must not be paused. Otherwise, it must throw \`PausedError\` *)
transition Mint(to: ByStr20, token_uri: String)
  RequireNotPaused;
  MintToken to;
  token_id <- token_id_count;
  SetTokenURI token_id token_uri;

  e = {
    _eventname: "Mint";
    to: to;
    token_id: token_id;
    token_uri: token_uri
  };
  event e;
  msg_to_recipient = {
    _tag: "ZRC6_RecipientAcceptMint";
    _recipient: to;
    _amount: Uint128 0
  };
  msg_to_sender = {
    _tag: "ZRC6_MintCallback";
    _recipient: _sender;
    _amount: Uint128 0;
    to: to;
    token_id: token_id;
    token_uri: token_uri
  };
  msgs = two_msgs msg_to_recipient msg_to_sender;
  send msgs
end


(* Adds \`minter\`. *)
(* @Requirements: *)
(* - \`_sender\` must be the contract owner. Otherwise, it must throw \`NotContractOwnerError\` *)
(* - \`minter\` must not be already a minter. Otherwise, it must throw \`MinterFoundError\` *)
transition AddMinter(minter: ByStr20)
  RequireContractOwner;
  has_minter <- exists minters[minter];
  match has_minter with
  | True => 
    error = MinterFoundError;
    Throw error
  | False =>
    (* Add minter *)
    minters[minter] := true
  end;
  e = { 
    _eventname: "AddMinter";
    minter: minter
  };
  event e;
  msg_to_sender = {
    _tag: "ZRC6_AddMinterCallback";
    _recipient: _sender;
    _amount: Uint128 0;
    minter: minter
  };
  msgs = one_msg msg_to_sender;
  send msgs
end

(* Removes \`minter\`. *)
(* @Requirements: *)
(* - \`_sender\` must be the contract owner. Otherwise, it must throw \`NotContractOwnerError\` *)
(* - \`minter\` must be already a minter. Otherwise, it must throw \`MinterNotFoundError\` *)
transition RemoveMinter(minter: ByStr20)
  RequireContractOwner;
  has_minter <- exists minters[minter];
  match has_minter with
  | False =>
    error = MinterNotFoundError;
    Throw error
  | True => 
    delete minters[minter]
  end;
  e = { 
    _eventname: "RemoveMinter";
    minter: minter
  };
  event e;
  msg_to_sender = {
    _tag: "ZRC6_RemoveMinterCallback";
    _recipient: _sender;
    _amount: Uint128 0;
    minter: minter
  };
  msgs = one_msg msg_to_sender;
  send msgs
end

(* Sets \`spender\` for \`token_id\`. *)
(* To remove \`spender\` for a token, use \`zero_address\`. *)
(* i.e., \`0x0000000000000000000000000000000000000000\` *)
(* @Requirements: *)
(* - \`token_id\` must exist. Otherwise, it must throw \`TokenNotFoundError\` *)
(* - \`_sender\` must be a token owner or an operator. Otherwise, it must throw \`NotOwnerOrOperatorError\` *)
(* - \`_sender\` must not be \`spender\`. Otherwise, it must throw \`SelfError\` *)
(* - \`spender\` must not be already a spender. Otherwise, it must throw \`SpenderFoundError\` *)
transition SetSpender(spender: ByStr20, token_id: Uint256)
  RequireNotSelf spender _sender;
  
  maybe_token_owner <- token_owners[token_id];
  match maybe_token_owner with
  | None =>
    error = TokenNotFoundError;
    Throw error
  | Some token_owner =>
    RequireOwnerOrOperator token_owner;
    
    (* Check if the spender exists *)
    maybe_spender <- spenders[token_id];
    match maybe_spender with
      | None =>
      | Some cur_spender =>
        has_spender = builtin eq cur_spender spender;
        match has_spender with 
        | False =>
        | True => 
          error = SpenderFoundError;
          Throw error
        end
    end;
      
    spenders[token_id] := spender;

    e = {
      _eventname: "SetSpender";
      token_owner: token_owner;
      spender: spender;
      token_id: token_id
    };
    event e;
    msg_to_sender = {
      _tag: "ZRC6_SetSpenderCallback";
      _recipient: _sender;
      _amount: Uint128 0;
      spender: spender;
      token_id: token_id
    };
    msgs = one_msg msg_to_sender;
    send msgs
  end
end

(* Adds \`operator\` for \`_sender\`. *)
(* @Requirements: *)
(* - \`_sender\` must be the token owner. Otherwise, it must throw \`NotTokenOwnerError\` *)
(* - \`_sender\` must not be \`operator\`. Otherwise, it must throw \`SelfError\` *)
(* - \`operator\` must not be already an operator. Otherwise, it must throw \`OperatorFoundError\` *)
transition AddOperator(operator: ByStr20)
  RequireNotSelf operator _sender;
  
  maybe_bal <- balances[_sender];
  balance = get_bal maybe_bal;
  
  is_balance_zero = builtin eq zero balance;
  (* _sender must have at least 1 token *)
  match is_balance_zero with 
  | True =>    
    error = NotTokenOwnerError;
    Throw error
  | False =>
    has_operator <- exists operators[_sender][operator];
    match has_operator with
    | False =>
      (* Add operator *)
      operators[_sender][operator] := true
    | True =>
      error = OperatorFoundError;
      Throw error
    end;
    e = {
      _eventname: "AddOperator";
      token_owner: _sender;
      operator: operator
    };
    event e;
    msg_to_sender = {
      _tag: "ZRC6_AddOperatorCallback";
      _recipient: _sender;
      _amount: Uint128 0;
      operator: operator
    };
    msgs = one_msg msg_to_sender;
    send msgs
  end
end

(* Removes \`operator\` for \`_sender\`. *)
(* @Requirements:  *)
(* - \`operator\` must be already an operator of \`_sender\`. Otherwise, it must throw \`OperatorNotFoundError\` *)
transition RemoveOperator(operator: ByStr20)
  has_operator <- exists operators[_sender][operator];
  match has_operator with
  | False =>
    error = OperatorNotFoundError;
    Throw error
  | True =>
    (* Remove operator *)
    delete operators[_sender][operator]
  end;
  e = {
    _eventname: "RemoveOperator";
    token_owner: _sender;
    operator: operator
  };
  event e;
  msg_to_sender = {
    _tag: "ZRC6_RemoveOperatorCallback";
    _recipient: _sender;
    _amount: Uint128 0;
    operator: operator
  };
  msgs = one_msg msg_to_sender;
  send msgs
end

(* Transfers \`token_id\` from the token owner to \`to\`.  *)
(* @Requirements: *)
(* - The contract must not be paused. Otherwise, it must throw \`PausedError\` *)
transition TransferFrom(to: ByStr20, token_id: Uint256)
  RequireNotPaused;
  maybe_token_owner <- token_owners[token_id];
  match maybe_token_owner with
  | None =>
    error = TokenNotFoundError;
    Throw error
  | Some token_owner =>
    TransferToken to token_id;
    msg_to_recipient = {
      _tag: "ZRC6_RecipientAcceptTransferFrom";
      _recipient: to;
      _amount: Uint128 0;
      from: token_owner;
      to: to;
      token_id: token_id
    };
    msg_to_sender = {
      _tag: "ZRC6_TransferFromCallback";
      _recipient: _sender;
      _amount: Uint128 0;
      from: token_owner;
      to: to;
      token_id: token_id
    };
    msgs = two_msgs msg_to_recipient msg_to_sender;
    send msgs
  end
end
`;

export const pause = `
(* Pauses the contract. Use this when things are going wrong ('circuit breaker'). *)
(* @Requirements: *)
(* - The contract must not be paused. Otherwise, it must throw \`PausedError\` *)
(* - \`_sender\` must be the contract owner. Otherwise, it must throw \`NotContractOwnerError\` *)
transition Pause()
  RequireNotPaused;
  RequireContractOwner;

  is_paused := true;
  e = {
    _eventname: "Pause";
    is_paused: true
  };
  event e;
  msg_to_sender = {
    _tag: "ZRC6_PauseCallback";
    _recipient: _sender;
    _amount: Uint128 0;
    is_paused: true
  };
  msgs = one_msg msg_to_sender;
  send msgs
end

(* Unpauses the contract. *)
(* @Requirements: *)
(* - The contract must be paused. Otherwise, it must throw \`NotPausedError\` *)
(* - \`_sender\` must be the contract owner. Otherwise, it must throw \`NotContractOwnerError\` *)
transition Unpause()
  paused <- is_paused;
  match paused with
  | True =>
  | False =>
    error = NotPausedError;
    Throw error
  end;
  RequireContractOwner;

  is_paused := false;
  e = {
    _eventname: "Unpause";
    is_paused: false
  };
  event e;
  msg_to_sender = {
    _tag: "ZRC6_UnpauseCallback";
    _recipient: _sender;
    _amount: Uint128 0;
    is_paused: false
  };
  msgs = one_msg msg_to_sender;
  send msgs
end
`;

export const royalty_recipient = `
(* Sets \`to\` as the royalty recipient. *)
(* @param: to - Royalty recipient address  *)
(* @Requirements: *)
(* - \`_sender\` must be the contract owner. Otherwise, it must throw \`NotContractOwnerError\` *)
(* - \`to\` must not be the zero address. Otherwise, it must throw \`ZeroAddressDestinationError\` *)
(* - \`to\` must not be \`_this_address\`. Otherwise, it must throw \`ThisAddressDestinationError\` *)
transition SetRoyaltyRecipient(to: ByStr20)
  RequireContractOwner;
  RequireValidDestination to;
  
  royalty_recipient := to;
  
  e = { 
    _eventname: "SetRoyaltyRecipient";
    to: to
  };
  event e;
  msg_to_sender = {
    _tag: "ZRC6_SetRoyaltyRecipientCallback"; 
    _recipient: _sender;
    _amount: Uint128 0;
    to: to
  };
  msgs = one_msg msg_to_sender;
  send msgs  
end
`;

export const royalty_bps = `
(* Sets \`fee_bps\` as royalty fee bps. *)
(* @param: fee_bps - Royalty fee BPS *)
(* @Requirements: *)
(* - \`_sender\` must be the contract owner. Otherwise, it must throw \`NotContractOwnerError\` *)
(* - \`fee_bps\` must be in the range of 1 and 10000. Otherwise, it must throw \`InvalidFeeBPSError\` *)
transition SetRoyaltyFeeBPS(fee_bps: Uint128)
  RequireContractOwner;
  RequireValidRoyaltyFee fee_bps;
  royalty_fee_bps := fee_bps;
  
  e = { 
    _eventname: "SetRoyaltyFeeBPS";
    royalty_fee_bps: fee_bps
  };(* Sets \`fee_bps\` as royalty fee bps. *)
(* @param: fee_bps - Royalty fee BPS *)
(* @Requirements: *)
(* - \`_sender\` must be the contract owner. Otherwise, it must throw \`NotContractOwnerError\` *)
(* - \`fee_bps\` must be in the range of 1 and 10000. Otherwise, it must throw \`InvalidFeeBPSError\` *)
transition SetRoyaltyFeeBPS(fee_bps: Uint128)
  RequireContractOwner;
    royalty_fee_bps: fee_bps
  };
  msgs = one_msg msg_to_sender;
  send msgs
end
`;

export const setBaseURL = `
(* Sets \`uri\` as the base URI. *)
(* @Requirements: *)
(* - \`_sender\` must be the contract owner. Otherwise, it must throw \`NotContractOwnerError\` *)
transition SetBaseURI(uri: String)
  RequireContractOwner;
  base_uri := uri;

  e = { 
    _eventname: "SetBaseURI";
    base_uri: uri
  };
  event e;
  msg_to_sender = {
    _tag: "ZRC6_SetBaseURICallback"; 
    _recipient: _sender;
    _amount: Uint128 0;
    base_uri: uri
  };
  msgs = one_msg msg_to_sender;
  send msgs  
end
`;

export const batchMint = `
(* Mints multiple tokens with \`token_uri\`s and transfers them to multiple \`to\`s. *)
(* Pass empty string to \`token_uri\` to use the concatenated token URI. i.e. \`<base_uri><token_id>\`. *)
(* @param: to_token_uri_pair_list - List of Pair (to, token_uri). *)
(* @Requirements: *)
(* - The contract must not be paused. Otherwise, it must throw \`PausedError\` *)
transition BatchMint(to_token_uri_pair_list: List (Pair ByStr20 String))
  RequireNotPaused;
  cur_id <- token_id_count;
  start_id = builtin add cur_id one;
  forall to_token_uri_pair_list HandleMint;
  end_id <- token_id_count;
  e = {
    _eventname: "BatchMint";
    to_token_uri_pair_list: to_token_uri_pair_list;
    start_id: start_id;
    end_id: end_id
  };
  event e;
  msg_to_sender = {
    _tag: "ZRC6_BatchMintCallback";
    _recipient: _sender;
    _amount: Uint128 0
  };
  msgs = one_msg msg_to_sender;
  send msgs
end
`;

export const burn = `
(* Destroys \`token_id\`. *)
(* @param: token_id - Unique ID of the NFT to be destroyed *)
(* @Requirements: *)
(* - The contract must not be paused. Otherwise, it must throw \`PausedError\` *)
transition Burn(token_id: Uint256)
  RequireNotPaused;
  (* Check if token exists *)
  maybe_token_owner <- token_owners[token_id];
  match maybe_token_owner with
  | None =>
    error = TokenNotFoundError;
    Throw error
  | Some token_owner =>
    BurnToken token_id;
    msg_to_sender = {
      _tag: "ZRC6_BurnCallback";
      _recipient: _sender;
      _amount: Uint128 0;
      token_owner: token_owner;
      token_id: token_id
    };
    msgs = one_msg msg_to_sender;
    send msgs
  end
end
`;

export const batchBurn = `
(* Destroys \`token_id_list\`. *)
(* @param: token_id_list - List of unique IDs of the NFT to be destroyed *)
(* @Requirements: *)
(* - The contract must not be paused. Otherwise, it must throw \`PausedError\` *)
transition BatchBurn(token_id_list: List Uint256)
  RequireNotPaused;
  forall token_id_list BurnToken;
  msg_to_sender = {
    _tag: "ZRC6_BatchBurnCallback";
    _recipient: _sender;
    _amount: Uint128 0
  };
  msgs = one_msg msg_to_sender;
  send msgs
end
`;

export const batchTransferFrom = `
(* Transfers multiple \`token_id\` to multiple \`to\`. *)
(* @param: to_token_id_pair_list - List of Pair (to, token_id). *)
(* @Requirements: *)
(* - The contract must not be paused. Otherwise, it must throw \`PausedError\` *)
transition BatchTransferFrom(to_token_id_pair_list: List (Pair ByStr20 Uint256))
  RequireNotPaused;
  forall to_token_id_pair_list HandleTransfer;
  msg_to_sender = {
    _tag: "ZRC6_BatchTransferFromCallback";
    _recipient: _sender;
    _amount: Uint128 0
  };
  msgs = one_msg msg_to_sender;
  send msgs
end
`;

export const contractOwnershipRecipient = `
(* Sets \`to\` as the contract ownership recipient. *)
(* To reset \`contract_ownership_recipient\`, use \`zero_address\`. *)
(* i.e., \`0x0000000000000000000000000000000000000000\` *)
(* @param: to - Address of contract ownership recipient *)
(* @Requirements: *)
(* - \`_sender\` must be the contract owner. Otherwise, it must throw \`NotContractOwnerError\` *)
(* - \`_sender\` must not be \`to\`. Otherwise, it must throw \`SelfError\` *)
transition SetContractOwnershipRecipient(to: ByStr20)
  RequireContractOwner;
  RequireNotSelf to _sender;
  
  contract_ownership_recipient := to;

  e = {
    _eventname: "SetContractOwnershipRecipient";
    to: to
  };
  event e;
  msg_to_sender = {
    _tag: "ZRC6_SetContractOwnershipRecipientCallback";
    _recipient: _sender;
    _amount: Uint128 0;
    to: to
  };
  msgs = one_msg msg_to_sender;
  send msgs
end

(* Sets \`contract_ownership_recipient\` as the contract owner. *)
(* @Requirements: *)
(* - \`_sender\` must be the contract ownership recipient. Otherwise, it must throw \`NotContractOwnershipRecipientError\` *)
transition AcceptContractOwnership()
  recipient <- contract_ownership_recipient;

  is_recipient = builtin eq _sender recipient;
  match is_recipient with
  | False =>
    error = NotContractOwnershipRecipientError;
    Throw error
  | True =>
    contract_owner := _sender;
    contract_ownership_recipient := zero_address;

    e = {
      _eventname: "AcceptContractOwnership";
      contract_owner: _sender
    };
    event e;
    msg_to_sender = {
      _tag: "ZRC6_AcceptContractOwnershipCallback";
      _recipient: _sender;
      _amount: Uint128 0;
      contract_owner: _sender
    };
    msgs = one_msg msg_to_sender;
    send msgs
  end
end
`;
