import React from 'react';

export interface DeployInit {
  vname: string;
  type: string;
  value: string | number | string[];
}

export const DeployButton = ({
  init,
  scillaCode,
}: {
  init?: DeployInit[];
  scillaCode?: string;
}) => {
  const deploy = async () => {
    if (window.zilPay !== undefined) {
      const contract = window.zilPay.contracts.new(scillaCode, init);
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [tx, _] = await contract.deploy({
          gasLimit: '25000',
          gasPrice: '1000000000',
        });
        window.open(
          `https://viewblock.io/zilliqa/tx/0x${tx.ID}?network=${window.zilPay.wallet.net}`,
        );
      } catch (e: unknown) {
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
