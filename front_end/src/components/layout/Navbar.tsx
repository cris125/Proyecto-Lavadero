import { Menu } from 'lucide-react';

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 h-14 lg:h-16 bg-white border-b border-gray-200 flex items-center px-4">
      <button
        onClick={onMenuClick}
        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
      >
        <Menu className="w-5 h-5" />
      </button>
      <div className="flex-1" />
    </header>
  );
}