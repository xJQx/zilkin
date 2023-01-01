import React from 'react';

interface ContributorLinkProps {
  href: string;
  name: string;
}

export const ContributorLink = (props: ContributorLinkProps) => {
  const { href, name } = props;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-brand-green-default font-bold cursor-pointer underline hover:text-sm duration-200"
    >
      {name}
    </a>
  );
};
