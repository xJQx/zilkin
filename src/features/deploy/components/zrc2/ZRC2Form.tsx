import React, { useEffect, useState } from 'react';

import { CheckBox } from '../CheckBox';
import { DeployButton, DeployInit } from '../DeployButton';
import generate_zrc2_scilla from '../../../../contracts/zrc2/zrc2';
import {
  ZRC2ImmutableFields,
  ZRC2ImmutableFieldsOptions,
  zrc2InitialImmutableFields,
} from './ZRC2ImmutableFields';
import { ContractConfig } from '../../../../lib/types';

interface MintOptions {
  mint: boolean;
  burn: boolean;
}

interface OperatorOptions {
  isOperatorFor: boolean;
  authorizeOperator: boolean;
  revokeOperator: boolean;
  operatorSend: boolean;
}

const initialMintOptions: MintOptions = {
  mint: false,
  burn: false,
};

const initialOperatorOptions: OperatorOptions = {
  isOperatorFor: false,
  authorizeOperator: false,
  revokeOperator: false,
  operatorSend: false,
};

export const ZRC2Form = ({
  initialConfig,
}: {
  initialConfig?: ContractConfig['zrc2Options'];
}) => {
  const [mintOptions, setMintOptions] = useState<MintOptions>(
    initialConfig?.mintArgs || initialMintOptions,
  );
  const [operatorOptions, setOperatorOptions] = useState<OperatorOptions>(
    initialConfig?.operatorArgs || initialOperatorOptions,
  );
  const [immutableFields, setImmutableFields] =
    useState<ZRC2ImmutableFieldsOptions>(zrc2InitialImmutableFields);
  const [scillaCode, setScillaCode] = useState<string>('');
  const [init, setInit] = useState<DeployInit[]>([]);

  useEffect(() => {
    if (window.zilPay !== undefined) {
      setImmutableFields(prev => ({
        ...prev,
        contract_owner: window.zilPay.wallet.defaultAccount.bech32,
      }));
    }
  }, []);

  useEffect(() => {
    if (initialConfig?.mintArgs) setMintOptions(initialConfig.mintArgs);
    if (initialConfig?.operatorArgs)
      setOperatorOptions(initialConfig.operatorArgs);
  }, [initialConfig]);

  useEffect(() => {
    setScillaCode(generate_zrc2_scilla(operatorOptions, mintOptions));
  }, [mintOptions, operatorOptions]);

  useEffect(() => {
    let address = immutableFields.contract_owner;
    try {
      address = window.zilPay.crypto.fromBech32Address(
        immutableFields.contract_owner,
      );
    } catch (e: unknown) {
      console.log(`${address} not valid!`);
    }

    const newInit: DeployInit[] = [
      {
        vname: 'contract_owner',
        type: 'ByStr20',
        value: address,
      },
      {
        vname: 'name',
        type: 'String',
        value: immutableFields.name,
      },
      {
        vname: 'symbol',
        type: 'String',
        value: immutableFields.symbol,
      },
      {
        vname: 'decimals',
        type: 'Uint32',
        value: String(immutableFields.decimals),
      },
      {
        vname: 'init_supply',
        type: 'Uint128',
        value: String(immutableFields.init_supply),
      },
      {
        vname: '_scilla_version',
        type: 'Uint32',
        value: '0',
      },
    ];

    if (Object.values(operatorOptions).filter(opt => opt).length > 0)
      newInit.push({
        vname: 'default_operators',
        type: 'List ByStr20',
        value: immutableFields.default_operators.filter(opt => opt !== ''),
      });

    setInit(newInit);
  }, [immutableFields]);

  return (
    <>
      <div>
        <div className="text-white my-2 font-medium underline text-sm">
          Mintable
        </div>
        {Object.keys(mintOptions).map(option => (
          <CheckBox
            key={option}
            option={option}
            checked={mintOptions[option as keyof MintOptions]}
            onChange={() =>
              setMintOptions(prev => ({
                ...prev,
                [option]: !prev[option as keyof MintOptions],
              }))
            }
          />
        ))}
        <div className="text-white my-2 font-medium underline text-sm">
          Operator
        </div>
        {Object.keys(operatorOptions).map(option => (
          <CheckBox
            key={option}
            option={option}
            checked={operatorOptions[option as keyof OperatorOptions]}
            onChange={() =>
              setOperatorOptions(prev => ({
                ...prev,
                [option]: !prev[option as keyof OperatorOptions],
              }))
            }
          />
        ))}
      </div>
      <ZRC2ImmutableFields
        isOperator={
          Object.values(operatorOptions).filter(checked => checked).length > 0
        }
        immutableFields={immutableFields}
        setImmutableFields={setImmutableFields}
      />
      <DeployButton scillaCode={scillaCode} init={init} />
    </>
  );
};
