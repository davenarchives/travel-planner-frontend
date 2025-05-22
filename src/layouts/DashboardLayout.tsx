
import { Outlet } from 'react-router-dom';
import DashboardSidebar from '@/components/DashboardSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const DashboardLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleModuleChange = (module: 'dashboard' | 'weather' | 'country' | 'currency' | 'news' | 'flight' | 'bookmarks') => {
    const path = module === 'dashboard' ? '/' : `/${module}`;
    navigate(path);
  };

  return (
    <div className="flex h-screen">
      <DashboardSidebar 
        activeModule={window.location.pathname === '/' ? 'dashboard' : window.location.pathname.slice(1) as any}
        onModuleChange={handleModuleChange}
        onLogout={logout}
      />
      <main className="flex-1 overflow-auto p-6 ml-[240px]">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
