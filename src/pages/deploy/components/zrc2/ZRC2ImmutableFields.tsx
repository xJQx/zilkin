import React from 'react';
import { TextInput } from '../TextInput';

export interface ZRC2ImmutableFieldsOptions {
  contract_owner: string;
  name: string;
  symbol: string;
  decimals: number;
  init_supply: number;
  default_operators: string[];
}

export const zrc2InitialImmutableFields: ZRC2ImmutableFieldsOptions = {
  contract_owner: '',
  name: '',
  symbol: '',
  decimals: 0,
  init_supply: 0,
  default_operators: [],
};

export const ZRC2ImmutableFields = ({
  isOperator,
  immutableFields,
  setImmutableFields,
}: {
  isOperator: boolean;
  immutableFields: ZRC2ImmutableFieldsOptions;
  setImmutableFields: React.Dispatch<
    React.SetStateAction<ZRC2ImmutableFieldsOptions>
  >;
}) => {
  return (
    <div>
      <TextInput
        name="contract_owner"
        value={immutableFields.contract_owner}
        onChange={e =>
          setImmutableFields(prev => ({
            ...prev,
            contract_owner: e.target.value,
          }))
        }
      />
      <TextInput
        name="token_name"
        value={immutableFields.name}
        onChange={e =>
          setImmutableFields(prev => ({ ...prev, name: e.target.value }))
        }
      />
      <TextInput
        name="symbol"
        value={immutableFields.symbol}
        onChange={e =>
          setImmutableFields(prev => ({ ...prev, symbol: e.target.value }))
        }
      />
      <TextInput
        name="decimals"
        value={immutableFields.decimals}
        onChange={e =>
          setImmutableFields(prev => ({
            ...prev,
            decimals: Number(e.target.value),
          }))
        }
        numberInput
      />
      <TextInput
        name="init_supply"
        value={immutableFields.init_supply}
        onChange={e =>
          setImmutableFields(prev => ({
            ...prev,
            init_supply: Number(e.target.value),
          }))
        }
        numberInput
      />
      {isOperator && (
        <TextInput
          name="default_operators"
          value={immutableFields.default_operators}
          onChange={e =>
            setImmutableFields(prev => ({
              ...prev,
              default_operators: [e.target.value],
            }))
          }
        />
      )}
    </div>
  );
};
