import React from 'react';

interface FeatureDescriptionProps {
  imgSrc: string;
  children: React.ReactNode;
}

export const FeatureDescription = (props: FeatureDescriptionProps) => {
  const { imgSrc, children } = props;

  return (
    <div className="flex flex-col lg:flex-row w-full justify-center items-center">
      {/* Image */}
      <img src={imgSrc} alt={imgSrc} className="w-full lg:w-1/2 text-white" />

      {/* Description */}
      <div className="w-full lg:w-1/2 text-white pl-4">{children}</div>
    </div>
  );
};
