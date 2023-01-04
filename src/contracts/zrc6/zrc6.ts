import common from './common';
import { contract_definition } from './contractDefinition';
import * as mutableField from './mutableFields';
import * as procedure from './procedures';
import * as transition from './transitions';

export interface Options {
  pause: boolean;
  royalty: boolean;
  royaltyRecipient: boolean;
  royaltyBPS: boolean;
  setBaseURL: boolean;
  batchMint: boolean;
  burn: boolean;
  batchBurn: boolean;
  batchTransferFrom: boolean;
  contractOwnershipRecipient: boolean;
}

const generate_zrc6_scilla = (options: Options) => {
  let output = '';

  if (options.royaltyRecipient || options.royaltyBPS) options.royalty = true;

  output += '\n' + common;
  output += '\n' + contract_definition;

  output += '\n' + mutableField.main;
  if (options.royalty) output += '\n' + mutableField.royalty;
  if (options.contractOwnershipRecipient)
    output += '\n' + mutableField.contractOwnershipRecipient;

  output += '\n' + procedure.main;
  if (options.royalty) output += '\n' + procedure.royalty;

  output += '\n' + transition.main;
  if (options.pause) output += '\n' + transition.pause;
  if (options.royaltyRecipient) output += '\n' + transition.royalty_recipient;
  if (options.royaltyBPS) output += '\n' + transition.royalty_bps;
  if (options.setBaseURL) output += '\n' + transition.setBaseURL;
  if (options.batchMint) output += '\n' + transition.batchMint;
  if (options.burn) output += '\n' + transition.burn;
  if (options.batchBurn) output += '\n' + transition.batchBurn;
  if (options.batchTransferFrom) output += '\n' + transition.batchTransferFrom;
  if (options.contractOwnershipRecipient)
    output += '\n' + transition.contractOwnershipRecipient;

  return output;
};

export default generate_zrc6_scilla;
