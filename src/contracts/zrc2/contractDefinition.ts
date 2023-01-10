export const contract_definition = (operator: boolean = false) => `
contract FungibleToken
(
  contract_owner: ByStr20,
  name : String,
  symbol: String,
  decimals: Uint32,
  init_supply : Uint128${operator ? "," : ''}
  ${operator ? 'default_operators : List ByStr20' : ''}
)
`;
