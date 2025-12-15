import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import UserMenuDropdown from 'frontend/components/header/user-menu-dropdown.component';
import { Account, UserMenuDropdownItem } from 'frontend/types';

interface DropdownUserProps {
  account: Account;
  userMenuDropdownItems: UserMenuDropdownItem[];
}

const UserProfileSnippet: React.FC<DropdownUserProps> = ({
  account,
  userMenuDropdownItems,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const trigger = useRef<HTMLAnchorElement>(null);
  const dropdown = useRef<HTMLDivElement>(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = (event: MouseEvent) => {
      const targetNode = event.target as Node;
      if (!dropdown.current || !trigger.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(targetNode) ||
        trigger.current.contains(targetNode)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, [dropdownOpen]);

  // close on ESC
  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if (dropdownOpen && e.key === 'Escape') {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, [dropdownOpen]);

  return (
    <div className="relative">
      <Link
        ref={trigger}
        to="#"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">
            {account.displayName()}
          </span>
          <span className="block text-xs">User</span>
        </span>

        {/* ONLINE USER AVATAR */}
        <span className="size-12 rounded-full overflow-hidden">
          <img
            src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
            alt="User avatar"
            className="h-full w-full object-cover"
          />
        </span>

        {/* ONLINE DROPDOWN ICON */}
        <img
          className="hidden opacity-50 sm:block"
          src="https://cdn-icons-png.flaticon.com/512/271/271210.png"
          alt="dropdown icon"
          width={14}
          height={14}
        />
      </Link>

      <UserMenuDropdown
        dropdownOpen={dropdownOpen}
        dropdownRef={dropdown}
        setDropdownOpen={setDropdownOpen}
        userMenuDropdownItems={userMenuDropdownItems}
      />
    </div>
  );
};

export default UserProfileSnippet;
