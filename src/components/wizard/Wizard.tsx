import React, { useEffect, useState } from 'react';
import { ContractType } from '../../lib/types';
import { ContractButton } from './ContractButton';

export const Wizard = () => {
  const [selectedContract, setSelectedContract] =
    useState<ContractType>('zrc2');

  useEffect(() => {
    console.log(selectedContract);
  }, [selectedContract]);

  return (
    <div className="flex justify-center items-center pt-40 px-6">
      <div
        id="wizard-container"
        className="container flex flex-col gap-4 p-4 min-h-[52rem] max-w-[1200px] bg-slate-200 rounded-lg"
      >
        <div
          id="wizard-header"
          className="flex flex-row justify-between items-center font-bold"
        >
          <div id="wizard-contracts-type" className="flex gap-2">
            <ContractButton
              label="ZRC2"
              contract="zrc2"
              selectedContract={selectedContract}
              setSelectedContract={setSelectedContract}
            />
            <ContractButton
              label="ZRC6"
              contract="zrc6"
              selectedContract={selectedContract}
              setSelectedContract={setSelectedContract}
            />
          </div>
          <div id="wizard-action-buttons">
            <button>Copy to Clipboard</button>
          </div>
        </div>
        <div id="wizard-body" className="flex flex-row gap-4 grow">
          <div
            id="wizard-configuration"
            className="w-64 bg-slate-50 rounded-lg p-4 shadow"
          >
            <div>Options</div>
            <div>Features</div>
            <div>Access Control</div>
            <div>Info</div>
          </div>
          <div
            id="wizard-code"
            className="w-full bg-gray-800 rounded-lg shadow"
          ></div>
        </div>
      </div>
    </div>
  );
};
