export const transitions = `
(* @dev: Increase the allowance of an approved_spender over the caller tokens. Only token_owner allowed to invoke.   *)
(* param spender:      Address of the designated approved_spender.                                                   *)
(* param amount:       Number of tokens to be increased as allowance for the approved_spender.                       *)
transition IncreaseAllowance(spender: ByStr20, amount: Uint128)
  IsNotSender spender;
  some_current_allowance <- allowances[_sender][spender];
  current_allowance = get_val some_current_allowance;
  new_allowance = builtin add current_allowance amount;
  allowances[_sender][spender] := new_allowance;
  e = {_eventname : "IncreasedAllowance"; token_owner : _sender; spender: spender; new_allowance : new_allowance};
  event e
end

(* @dev: Decrease the allowance of an approved_spender over the caller tokens. Only token_owner allowed to invoke. *)
(* param spender:      Address of the designated approved_spender.                                                 *)
(* param amount:       Number of tokens to be decreased as allowance for the approved_spender.                     *)
transition DecreaseAllowance(spender: ByStr20, amount: Uint128)
  IsNotSender spender;
  some_current_allowance <- allowances[_sender][spender];
  current_allowance = get_val some_current_allowance;
  new_allowance =
    let amount_le_allowance = uint128_le amount current_allowance in
      match amount_le_allowance with
      | True => builtin sub current_allowance amount
      | False => zero
      end;
  allowances[_sender][spender] := new_allowance;
  e = {_eventname : "DecreasedAllowance"; token_owner : _sender; spender: spender; new_allowance : new_allowance};
  event e
end

(* @dev: Moves an amount tokens from _sender to the recipient. Used by token_owner. *)
(* @dev: Balance of recipient will increase. Balance of _sender will decrease.      *)
(* @param to:  Address of the recipient whose balance is increased.                 *)
(* @param amount:     Amount of tokens to be sent.                                  *)
transition Transfer(to: ByStr20, amount: Uint128)
  AuthorizedMoveIfSufficientBalance _sender to amount;
  e = {_eventname : "TransferSuccess"; sender : _sender; recipient : to; amount : amount};
  event e;
  (* Prevent sending to a contract address that does not support transfers of token *)
  msg_to_recipient = {_tag : "RecipientAcceptTransfer"; _recipient : to; _amount : zero; 
                      sender : _sender; recipient : to; amount : amount};
  msg_to_sender = {_tag : "TransferSuccessCallBack"; _recipient : _sender; _amount : zero; 
                  sender : _sender; recipient : to; amount : amount};
  msgs = two_msgs msg_to_recipient msg_to_sender;
  send msgs
end

(* @dev: Move a given amount of tokens from one address to another using the allowance mechanism. The caller must be an approved_spender. *)
(* @dev: Balance of recipient will increase. Balance of token_owner will decrease.                                                        *)
(* @param from:    Address of the token_owner whose balance is decreased.                                                                 *)
(* @param to:      Address of the recipient whose balance is increased.                                                                   *)
(* @param amount:  Amount of tokens to be transferred.                                                                                    *)
transition TransferFrom(from: ByStr20, to: ByStr20, amount: Uint128)
  o_spender_allowed <- allowances[from][_sender];
  allowed = get_val o_spender_allowed;
  can_do = uint128_le amount allowed;
  match can_do with
  | True =>
    AuthorizedMoveIfSufficientBalance from to amount;
    e = {_eventname : "TransferFromSuccess"; initiator : _sender; sender : from; recipient : to; amount : amount};
    event e;
    new_allowed = builtin sub allowed amount;
    allowances[from][_sender] := new_allowed;
    (* Prevent sending to a contract address that does not support transfers of token *)
    msg_to_recipient = {_tag: "RecipientAcceptTransferFrom"; _recipient : to; _amount: zero; 
                        initiator: _sender; sender : from; recipient: to; amount: amount};
    msg_to_sender = {_tag: "TransferFromSuccessCallBack"; _recipient: _sender; _amount: zero; 
                    initiator: _sender; sender: from; recipient: to; amount: amount};
    msgs = two_msgs msg_to_recipient msg_to_sender;
    send msgs
  | False =>
    err = CodeInsufficientAllowance;
    ThrowError err
  end
end
`;

interface OperatorOptions {
  isOperatorFor?: boolean;
  authorizeOperator?: boolean;
  revokeOperator?: boolean;
  operatorSend?: boolean;
}

export const transitions_operators = (operatorOptions: OperatorOptions) => {
  const { isOperatorFor, authorizeOperator, revokeOperator, operatorSend } =
    operatorOptions;

  let output = '';

  if (isOperatorFor) output += transitions_operators_operator_for + '\n';
  if (authorizeOperator) output += transitions_operators_authorize + '\n';
  if (revokeOperator) output += transitions_operators_revoke + '\n';
  if (operatorSend) output += transitions_operators_send + '\n';

  return output;
};

const transitions_operators_operator_for = `
(* @dev: Check if an address is an operator or default operator of a token_owner. Throw if not. *)
(* @param operator:    Address of a potential operator.                                         *)
(* @param token_owner: Address of a token_owner.                                                *)
transition IsOperatorFor(token_owner: ByStr20, operator: ByStr20)
  IsApprovedOperator token_owner operator;
  msg_to_sender = {_tag : "IsOperatorForCallBack"; _recipient : _sender; _amount : zero;
                    token_owner: token_owner; operator : operator};
  msgs = one_msg msg_to_sender;
  send msgs
end
`;

const transitions_operators_authorize = `
(* @dev: Make an address an operator of the caller.             *)
(* @param operator: Address to be authorize as operator or      *)
(* Re-authorize as default_operator. Cannot be calling address. *)
transition AuthorizeOperator(operator: ByStr20)
  IsNotSender operator;
  (* Re-authorize default_operator if exists *)
  delete revoked_default_operators[_sender][operator];
  (* Authorize new operator if not default_operator *)
  verdad = Unit;
  operators[_sender][operator] := verdad;
  e = {_eventname : "AuthorizeOperatorSuccess"; authorizer : _sender; authorized_operator : operator};
  event e
end
`;

const transitions_operators_revoke = `
(* @dev: Revoke an address from being an operator or default_operator of the caller. *)
(* @param operator: Address to be removed as operator or default_operator.           *)
transition RevokeOperator(operator: ByStr20)
  IsApprovedOperator _sender operator;
  (* Remove operator if exists *)
  delete operators[_sender][operator];
  (* Revoke default_operator if exists *)
  verdad = Unit;
  revoked_default_operators[_sender][operator] := verdad;
  e = {_eventname : "RevokeOperatorSuccess"; revoker : _sender; revoked_operator : operator};
  event e
end
`;

const transitions_operators_send = `
(* @dev: Moves amount tokens from token_owner to recipient. _sender must be an operator of token_owner. *)
(* @dev: Balance of recipient will increase. Balance of token_owner will decrease.                      *)
(* @param from:        Address of the token_owner whose balance is decreased.                           *)
(* @param to:          Address of the recipient whose balance is increased.                             *)
(* @param amount:      Amount of tokens to be sent.                                                     *)
transition OperatorSend(from: ByStr20, to: ByStr20, amount: Uint128)
  IsApprovedOperator from _sender;
  AuthorizedMoveIfSufficientBalance from to amount;
  e = {_eventname : "OperatorSendSuccess"; initiator : _sender; sender : from; recipient : to; amount : amount};
  event e;
  (* Prevent sending to a contract address that does not support transfers of token *)
  msg_to_recipient = {_tag : "RecipientAcceptOperatorSend"; _recipient : to; _amount : zero; 
                      initiator : _sender; sender : from; recipient : to; amount : amount};
  msg_to_sender = {_tag : "OperatorSendSuccessCallBack"; _recipient : _sender; _amount : zero; 
                  initiator : _sender; sender : from; recipient : to; amount : amount};
  msgs = two_msgs msg_to_recipient msg_to_sender;
  send msgs
end
`;

export const transitions_mint = (
  mint: boolean = false,
  burn: boolean = false,
) => `
${mint ? transitions_mint_mint : ''}

${mint ? transitions_mint_burn : ''}
`;

const transitions_mint_mint = `
(* @dev: Mint new tokens. Only contract_owner can mint.                      *)
(* @param recipient: Address of the recipient whose balance is to increase.  *)
(* @param amount:    Number of tokens to be minted.                          *)
transition Mint(recipient: ByStr20, amount: Uint128)
  IsOwner _sender;
  AuthorizedMint recipient amount;
  (* Prevent sending to a contract address that does not support transfers of token *)
  msg_to_recipient = {_tag : "RecipientAcceptMint"; _recipient : recipient; _amount : zero; 
                      minter : _sender; recipient : recipient; amount : amount};
  msg_to_sender = {_tag : "MintSuccessCallBack"; _recipient : _sender; _amount : zero; 
                      minter : _sender; recipient : recipient; amount : amount};
  msgs = two_msgs msg_to_recipient msg_to_sender;
  send msgs
end
`;

const transitions_mint_burn = `
(* @dev: Burn existing tokens. Only contract_owner can burn.                      *)
(* @param burn_account: Address of the token_owner whose balance is to decrease.  *)
(* @param amount:       Number of tokens to be burned.                            *)
transition Burn(burn_account: ByStr20, amount: Uint128)
  IsOwner _sender;
  AuthorizedBurnIfSufficientBalance burn_account amount;
  msg_to_sender = {_tag : "BurnSuccessCallBack"; _recipient : _sender; _amount : zero; 
                    burner : _sender; burn_account : burn_account; amount : amount};
  msgs = one_msg msg_to_sender;
  send msgs
end
`;
