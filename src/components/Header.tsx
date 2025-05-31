import { Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 sm:px-6">
      <button
        type="button"
        className="inline-flex items-center justify-center p-2 text-gray-500 rounded-md md:hidden hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="w-6 h-6" aria-hidden="true" />
      </button>
      
      <div className="flex justify-between flex-1 px-4 sm:px-6">
        <div className="flex flex-1">
          <h2 className="text-2xl font-semibold text-gray-800">Customer Management</h2>
        </div>
      </div>
    </header>
  );
};

export default Header;