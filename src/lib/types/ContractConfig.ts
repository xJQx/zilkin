import { MintArgs, OperatorArgs } from '../../contracts/zrc2/zrc2';
import { Options as ZRC6Options } from '../../contracts/zrc6/zrc6';
import { ContractType } from './ContractType';

export type ContractConfig = {
  contract?: ContractType;
  zrc2Options?: {
    operatorArgs: OperatorArgs;
    mintArgs: MintArgs;
  };
  zrc6Options?: ZRC6Options;
};
