import React, { useEffect, useState } from 'react';

import { ZRC6Form } from './components/zrc6/ZRC6Form';
import { ZRC2Form } from './components/zrc2/ZRC2Form';
import { ContractConfig } from '../../lib/types';
import { PageTitle } from '../../components/typography/PageTitle';

declare global {
  interface Window {
    zilPay: any;
  }
}

const tokens = ['ZRC-2', 'ZRC-6'];

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
  const [contractConfig, setContractConfig] = useState<ContractConfig>();

  useEffect(() => {
    const stored_contract = localStorage.getItem('contract-config');

    if (stored_contract) {
      const contract_config = JSON.parse(stored_contract);

      if (contract_config) {
        if (contract_config.contract === 'zrc2') {
          setToken('ZRC-2');
          setContractConfig({
            contract: 'zrc2',
            zrc2Options: contract_config.zrc2Options,
          });
        } else if (contract_config.contract === 'zrc6') {
          setToken('ZRC-6');
          setContractConfig({
            contract: 'zrc6',
            zrc6Options: contract_config.zrc6Options,
          });
        }
      }
    }
  }, []);

  return (
    <div className="flex flex-col justify-center items-center pt-40 px-4 gap-6">
      <PageTitle title="Deploy Page" />
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
      {token === 'ZRC-2' && (
        <ZRC2Form initialConfig={contractConfig?.zrc2Options} />
      )}
      {token === 'ZRC-6' && (
        <ZRC6Form initialConfig={contractConfig?.zrc6Options} />
      )}
    </div>
  );
};

export const DeployPage = () => {
  const [connected, setConnected] = useState<boolean>(
    window.zilPay !== undefined && window.zilPay.wallet !== undefined,
  );

  return (
    <div className="flex flex-col justify-center items-center pt-40 px-4 gap-6">
      {connected ? <Content /> : <ConnectButton setConnected={setConnected} />}
    </div>
  );
};
