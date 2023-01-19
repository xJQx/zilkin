import React from 'react';
import { Wizard } from 'features/wizard';
import { PageTitle } from 'components/typography';

export const ContractsWizardPage = () => {
  return (
    <div className="pt-28 px-6">
      <PageTitle title="CONTRACTS WIZARD" />
      <Wizard />
    </div>
  );
};
