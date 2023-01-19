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
  default_operators: [''],
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
      {/* TODO: verify user input is b-12 */}
      {isOperator &&
        immutableFields.default_operators.map((val, index) => (
          <div key={index} className="relative w-fit">
            <TextInput
              name={`default_operators ${index + 1}`}
              value={val}
              onChange={e =>
                setImmutableFields(prev => {
                  const newImmutableFields = JSON.parse(JSON.stringify(prev));
                  newImmutableFields.default_operators[index] = e.target.value;
                  return newImmutableFields;
                })
              }
            />
            <div
              className="absolute right-0 top-0 bg-brand-green-default/50 border border-transparent text-white text-sm rounded py-1 px-2 cursor-pointer ease-in-out hover:scale-90 duration-200"
              onClick={() => {
                console.log('click');
                setImmutableFields(prev => {
                  console.log(`prev ${prev.default_operators}`);
                  const newImmutableFields = JSON.parse(JSON.stringify(prev));
                  newImmutableFields.default_operators.splice(index, 1);
                  return newImmutableFields;
                });
              }}
            >
              -
            </div>
          </div>
        ))}
      {isOperator && (
        <div
          className="flex text-md px-2 rounded-full cursor-pointer border-2 border-brand-green-default bg-brand-green-default ease-in-out hover:scale-90 duration-200 w-fit ml-auto"
          onClick={() => {
            setImmutableFields(prev => ({
              ...prev,
              default_operators: [...prev.default_operators, ''],
            }));
          }}
        >
          +
        </div>
      )}
    </div>
  );
};
