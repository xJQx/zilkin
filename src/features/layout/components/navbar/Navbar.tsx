import React from 'react';
import { Logo } from './Logo';
import { NavMenu } from './NavMenu';

export const Navbar = () => {
  return (
    <div
      id="nav-container"
      className="fixed z-50 flex w-full px-6 py-4 justify-between bg-transparent backdrop-blur"
    >
      <Logo />
      <NavMenu
        links={[
          { label: 'Home', href: '/' },
          { label: 'Wizard', href: '/contracts-wizard' },
          { label: 'Deploy', href: '/deploy' },
          { label: 'Docs', href: '/docs' },
        ]}
      />
    </div>
  );
};
