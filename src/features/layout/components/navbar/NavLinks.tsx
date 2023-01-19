import React from 'react';
import { NavLink, NavLinkProps } from './NavLink';

export interface NavLinksProps {
  links: Array<NavLinkProps>;
}

export const NavLinks = (props: NavLinksProps) => {
  const { links } = props;

  return (
    <div
      id="nav-links"
      className="flex flex-col bg-brand-green-default p-1 rounded-2xl lg:flex-row"
    >
      {links.map(link => (
        <NavLink
          key={`navlink-${link.label}`}
          label={link.label}
          href={link.href}
        />
      ))}
    </div>
  );
};
