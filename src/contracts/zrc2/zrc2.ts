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

const generate_zrc2_scilla = (
  is_operator: boolean = false,
  is_mint: boolean = false
) => {
  let output = '';

  output += '\n' + common;
  output += '\n' + contract_definition(is_operator);

  output += '\n' + utils;
  if (is_operator) output += '\n' + utils_operator;

  output += '\n' + mutable_fields;
  if (is_operator) output += '\n' + mutable_fields_operator;

  output += '\n' + procedures;
  if (is_operator) output += '\n' + procedures_operator;
  if (is_mint) output += '\n' + procedures_mint;

  output += '\n' + transitions;
  if (is_operator) output += '\n' + transitions_operators;
  if (is_mint) output += '\n' + transitions_mint;

  return output;
};

export default generate_zrc2_scilla;
