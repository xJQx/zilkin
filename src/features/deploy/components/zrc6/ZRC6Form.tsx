import React, { useEffect, useState } from 'react';

import { CheckBox } from '../CheckBox';
import { DeployButton, DeployInit } from '../DeployButton';
import generate_zrc6_scilla, {
  ZRC6Options,
} from '../../../../contracts/zrc6/zrc6';
import {
  ZRC6ImmutableFields,
  ZRC6ImmutableFieldsOptions,
  zrc6InitialImmutableFields,
} from './ZRC6ImmutableFields';

const initialZRC6Options: ZRC6Options = {
  pause: false,
  royaltyRecipient: false,
  royaltyBPS: false,
  setBaseURL: false,
  batchMint: false,
  burn: false,
  batchBurn: false,
  batchTransferFrom: false,
  contractOwnershipRecipient: false,
};

export const ZRC6Form = ({
  initialConfig,
}: {
  initialConfig?: ZRC6Options;
}) => {
  const [zrc6Options, setZrc6Options] = useState<ZRC6Options>(
    initialConfig || initialZRC6Options,
  );
  const [immutableFields, setImmutableFields] =
    useState<ZRC6ImmutableFieldsOptions>(zrc6InitialImmutableFields);
  const [scillaCode, setScillaCode] = useState<string>('');
  const [init, setInit] = useState<DeployInit[]>([]);

  useEffect(() => {
    if (window.zilPay !== undefined) {
      setImmutableFields(prev => ({
        ...prev,
        initial_contract_owner: window.zilPay.wallet.defaultAccount.bech32,
      }));
    }
  }, []);

  useEffect(() => {
    if (initialConfig) setZrc6Options(initialConfig);
  }, [initialConfig]);

  useEffect(() => {
    setScillaCode(generate_zrc6_scilla(zrc6Options));
  }, [zrc6Options]);

  useEffect(() => {
    let address = immutableFields.initial_contract_owner;
    try {
      address = window.zilPay.crypto.fromBech32Address(
        immutableFields.initial_contract_owner,
      );
    } catch (e: unknown) {
      console.log(`${address} not valid!`);
    }

    const newInit: DeployInit[] = [
      {
        vname: 'initial_contract_owner',
        type: 'ByStr20',
        value: address,
      },
      {
        vname: 'initial_base_uri',
        type: 'String',
        value: String(immutableFields.initial_base_uri),
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
        vname: '_scilla_version',
        type: 'Uint32',
        value: '0',
      },
    ];

    setInit(newInit);
  }, [immutableFields]);

  return (
    <>
      <div>
        {Object.keys(zrc6Options).map(option => (
          <CheckBox
            key={option}
            option={option}
            checked={zrc6Options[option as keyof ZRC6Options]}
            onChange={() =>
              setZrc6Options(prev => ({
                ...prev,
                [option]: !prev[option as keyof ZRC6Options],
              }))
            }
          />
        ))}
      </div>
      <ZRC6ImmutableFields
        immutableFields={immutableFields}
        setImmutableFields={setImmutableFields}
      />
      <DeployButton scillaCode={scillaCode} init={init} />
    </>
  );
};
