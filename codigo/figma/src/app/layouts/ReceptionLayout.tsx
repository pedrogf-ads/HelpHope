import { Outlet, useNavigate, useLocation } from "react-router";
import { Home, Calendar, Users, LogOut, Menu, User as UserIcon, Settings, HelpCircle } from "lucide-react";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../components/ui/dropdown-menu";
import asipecaLogo from "../../imports/Asipeca_logo-4.jpg";

export default function ReceptionLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Início", href: "/reception", icon: Home },
    { name: "Agenda", href: "/reception/schedule", icon: Calendar },
    { name: "Pacientes", href: "/reception/patients", icon: Users },
  ];

  const handleLogout = () => {
    navigate("/");
  };

  const isActive = (path: string) => {
    if (path === "/reception") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex min-h-screen">
        <div className="w-64 bg-gradient-to-b from-emerald-600 to-green-600 text-white flex flex-col shadow-xl">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white p-2 rounded-xl">
                <img src={asipecaLogo} alt="ASIPECA" className="h-10 w-auto" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="font-bold text-lg">Recepção</div>
                <div className="text-sm text-green-100">Agendamentos</div>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.href)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    active
                      ? "bg-white text-emerald-600 shadow-lg"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-4 space-y-2 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-200 hover:bg-red-500/20 rounded-xl transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sair</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen pb-20">
        <Outlet />

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-around px-2 py-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <button
                    key={item.href}
                    onClick={() => navigate(item.href)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                      active
                        ? "text-emerald-600 bg-emerald-50"
                        : "text-gray-500"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-xs">{item.name}</span>
                  </button>
                );
              })}

              {/* Menu Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex flex-col items-center gap-1 p-2 rounded-xl text-gray-500">
                    <Menu className="w-6 h-6" />
                    <span className="text-xs">Menu</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mb-2">
                  <DropdownMenuItem className="cursor-pointer">
                    <UserIcon className="w-4 h-4 mr-2" />
                    Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" />
                    Configurações
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Ajuda
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
