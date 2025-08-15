import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  Box, 
  ClipboardList, 
  Truck, 
  ChartBar, 
  LogOut,
  Package
} from "lucide-react";

const navItems = [
  {
    href: "/dashboard",
    icon: BarChart3,
    label: "Dashboard",
    testId: "nav-dashboard"
  },
  {
    href: "/products", 
    icon: Box,
    label: "Productos",
    testId: "nav-products"
  },
  {
    href: "/inventory",
    icon: ClipboardList,
    label: "Inventario", 
    testId: "nav-inventory"
  },
  {
    href: "/movements",
    icon: Truck,
    label: "Movimientos",
    testId: "nav-movements"
  },
  {
    href: "/reports",
    icon: ChartBar,
    label: "Reportes",
    testId: "nav-reports"
  }
];

export default function Sidebar() {
  const [location, setLocation] = useLocation();

  const handleLogout = () => {
    setLocation("/login");
  };

  return (
    <div className="w-16 bg-sidebar flex flex-col items-center py-4 space-y-4">
      {/* Logo/Brand */}
      <div className="text-white text-xs font-semibold text-center">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-1">
          <Package className="text-sidebar text-lg" />
        </div>
      </div>
      
      {/* Navigation Icons */}
      <nav className="flex flex-col space-y-3">
        {navItems.map((item) => {
          const isActive = location === item.href || (item.href === "/dashboard" && location === "/");
          const Icon = item.icon;
          
          return (
            <Link key={item.href} href={item.href}>
              <button 
                data-testid={item.testId}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-sidebar-primary transition-colors",
                  isActive ? "bg-sidebar-primary" : "bg-white/20"
                )}
              >
                <Icon className="w-4 h-4" />
              </button>
            </Link>
          );
        })}
      </nav>
      
      {/* Bottom Navigation */}
      <div className="flex-grow"></div>
      <button 
        data-testid="button-logout"
        onClick={handleLogout}
        className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-sidebar-primary transition-colors"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  );
}
