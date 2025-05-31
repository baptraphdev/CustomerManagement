import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, X } from 'lucide-react';

interface SidebarProps {
  mobile?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ mobile, onClose }: SidebarProps) => {
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Customers', href: '/customers', icon: Users },
  ];

  return (
    <div className="flex flex-col h-full bg-indigo-700">
      <div className="flex items-center justify-between flex-shrink-0 px-4 py-4">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-white">CustomerApp</h1>
        </div>
        {mobile && onClose && (
          <button
            type="button"
            className="inline-flex items-center justify-center p-2 text-indigo-200 rounded-md hover:text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-white"
            onClick={onClose}
          >
            <span className="sr-only">Close sidebar</span>
            <X className="w-6 h-6" aria-hidden="true" />
          </button>
        )}
      </div>
      <div className="flex flex-col flex-grow mt-5">
        <nav className="flex-1 px-2 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-indigo-800 text-white'
                    : 'text-indigo-100 hover:bg-indigo-600 hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5 mr-3 text-indigo-300" aria-hidden="true" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;