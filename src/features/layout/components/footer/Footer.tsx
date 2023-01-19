import React from 'react';
import { ContributorLink } from './ContributorLink';

export const Footer = () => {
  return (
    <div className="flex justify-center text-white text-xs mt-24 pb-4 px-4 text-center">
      <div className="px-2 py-1 sm:px-4 sm:py-2 border">
        Made with <span className="text-red-500">❤</span> by{' '}
        <ContributorLink href="https://github.com/xJQx" name="Jing Qiang" /> and{' '}
        <ContributorLink href="https://github.com/ztjhz" name="Jing Hua" />
      </div>
    </div>
  );
};
