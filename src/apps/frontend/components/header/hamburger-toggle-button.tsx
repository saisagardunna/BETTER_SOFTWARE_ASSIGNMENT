import React from 'react';

type HamburgerToggleButtonProps = {
  isActive: boolean;
  onClick: (state: boolean) => void;
};

const HamburgerToggleButton: React.FC<HamburgerToggleButtonProps> = ({
  isActive,
  onClick,
}) => (
  <button
    aria-controls="sidebar"
    onClick={(e) => {
      e.stopPropagation();
      onClick(!isActive);
    }}
    className="block rounded-sm border border-stroke bg-white p-2 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
  >
    {/* ONLINE ICON REPLACEMENT */}
    <img
      src={
        isActive
          ? 'https://cdn-icons-png.flaticon.com/512/1828/1828778.png' // close icon
          : 'https://cdn-icons-png.flaticon.com/512/1828/1828859.png' // hamburger icon
      }
      alt="menu toggle"
      width={22}
      height={22}
    />
  </button>
);

export default HamburgerToggleButton;
