import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Schedule from './pages/Schedule';
import Customers from './pages/Customers';
import { Package } from 'lucide-react';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState('dashboard');

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <Dashboard />;
            case 'schedule':
                return <Schedule />;
            case 'customers':
                return <Customers />;
            case 'inventory':
                return (
                    <div className="h-screen flex flex-col items-center justify-center text-slate-500 p-8">
                        <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-6">
                            <Package className="w-10 h-10 text-slate-400" />
                        </div>
                        <h2 className="text-2xl font-serif text-white mb-2">Inventory Module</h2>
                        <p className="max-w-md text-center">
                            The intelligent consumable tracking system is available in the full enterprise build. 
                            It includes barcode scanning and auto-reorder prediction.
                        </p>
                    </div>
                );
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-gold-500/30">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="flex-1 ml-64 min-h-screen">
                {renderContent()}
            </main>
        </div>
    );
};

export default App;