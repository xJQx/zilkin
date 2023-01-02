import React from 'react';

export const Wizard = () => {
  return (
    <div className="flex justify-center items-center pt-40 px-4">
      <div
        id="wizard-container"
        className="container flex flex-col gap-4 p-4 bg-slate-200 rounded-lg"
        style={{ minHeight: '52rem' }}
      >
        <div id="wizard-header" className="flex flex-row justify-between">
          <div id="wizard-contracts-type" className="flex gap-2">
            <button>ZRC2</button>
            <button>ZRC6</button>
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
