import React, { useEffect, useState } from 'react';
import { generate_zrc6_scilla, ZRC6Options } from 'contracts/zrc6';
import { ContractConfig } from 'lib/types';
import { FeatureCheckbox } from '../FeatureCheckbox';

interface Zrc6ConfigProps {
  setWizardCodeBody: (_value: React.SetStateAction<string>) => void;
}

export const Zrc6Config = (props: Zrc6ConfigProps) => {
  const { setWizardCodeBody } = props;

  const [isPause, setIsPause] = useState(false);
  const [isRoyaltyRecipient, setIsRoyaltyRecipient] = useState(false);
  const [isRoyaltyBPS, setIsRoyaltyBPS] = useState(false);
  const [isSetBaseUrl, setIsSetBaseUrl] = useState(false);
  const [isBatchMint, setIsBatchMint] = useState(false);
  const [isBurn, setIsBurn] = useState(false);
  const [isBatchBurn, setIsBatchBurn] = useState(false);
  const [isBatchTransferFrom, setIsBatchTransferFrom] = useState(false);
  const [isContractOwnershipRecipient, setIsContractOwnershipRecipient] =
    useState(false);

  useEffect(() => {
    // Options
    const options: ZRC6Options = {
      pause: isPause,
      royaltyRecipient: isRoyaltyRecipient,
      royaltyBPS: isRoyaltyBPS,
      setBaseURL: isSetBaseUrl,
      batchMint: isBatchMint,
      burn: isBurn,
      batchBurn: isBatchBurn,
      batchTransferFrom: isBatchTransferFrom,
      contractOwnershipRecipient: isContractOwnershipRecipient,
    };

    const wizardCodeBody = generate_zrc6_scilla(options);
    setWizardCodeBody(wizardCodeBody);

    // Store config in localstorage for deployment
    const contractConfig: ContractConfig = {
      zrc6Options: options,
      zrc2Options: undefined,
    };
    localStorage.setItem('contract-config', JSON.stringify(contractConfig));
  }, [
    isPause,
    isRoyaltyRecipient,
    isRoyaltyBPS,
    isSetBaseUrl,
    isBatchMint,
    isBurn,
    isBatchBurn,
    isBatchTransferFrom,
    isContractOwnershipRecipient,
  ]);

  return (
    <>
      <div id="config-features-section">
        <div id="config-features-title" className="font-bold text-sm pb-4">
          FEATURES
        </div>
        <div id="config-features">
          {/* Pause */}
          <FeatureCheckbox
            label="Pause"
            infoText="Pauses the contract. Use this only if things are going wrong ('circuit breaker')."
            infoHref="https://github.com/Zilliqa/ZRC/blob/main/zrcs/zrc-6.md#1-pause-optional"
            isChecked={isPause}
            setIsChecked={setIsPause}
          />

          {/* RoyaltyRecipient */}
          <FeatureCheckbox
            label="RoyaltyRecipient"
            infoText="Sets 'to' as the royalty recipient."
            infoHref="https://github.com/Zilliqa/ZRC/blob/main/zrcs/zrc-6.md#3-setroyaltyrecipient-optional"
            isChecked={isRoyaltyRecipient}
            setIsChecked={setIsRoyaltyRecipient}
          />

          {/* RoyaltyBPS */}
          <FeatureCheckbox
            label="RoyaltyBPS"
            infoText="Sets 'fee_bps' as royalty fee bps."
            infoHref="https://github.com/Zilliqa/ZRC/blob/main/zrcs/zrc-6.md#4-setroyaltyfeebps-optional"
            isChecked={isRoyaltyBPS}
            setIsChecked={setIsRoyaltyBPS}
          />

          {/* SetBaseUrl */}
          <FeatureCheckbox
            label="SetBaseUrl"
            infoText="Sets 'uri' as the base URI. Use this only if there is a strong reason to change the 'base_uri'."
            infoHref="https://github.com/Zilliqa/ZRC/blob/main/zrcs/zrc-6.md#5-setbaseuri-optional"
            isChecked={isSetBaseUrl}
            setIsChecked={setIsSetBaseUrl}
          />

          {/* BatchMint */}
          <FeatureCheckbox
            label="BatchMint"
            infoText="Mints multiple tokens with 'token_uri's and transfers them to multiple 'to's. Pass empty string to 'token_uri' to use the concatenated token URI. i.e. '<base_uri><token_id>'."
            infoHref="https://github.com/Zilliqa/ZRC/blob/main/zrcs/zrc-6.md#7-batchmint-optional"
            isChecked={isBatchMint}
            setIsChecked={setIsBatchMint}
          />

          {/* Burn */}
          <FeatureCheckbox
            label="Burn"
            infoText="Destroys 'token_id'."
            infoHref="https://github.com/Zilliqa/ZRC/blob/main/zrcs/zrc-6.md#8-burn-optional"
            isChecked={isBurn}
            setIsChecked={setIsBurn}
          />

          {/* BatchBurn */}
          <FeatureCheckbox
            label="BatchBurn"
            infoText="Destroys 'token_id_list'."
            infoHref="https://github.com/Zilliqa/ZRC/blob/main/zrcs/zrc-6.md#9-batchburn-optional"
            isChecked={isBatchBurn}
            setIsChecked={setIsBatchBurn}
          />

          {/* BatchTransferFrom */}
          <FeatureCheckbox
            label="BatchTransferFrom"
            infoText="Transfers multiple 'token_id' to multiple 'to'."
            infoHref="https://github.com/Zilliqa/ZRC/blob/main/zrcs/zrc-6.md#16-batchtransferfrom-optional"
            isChecked={isBatchTransferFrom}
            setIsChecked={setIsBatchTransferFrom}
          />

          {/* ContractOwnershipRecipient */}
          <FeatureCheckbox
            label="ContractOwnershipRecipient"
            infoText="Sets 'to' as the contract ownership recipient. To reset contract ownership recipient, use 'zero_address' i.e., '0x0'."
            infoHref="https://github.com/Zilliqa/ZRC/blob/main/zrcs/zrc-6.md#17-setcontractownershiprecipient-optional"
            isChecked={isContractOwnershipRecipient}
            setIsChecked={setIsContractOwnershipRecipient}
          />
        </div>
      </div>
    </>
  );
};
