import { Outlet } from 'react-router-dom';
import { useApp } from '../../contexts/useApp';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout() {
  const { sidebarOpen } = useApp();

  return (
    <div className="min-h-screen bg-navy-950">
      <Sidebar />
      
      <main 
        className={`transition-all duration-300 min-h-screen ${
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        }`}
      >
        <Header title="Dashboard" />
        <div className="pt-16">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
