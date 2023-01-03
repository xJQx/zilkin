import React, { useEffect, useState } from 'react';
import generate_zrc2_scilla, {
  MintArgs,
  OperatorArgs,
} from '../../../../contracts/zrc2/zrc2';
import { FeatureCheckbox } from '../FeatureCheckbox';

interface Zrc2ConfigProps {
  setWizardCodeBody: (_value: React.SetStateAction<string>) => void;
}

export const Zrc2Config = (props: Zrc2ConfigProps) => {
  const { setWizardCodeBody } = props;

  // Mint
  const [isMintable, setIsMintable] = useState(false);
  const [isBurnable, setIsBurnable] = useState(false);

  // Operator
  const [isOperatorFor, setIsOperatorFor] = useState(false);
  const [isAuthorizeOperator, setIsAuthorizeOperator] = useState(false);
  const [isRevokeOperator, setIsRevokeOperator] = useState(false);
  const [isOperatorSend, setIsOperatorSend] = useState(false);

  useEffect(() => {
    // Mint
    const mintArgs: MintArgs = {
      isMint: isMintable || isBurnable,
      mint: isMintable,
      burn: isBurnable,
    };

    // Operator
    const operatorArgs: OperatorArgs = {
      isOperator:
        isOperatorFor ||
        isAuthorizeOperator ||
        isRevokeOperator ||
        isOperatorSend,
      isOperatorFor: isOperatorFor,
      authorizeOperator: isAuthorizeOperator,
      revokeOperator: isRevokeOperator,
      operatorSend: isOperatorSend,
    };

    const wizardCodeBody = generate_zrc2_scilla(operatorArgs, mintArgs);
    setWizardCodeBody(wizardCodeBody);
  }, [
    isMintable,
    isBurnable,
    isOperatorFor,
    isAuthorizeOperator,
    isRevokeOperator,
    isOperatorSend,
  ]);

  return (
    <>
      <div id="config-features-section">
        <div id="config-features-title" className="font-bold text-sm pb-4">
          FEATURES
        </div>
        <div id="config-features">
          {/* Mint */}
          <FeatureCheckbox
            label="Mintable"
            infoText="Mint new tokens. Only contract_owner can mint."
            infoHref="https://github.com/Zilliqa/ZRC/blob/main/zrcs/zrc-2.md#1-mint-optional"
            isChecked={isMintable}
            setIsChecked={setIsMintable}
          />

          {/* Burn */}
          <FeatureCheckbox
            label="Burnable"
            infoText="Burn existing tokens. Only contract_owner can burn."
            infoHref="https://github.com/Zilliqa/ZRC/blob/main/zrcs/zrc-2.md#2-burn-optional"
            isChecked={isBurnable}
            setIsChecked={setIsBurnable}
          />

          {/* IsOperatorFor */}
          <FeatureCheckbox
            label="IsOperatorFor"
            infoText="Check if an address is an operator or default operator of a token_owner. Throw if not."
            infoHref="https://github.com/Zilliqa/ZRC/blob/main/zrcs/zrc-2.md#1-isoperatorfor-optional"
            isChecked={isOperatorFor}
            setIsChecked={setIsOperatorFor}
          />

          {/* AuthorizeOperator */}
          <FeatureCheckbox
            label="AuthorizeOperator"
            infoText="Make an address an operator of the caller."
            infoHref="https://github.com/Zilliqa/ZRC/blob/main/zrcs/zrc-2.md#3-authorizeoperator-optional"
            isChecked={isAuthorizeOperator}
            setIsChecked={setIsAuthorizeOperator}
          />

          {/* RevokeOperator */}
          <FeatureCheckbox
            label="RevokeOperator"
            infoText="Revoke an address from being an operator or default_operator of the caller."
            infoHref="https://github.com/Zilliqa/ZRC/blob/main/zrcs/zrc-2.md#4-revokeoperator-optional"
            isChecked={isRevokeOperator}
            setIsChecked={setIsRevokeOperator}
          />

          {/* OperatorSend */}
          <FeatureCheckbox
            label="OperatorSend"
            infoText="Moves amount tokens from token_owner to recipient. _sender must be an operator of token_owner. Balance of recipient will increase. Balance of token_owner will decrease."
            infoHref="https://github.com/Zilliqa/ZRC/blob/main/zrcs/zrc-2.md#9-operatorsend-optional"
            isChecked={isOperatorSend}
            setIsChecked={setIsOperatorSend}
          />
        </div>
      </div>
    </>
  );
};
