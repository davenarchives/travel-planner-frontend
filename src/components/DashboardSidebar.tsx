
import { 
  Sidebar, 
  SidebarHeader, 
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupContent,
  SidebarFooter
} from '@/components/ui/sidebar';

// Import icons
import { 
  Cloud, 
  Flag, 
  Banknote, 
  Newspaper, 
  Plane,
  LayoutDashboard,
  BookMarked,
  LogOut
} from 'lucide-react';

type Module = 'dashboard' | 'weather' | 'country' | 'currency' | 'news' | 'flight' | 'bookmarks';

interface DashboardSidebarProps {
  activeModule: Module;
  onModuleChange: (module: Module) => void;
  onLogout: () => void;
}

const DashboardSidebar = ({ activeModule, onModuleChange, onLogout }: DashboardSidebarProps) => {
  const modules = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'weather', name: 'Weather', icon: Cloud },
    { id: 'country', name: 'Countries', icon: Flag },
    { id: 'currency', name: 'Currency', icon: Banknote },
    { id: 'news', name: 'News', icon: Newspaper },
    { id: 'flight', name: 'Flights', icon: Plane },
    { id: 'bookmarks', name: 'Bookmarks', icon: BookMarked },
  ];

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span className="text-[hsl(var(--sidebar-primary))]">
            <Plane className="h-6 w-6" />
          </span>
          <span>Travel Planner</span>
        </h2>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroupContent>
          <SidebarMenu>
            {modules.map((module) => (
              <SidebarMenuItem key={module.id}>
                <SidebarMenuButton 
                  className={activeModule === module.id ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}
                  onClick={() => onModuleChange(module.id as Module)}
                >
                  <module.icon className="h-5 w-5" />
                  <span>{module.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <SidebarMenuButton onClick={onLogout}>
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </SidebarMenuButton>
        <div className="text-sm text-sidebar-foreground/70 mt-4">
          Travel Planner v1.0
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
