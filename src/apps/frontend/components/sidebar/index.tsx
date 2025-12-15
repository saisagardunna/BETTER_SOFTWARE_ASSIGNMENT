import React, { useRef } from 'react';

import SidebarMenuItem from 'frontend/components/sidebar/sidebar-menu-item';
import routes from 'frontend/constants/routes';

type SidebarProps = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  const trigger = useRef<HTMLButtonElement | null>(null);
  const sidebar = useRef<HTMLElement | null>(null);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
    >
      {/* SIDEBAR HEADER (TEXT LOGO) */}
      <div className="flex items-center justify-between px-6 py-5.5 lg:py-6.5">
        <span className="text-lg font-bold text-white">
          MyApp
        </span>

        <button
          ref={trigger}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={isSidebarOpen}
          className="block text-white lg:hidden"
        >
          ✕
        </button>
      </div>

      {/* SIDEBAR MENU */}
      <div className="flex flex-col overflow-y-auto">
        <nav className="p-2 lg:px-6">
          <h3 className="mb-3 ml-4 mt-4 text-xs font-semibold text-bodydark2">
            MENU
          </h3>

          <ul className="flex flex-col gap-1.5">
            <SidebarMenuItem
              title="Dashboard"
              path={routes.DASHBOARD}
              setIsSidebarOpen={setIsSidebarOpen}
            />

            <SidebarMenuItem
              title="Tasks"
              path={routes.TASKS}
              setIsSidebarOpen={setIsSidebarOpen}
            />
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
