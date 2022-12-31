import React from 'react';

export interface NavLinkProps {
  label: string;
  href: string;
}

export const NavLink = (props: NavLinkProps) => {
  const { label, href } = props;

  return (
    <a
      href={href}
      className="px-3 py-2 rounded-2xl text-lg text-center hover:text-white hover:bg-brand-blue-dark w-52 lg:w-auto"
    >
      {label}
    </a>
  );
};
