import React, { useState } from 'react';
import { ContractType } from '../../lib/types';
import { ContractButton } from './ContractButton';
import { FaCopy } from 'react-icons/fa';
import { Zrc2Config, Zrc6Config } from './config';

export const Wizard = () => {
  const [selectedContract, setSelectedContract] =
    useState<ContractType>('zrc2');
  const [wizardCodeBody, setWizardCodeBody] = useState('');

  // Copy code to clipboard
  const copyToClipboard = () => {
    console.log('copied to clipboard!');
  };

  return (
    <div className="flex justify-center items-center pt-40 px-6">
      <div
        id="wizard-container"
        className="container flex flex-col p-4 min-h-[42rem] max-w-[1200px] bg-slate-200 rounded-lg overflow-x-auto"
      >
        <div
          id="wizard-header"
          className="flex flex-row justify-between gap-2 items-center font-bold overflow-x-auto pb-4 min-w-[24rem]"
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
        <div
          id="wizard-body"
          className="flex flex-row gap-4 grow min-w-[24rem]"
        >
          <div
            id="wizard-configuration"
            className="min-w-64 bg-slate-50 rounded-lg p-4 shadow"
          >
            {selectedContract === 'zrc2' && (
              <Zrc2Config setWizardCodeBody={setWizardCodeBody} />
            )}
            {selectedContract === 'zrc6' && (
              <Zrc6Config setWizardCodeBody={setWizardCodeBody} />
            )}
          </div>
          <div
            id="wizard-code"
            className="w-full max-h-[42rem] bg-gray-800 rounded-lg shadow text-white overflow-auto p-4"
          >
            <pre>{wizardCodeBody}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
