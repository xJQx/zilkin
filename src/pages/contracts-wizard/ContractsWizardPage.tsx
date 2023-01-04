import React from 'react';
import { Wizard } from '../../components';
import { PageTitle } from '../../components/typography/PageTitle';

export const ContractsWizardPage = () => {
  return (
    <div className="pt-28 px-6">
      <PageTitle title="CONTRACTS WIZARD" />
      <Wizard />
    </div>
  );
};
