import React, { useEffect, useState } from 'react';

import generate_zrc2_scilla from '../../contracts/zrc2/zrc2';
import generate_zrc6_scilla, { ZRC6Options } from '../../contracts/zrc6/zrc6';

declare global {
  interface Window {
    zilPay: any;
  }
}

const tokens = ['ZRC-2', 'ZRC-6'];

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

const ConnectButton = ({
  setConnected,
}: {
  setConnected: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const connect = async () => {
    if (window.zilPay !== undefined) {
      const isConnect = await window.zilPay.wallet.connect();
      if (isConnect) setConnected(true);
      else alert('User rejected');
    } else {
      alert('ZilPay not found!');
    }
  };
  return (
    <div
      className="text-xl px-6 py-2 rounded-full cursor-pointer border-2 border-brand-green-default bg-brand-green-default ease-in-out hover:scale-110 duration-200"
      onClick={connect}
    >
      Connect
    </div>
  );
};

const Content = () => {
  const [token, setToken] = useState<string>(tokens[0]);

  return (
    <div className="flex flex-col justify-center items-center pt-40 px-4 gap-6">
      <div className="text-white">Deploy Page</div>
      <div className="flex flex-wrap gap-3 justify-center">
        {tokens.map(tok => (
          <div
            key={tok}
            className={`text-sm px-4 py-1 rounded-full cursor-pointer border-2 border-brand-green-default hover:bg-brand-green-default hover:text-black ease-in-out duration-200 ${
              token === tok ? 'bg-brand-green-default text-black' : 'text-white'
            }`}
            onClick={() => {
              setToken(tok);
            }}
          >
            {tok}
          </div>
        ))}
      </div>
      {token === 'ZRC-2' && <ZRC2Content />}
      {token === 'ZRC-6' && <ZRC6Content />}
    </div>
  );
};

const ZRC2Content = () => {
  const [mintOptions, setMintOptions] =
    useState<MintOptions>(initialMintOptions);
  const [operatorOptions, setOperatorOptions] = useState<OperatorOptions>(
    initialOperatorOptions,
  );
  const [immutableFields, setImmutableFields] =
    useState<ZRC2ImmutableFieldsOptions>(zrc2InitialImmutableFieldsOptions);
  const [scillaCode, setScillaCode] = useState<string>('');
  const [init, setInit] = useState<DeployInit[]>([]);

  useEffect(() => {
    setScillaCode(
      generate_zrc2_scilla(
        {
          isOperator:
            Object.values(operatorOptions).filter(opt => opt).length > 0,
          ...operatorOptions,
        },
        {
          isMint: Object.values(mintOptions).filter(opt => opt).length > 0,
          ...mintOptions,
        },
      ),
    );
  }, [mintOptions, operatorOptions]);

  useEffect(() => {
    const newInit: DeployInit[] = [
      {
        vname: 'contract_owner',
        type: 'ByStr20',
        value: window.zilPay.crypto.fromBech32Address(
          immutableFields.contract_owner,
        ),
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
        value: immutableFields.default_operators,
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

const ZRC6Content = () => {
  const [zrc6Options, setZrc6Options] =
    useState<ZRC6Options>(initialZRC6Options);
  const [immutableFields, setImmutableFields] =
    useState<ZRC6ImmutableFieldsOptions>(zrc6InitialImmutableFields);
  const [scillaCode, setScillaCode] = useState<string>('');
  const [init, setInit] = useState<DeployInit[]>([]);

  useEffect(() => {
    setScillaCode(generate_zrc6_scilla(zrc6Options));
  }, [zrc6Options]);

  useEffect(() => {
    const newInit: DeployInit[] = [
      {
        vname: 'initial_contract_owner',
        type: 'ByStr20',
        value: window.zilPay.crypto.fromBech32Address(
          immutableFields.initial_contract_owner,
        ),
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

const CheckBox = ({
  option,
  checked,
  onChange,
}: {
  option: string;
  checked: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}) => {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2" key={option}>
        <input
          type="checkbox"
          id="mint"
          checked={checked}
          onChange={onChange}
          className="w-4 h-4 text-brand-green-default bg-brand-green-default rounded border-brand-green-default accent-brand-green-default"
        />
        <label htmlFor="mint" className="text-white text-sm font-medium">
          {option}
        </label>
      </div>
    </div>
  );
};

interface ZRC2ImmutableFieldsOptions {
  contract_owner: string;
  name: string;
  symbol: string;
  decimals: number;
  init_supply: number;
  default_operators: string[];
}

const zrc2InitialImmutableFieldsOptions: ZRC2ImmutableFieldsOptions = {
  contract_owner: window.zilPay.wallet.defaultAccount.bech32,
  name: '',
  symbol: '',
  decimals: 0,
  init_supply: 0,
  default_operators: [],
};

const ZRC2ImmutableFields = ({
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

interface ZRC6ImmutableFieldsOptions {
  initial_contract_owner: string;
  initial_base_uri: string;
  name: string;
  symbol: string;
}

const zrc6InitialImmutableFields = {
  initial_contract_owner: window.zilPay.wallet.defaultAccount.bech32,
  initial_base_uri: '',
  name: '',
  symbol: '',
};

const ZRC6ImmutableFields = ({
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

const TextInput = ({
  name,
  value,
  onChange,
  numberInput,
}: {
  name: string;
  value: string | number | string[];
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  numberInput?: boolean;
}) => {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-between mb-3">
      <label htmlFor={name} className="text-sm text-white font-medium">
        {name}
      </label>
      <input
        type={numberInput ? 'number' : 'text'}
        id={name}
        value={value}
        className="bg-brand-green-default/50 border border-transparent text-white text-sm rounded py-1 px-2 focus:border-brand-green-default focus:outline-none"
        required
        onChange={onChange}
      ></input>
    </div>
  );
};

interface DeployInit {
  vname: string;
  type: string;
  value: string | number | string[];
}

const DeployButton = ({
  init,
  scillaCode,
}: {
  init?: DeployInit[];
  scillaCode?: string;
}) => {
  console.log(scillaCode);
  const deploy = async () => {
    if (window.zilPay !== undefined) {
      const contract = window.zilPay.contracts.new(scillaCode, init);
      try {
        const [tx, _] = await contract.deploy({
          gasLimit: '25000',
          gasPrice: '1000000000',
        });
        window.open(
          `https://viewblock.io/zilliqa/tx/0x${tx.ID}?network=${window.zilPay.wallet.net}`,
        );
      } catch (e: any) {
        alert(e);
      }
    } else {
      alert('ZilPay not found!');
    }
  };
  return (
    <div
      className="text-xl px-6 py-2 rounded-full cursor-pointer border-2 border-brand-green-default bg-brand-green-default ease-in-out hover:scale-110 duration-200"
      onClick={deploy}
    >
      Deploy
    </div>
  );
};

export const DeployPage = () => {
  const [connected, setConnected] = useState<boolean>(false);

  return (
    <div className="flex flex-col justify-center items-center pt-40 px-4 gap-6">
      {connected ? <Content /> : <ConnectButton setConnected={setConnected} />}
    </div>
  );
};
