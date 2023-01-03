import React from 'react';
import { ContractType } from '../../lib/types';

interface ContractButtonProps {
  label: string;
  contract: ContractType;
  selectedContract: ContractType;
  setSelectedContract: (_value: React.SetStateAction<ContractType>) => void;
}

export const ContractButton = (props: ContractButtonProps) => {
  const { label, contract, selectedContract, setSelectedContract } = props;

  return (
    <button
      id="contract-button"
      className={`px-4 py-3 rounded-lg ${
        selectedContract === contract
          ? 'bg-brand-blue-dark text-white'
          : 'hover:bg-slate-300'
      }`}
      onClick={() => setSelectedContract(contract)}
    >
      {label}
    </button>
  );
};
