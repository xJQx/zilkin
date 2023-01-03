import React, { useEffect, useState } from 'react';
import { ContractType } from '../../lib/types';
import { ContractButton } from './ContractButton';
import { FaCopy } from 'react-icons/fa';

export const Wizard = () => {
  const [selectedContract, setSelectedContract] =
    useState<ContractType>('zrc2');

  // When user change the scilla contract that they want
  useEffect(() => {
    console.log(selectedContract);
  }, [selectedContract]);

  // Copy code to clipboard
  const copyToClipboard = () => {
    console.log('copied to clipboard!');
  };

  return (
    <div className="flex justify-center items-center pt-40 px-6">
      <div
        id="wizard-container"
        className="container flex flex-col p-4 min-h-[52rem] max-w-[1200px] bg-slate-200 rounded-lg"
      >
        <div
          id="wizard-header"
          className="flex flex-row justify-between gap-2 items-center font-bold overflow-x-auto pb-4"
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
            <button
              className="flex items-center border border-brand-blue-dark rounded-lg px-4 py-3 hover:bg-brand-blue-dark hover:text-white"
              onClick={copyToClipboard}
            >
              <FaCopy className="mr-0 sm:mr-2 w-5 h-5" />
              <span className="hidden sm:block">Copy to Clipboard</span>
            </button>
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
