import React from 'react';
import { Logo } from './Logo';
import { NavMenu } from './NavMenu';

export const Navbar = () => {
  return (
    <div
      id="nav-container"
      className="fixed flex w-full px-6 py-4 justify-between bg-transparent backdrop-blur"
    >
      <Logo />
      <NavMenu
        links={[
          { label: 'Home', href: '/' },
          { label: 'Contracts', href: '/contracts' },
          { label: 'Deploy', href: '/deploy' },
          {
            label: 'Scilla Docs',
            href: 'https://scilla.readthedocs.io/en/latest/',
          },
        ]}
      />
    </div>
  );
};
