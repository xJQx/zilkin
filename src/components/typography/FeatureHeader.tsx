import React from 'react';

interface FeatureHeaderProps {
  numbering: string;
  title: string;
}

export const FeatureHeader = (props: FeatureHeaderProps) => {
  const { numbering, title } = props;

  return (
    <div className="mt-24 mb-8 text-4xl font-bold">
      <span className="text-brand-green-default">{numbering}.&nbsp;</span>
      <span className="text-white">{title}</span>
    </div>
  );
};
