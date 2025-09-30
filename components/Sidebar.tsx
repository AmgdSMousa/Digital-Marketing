import React from 'react';
import { View, User } from '../types';
import { NAVIGATION_ITEMS, MANAGEMENT_ITEMS, SETTINGS_ITEMS, ICONS, ADMIN_ONLY_VIEWS } from '../constants';

interface NavItemProps {
  name: string;
  // FIX: Changed JSX.Element to React.JSX.Element to fix missing namespace error.
  icon: React.JSX.Element;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ name, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150 ${
      isActive
        ? 'bg-indigo-600 text-white'
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
    }`}
  >
    {React.cloneElement(icon, { className: 'h-5 w-5 mr-3' })}
    <span>{name}</span>
  </button>
);

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  user: User | null;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isOpen, setIsOpen, user, onLogout }) => {
  const handleSetView = (view: View) => {
    setView(view);
    if (window.innerWidth < 768) { // md breakpoint
        setIsOpen(false);
    }
  }

  const isUserAdmin = user?.role === 'Admin';

  const visibleManagementItems = isUserAdmin ? MANAGEMENT_ITEMS : MANAGEMENT_ITEMS.filter(item => !ADMIN_ONLY_VIEWS.includes(item));
  const visibleSettingsItems = isUserAdmin ? SETTINGS_ITEMS : SETTINGS_ITEMS.filter(item => !ADMIN_ONLY_VIEWS.includes(item));


  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 z-20 md:hidden transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      ></div>

      <aside className={`fixed top-0 left-0 w-64 h-full bg-white dark:bg-gray-800 shadow-lg z-30 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:shadow-none flex-shrink-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">GenAI Studio</h2>
            <p className="text-xs text-gray-500">Marketing Assistant</p>
          </div>
          
          <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
            <div>
              <h3 className="px-4 mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                Generation Tools
              </h3>
              <div className="space-y-1">
                {NAVIGATION_ITEMS.map(item => (
                  <NavItem
                    key={item}
                    name={item}
                    icon={ICONS[item]}
                    isActive={currentView === item}
                    onClick={() => handleSetView(item)}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="px-4 mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                Management
              </h3>
              <div className="space-y-1">
                {visibleManagementItems.map(item => (
                  <NavItem
                    key={item}
                    name={item}
                    icon={ICONS[item]}
                    isActive={currentView === item}
                    onClick={() => handleSetView(item)}
                  />
                ))}
              </div>
            </div>
          </nav>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-1">
              {visibleSettingsItems.map(item => (
                  <NavItem
                    key={item}
                    name={item}
                    icon={ICONS[item]}
                    isActive={currentView === item}
                    onClick={() => handleSetView(item)}
                  />
                ))}
              <NavItem
                name="Logout"
                icon={ICONS['Logout']}
                isActive={false}
                onClick={onLogout}
              />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;