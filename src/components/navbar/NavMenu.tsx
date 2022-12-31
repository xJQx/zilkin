import React, { useState } from 'react';
import { NavLinks, NavLinksProps } from './NavLinks';
import { FaEllipsisH } from 'react-icons/fa';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface NavMenuProps extends NavLinksProps {}

export const NavMenu = (props: NavMenuProps) => {
  const { links } = props;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex flex-col items-center">
      {/* Menu Icon */}
      <button
        id="nav-menu-icon"
        className={`block bg-brand-green-default p-3 rounded-3xl cursor-pointer lg:hidden ${
          isMenuOpen && 'bg-brand-blue-dark'
        }`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <FaEllipsisH className="w-5 h-5" />
      </button>

      {/* Menu Items */}
      <div
        id="mav-menu-items"
        className={`${
          isMenuOpen ? 'block absolute top-16 right-6' : 'hidden'
        } lg:relative lg:top-0 lg:right-0 lg:block`}
      >
        <NavLinks links={links} />
      </div>
    </div>
  );
};
