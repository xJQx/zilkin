import React from 'react';
import { Logo } from './Logo';
import { NavMenu } from './NavMenu';

export const Navbar = () => {
  const links = [
    { label: 'Wallet', href: '/wallet' },
    { label: 'Portal', href: '/portal' },
    { label: 'Blog', href: '/blog' },
    { label: 'Discord', href: '/discord' },
  ];

  return (
    <div
      id="nav-container"
      className="fixed flex w-full px-6 py-4 justify-between bg-transparent backdrop-blur"
    >
      <Logo />
      <NavMenu links={links} />
    </div>
  );
};
