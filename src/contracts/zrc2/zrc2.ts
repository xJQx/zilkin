import common from './common';
import { contract_definition } from './contractDefinition';
import { mutable_fields, mutable_fields_operator } from './mutableFields';
import { procedures, procedures_mint, procedures_operator } from './procedures';
import {
  transitions,
  transitions_mint,
  transitions_operators,
} from './transitions';
import { utils, utils_operator } from './utils';

interface MintArgs {
  isMint: boolean;
  mint?: boolean;
  burn?: boolean;
}

interface OperatorArgs {
  isOperator: boolean;
  isOperatorFor?: boolean;
  authorizeOperator?: boolean;
  revokeOperator?: boolean;
  operatorSend?: boolean;
}

const generate_zrc2_scilla = (
  operatorArgs: OperatorArgs,
  mintArgs: MintArgs,
) => {
  let { isMint, mint, burn } = mintArgs;
  let { isOperator, ...operatorOptions } = operatorArgs;

  if (mint || burn) isMint = true;

  let output = '';

  output += '\n' + common;
  output += '\n' + contract_definition(isOperator);

  output += '\n' + utils;
  if (isOperator) output += '\n' + utils_operator;

  output += '\n' + mutable_fields;
  if (isOperator) output += '\n' + mutable_fields_operator;

  output += '\n' + procedures;
  if (isOperator) output += '\n' + procedures_operator;
  if (isMint) output += '\n' + procedures_mint(mint, burn);

  output += '\n' + transitions;
  if (isOperator) output += '\n' + transitions_operators(operatorOptions);
  if (isMint) output += '\n' + transitions_mint(mint, burn);

  return output;
};

export default generate_zrc2_scilla;
