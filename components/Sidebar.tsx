import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Home, FileText, LogOut, Flame } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const mainLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'All Notes', href: '/dashboard/notes', icon: FileText },
  ];

  return (
    <div className="w-64 h-screen bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 flex flex-col">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white">
            <Flame size={18} fill="#fff" />
          </div>
          Ember
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-6 mt-4">
        <div>
          <ul className="space-y-1">
            {mainLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/dashboard');
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-orange-500/10 text-orange-500 dark:bg-orange-500/20'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon size={18} className={isActive ? 'text-orange-500' : ''} />
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-1">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}
