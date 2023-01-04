import React from 'react';
import { TextInput } from '../TextInput';

export interface ZRC6ImmutableFieldsOptions {
  initial_contract_owner: string;
  initial_base_uri: string;
  name: string;
  symbol: string;
}

export const zrc6InitialImmutableFields = {
  initial_contract_owner: '',
  initial_base_uri: '',
  name: '',
  symbol: '',
};

export const ZRC6ImmutableFields = ({
  immutableFields,
  setImmutableFields,
}: {
  immutableFields: ZRC6ImmutableFieldsOptions;
  setImmutableFields: React.Dispatch<
    React.SetStateAction<ZRC6ImmutableFieldsOptions>
  >;
}) => {
  return (
    <div>
      {Object.keys(immutableFields).map(key => (
        <TextInput
          key={key}
          name={key}
          value={immutableFields[key as keyof ZRC6ImmutableFieldsOptions]}
          onChange={e =>
            setImmutableFields(prev => ({ ...prev, [key]: e.target.value }))
          }
        />
      ))}
    </div>
  );
};
