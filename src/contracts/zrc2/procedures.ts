export const procedures = `
procedure ThrowError(err : Error)
  e = make_error err;
  throw e
end

procedure IsNotSender(address: ByStr20)
  is_sender = builtin eq _sender address;
  match is_sender with
  | True =>
    err = CodeIsSender;
    ThrowError err
  | False =>
  end
end

procedure AuthorizedMoveIfSufficientBalance(from: ByStr20, to: ByStr20, amount: Uint128)
  o_from_bal <- balances[from];
  bal = get_val o_from_bal;
  can_do = uint128_le amount bal;
  match can_do with
  | True =>
    (* Subtract amount from from and add it to to address *)
    new_from_bal = builtin sub bal amount;
    balances[from] := new_from_bal;
    (* Adds amount to to address *)
    get_to_bal <- balances[to];
    new_to_bal = match get_to_bal with
    | Some bal => builtin add bal amount
    | None => amount
    end;
    balances[to] := new_to_bal
  | False =>
    (* Balance not sufficient *)
    err = CodeInsufficientFunds;
    ThrowError err
  end
end
`;

export const procedures_operator = `
procedure IsApprovedOperator(token_owner: ByStr20, operator: ByStr20)
  is_operator_approved <- exists operators[token_owner][operator];
  is_default_operator = is_default_operator f_eq operator default_operators;
  is_revoked_operator <- exists revoked_default_operators[token_owner][operator];
  is_default_operator_approved = 
    let is_not_revoked_operator = negb is_revoked_operator in 
    andb is_not_revoked_operator is_default_operator;
  is_approved = orb is_operator_approved is_default_operator_approved;
  match is_approved with
  | True =>
  | False =>
    err = CodeNotApprovedOperator;
    ThrowError err
  end
end
`;

const procedures_mint_mint = `
procedure AuthorizedMint(recipient: ByStr20, amount: Uint128) 
  o_recipient_bal <- balances[recipient];
  bal = get_val o_recipient_bal;
  new_balance = builtin add amount bal;
  balances[recipient] := new_balance;
  current_total_supply <- total_supply;
  new_total_supply = builtin add current_total_supply amount;
  total_supply := new_total_supply;
  e = {_eventname: "Minted"; minter: _sender; recipient: recipient; amount: amount};
  event e
end
`

const procedures_mint_burn = `
procedure AuthorizedBurnIfSufficientBalance(from: ByStr20, amount: Uint128)
  o_get_bal <- balances[from];
  bal = get_val o_get_bal;
  can_burn = uint128_le amount bal;
  match can_burn with
  | True =>
    (* Subtract amount from from *)
    new_balance = builtin sub bal amount;
    balances[from] := new_balance;
    current_total_supply <- total_supply;
    new_total_supply = builtin sub current_total_supply amount;
    total_supply := new_total_supply;
    e = {_eventname: "Burnt"; burner: _sender; burn_account: from; amount: amount};
    event e  
  | False =>
    err = CodeInsufficientFunds;
    ThrowError err
  end
end
`

export const procedures_mint = (mint: boolean = false, burn: boolean = false) => `
procedure IsOwner(address: ByStr20)
  is_owner = builtin eq contract_owner address;
  match is_owner with
  | True =>
  | False =>
    err = CodeNotOwner;
    ThrowError err
  end
end

${mint ? procedures_mint_mint: ''}

${burn ? procedures_mint_burn: ''}
`;
