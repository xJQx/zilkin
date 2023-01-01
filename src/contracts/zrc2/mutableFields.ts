export const mutable_fields = `
field total_supply : Uint128 = init_supply

field balances: Map ByStr20 Uint128 
  = let emp_map = Emp ByStr20 Uint128 in
    builtin put emp_map contract_owner init_supply

field allowances: Map ByStr20 (Map ByStr20 Uint128) 
  = Emp ByStr20 (Map ByStr20 Uint128)
`;

export const mutable_fields_operator = `
field operators: Map ByStr20 (Map ByStr20 Unit) 
  = Emp ByStr20 (Map ByStr20 Unit)

field revoked_default_operators : Map ByStr20 (Map ByStr20 Unit) 
  = Emp ByStr20 (Map ByStr20 Unit)
`;
