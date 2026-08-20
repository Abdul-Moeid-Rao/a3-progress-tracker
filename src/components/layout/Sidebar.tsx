import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  Play, 
  History, 
  TrendingUp, 
  Scale, 
  Settings,
  LogOut,
  Dumbbell
} from 'lucide-react';
import { useApp } from '../../contexts/useApp';

const menuItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/dashboard/exercises', icon: BookOpen, label: 'Exercise Library' },
  { path: '/dashboard/planner', icon: Calendar, label: 'Workout Planner' },
  { path: '/dashboard/session', icon: Play, label: 'Active Session' },
  { path: '/dashboard/history', icon: History, label: 'Workout History' },
  { path: '/dashboard/progress', icon: TrendingUp, label: 'Progress Tracker' },
  { path: '/dashboard/measurements', icon: Scale, label: 'Body Measurements' },
  { path: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { sidebarOpen, setSidebarOpen, setCurrentPage, currentUser, logoutUser } = useApp();

  const handleNavClick = (label: string) => {
    setCurrentPage(label.toLowerCase().replace(/\s+/g, '-'));
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {!sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        />
      )}
      
      <aside 
        className={`fixed top-0 left-0 z-50 h-full bg-navy-900 border-r border-navy-700 transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20 xl:w-64'}`}
        style={{ width: sidebarOpen ? '16rem' : undefined }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-navy-700">
          <div className="flex items-center justify-center w-10 h-10 bg-cyan-500 rounded-lg">
            <Dumbbell className="w-6 h-6 text-navy-950" />
          </div>
          {sidebarOpen && (
            <div>
              <h1 className="font-space font-bold text-lg text-white">FitForge</h1>
              <p className="text-xs text-cyan-400">Progress Tracker</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => handleNavClick(item.label)}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
                ${isActive 
                  ? 'bg-cyan-500/10 text-cyan-400 border-l-2 border-cyan-500' 
                  : 'text-gray-400 hover:text-cyan-400 hover:bg-navy-800/50'
                }
              `}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && (
                <span className="font-medium text-sm">{item.label}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-navy-700">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center">
                <span className="font-space font-bold text-white">
                  {currentUser.name.charAt(0)}
                </span>
              </div>
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-white truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {currentUser.email}
                  </p>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <NavLink
              to="/login"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-semibold rounded-lg transition-colors"
            >
              <span>Sign In</span>
            </NavLink>
          )}
        </div>
      </aside>

      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-40 lg:hidden p-2 bg-navy-900 border border-navy-700 rounded-lg text-gray-400 hover:text-white"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </>
  );
}
