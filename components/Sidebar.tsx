import React from 'react';
import { LayoutDashboard, Calendar, Users, Package, Settings, Sparkles, LogOut } from 'lucide-react';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'schedule', label: 'Schedule', icon: Calendar },
        { id: 'customers', label: 'Customers', icon: Users },
        { id: 'inventory', label: 'Inventory', icon: Package },
    ];

    return (
        <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 z-10 shadow-2xl">
            <div className="p-8 flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-slate-900" />
                </div>
                <h1 className="text-2xl font-serif font-bold text-white tracking-wide">LUMINA</h1>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                                isActive 
                                    ? 'bg-gold-500 text-slate-900 font-semibold shadow-[0_0_20px_rgba(234,179,8,0.3)]' 
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'text-slate-900' : 'text-slate-500 group-hover:text-gold-400'}`} />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800 space-y-2">
                 <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                    <Settings className="w-5 h-5 text-slate-500" />
                    <span>Settings</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-900/10 transition-colors">
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;