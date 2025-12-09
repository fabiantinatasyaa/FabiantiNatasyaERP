import React, { useState } from 'react';
import { Search, MoreHorizontal, Mail, Phone, ShoppingBag, Sparkles, Users } from 'lucide-react';
import { Customer } from '../types';
import { recommendNextService } from '../services/geminiService';

const mockCustomers: Customer[] = [
    {
        id: '1', name: 'Eleanor Pena', email: 'eleanor@example.com', phone: '+1 (555) 0123',
        lastVisit: '2023-10-15', loyaltyPoints: 450, totalSpend: 1200,
        preferences: ['Organic Products', 'Quiet Appointment', 'Tea'],
        history: [{ date: '2023-09-01', serviceId: 'Cut', price: 80 }, { date: '2023-10-15', serviceId: 'Color', price: 150 }]
    },
    {
        id: '2', name: 'Ralph Edwards', email: 'ralph@example.com', phone: '+1 (555) 4567',
        lastVisit: '2023-09-20', loyaltyPoints: 120, totalSpend: 350,
        preferences: ['Quick Service', 'Espresso'],
        history: [{ date: '2023-09-20', serviceId: 'Men Cut', price: 50 }]
    }
];

const Customers: React.FC = () => {
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [recommendation, setRecommendation] = useState<{service: string, reason: string} | null>(null);
    const [loadingRec, setLoadingRec] = useState(false);

    const handleSelectCustomer = async (c: Customer) => {
        setSelectedCustomer(c);
        setRecommendation(null);
        setLoadingRec(true);
        // Simulate API call
        const rec = await recommendNextService(c);
        setRecommendation(rec);
        setLoadingRec(false);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto h-screen flex flex-col">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-serif text-white">Clientèle</h2>
                    <p className="text-slate-400">Manage relationships and preferences.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                    <input 
                        type="text" 
                        placeholder="Search clients..." 
                        className="pl-10 pr-4 py-3 bg-slate-850 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-gold-500 w-64 transition-colors"
                    />
                </div>
            </header>

            <div className="flex gap-8 flex-1 overflow-hidden">
                {/* List */}
                <div className="w-1/3 bg-slate-850 border border-slate-800 rounded-2xl overflow-y-auto">
                    {mockCustomers.map(customer => (
                        <div 
                            key={customer.id} 
                            onClick={() => handleSelectCustomer(customer)}
                            className={`p-4 border-b border-slate-800 cursor-pointer hover:bg-slate-800 transition-colors ${selectedCustomer?.id === customer.id ? 'bg-slate-800 border-l-4 border-l-gold-500' : ''}`}
                        >
                            <div className="flex justify-between items-start">
                                <h3 className="text-white font-medium">{customer.name}</h3>
                                <span className="text-xs text-slate-500">{customer.lastVisit}</span>
                            </div>
                            <p className="text-slate-400 text-sm truncate">{customer.email}</p>
                            <div className="mt-2 flex space-x-2">
                                <span className="text-xs px-2 py-1 bg-slate-900 rounded text-gold-500">{customer.loyaltyPoints} pts</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Detail View */}
                <div className="flex-1 bg-slate-850 border border-slate-800 rounded-2xl p-8 overflow-y-auto">
                    {selectedCustomer ? (
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-600 rounded-full flex items-center justify-center text-2xl text-white font-serif">
                                        {selectedCustomer.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-serif text-white">{selectedCustomer.name}</h2>
                                        <div className="flex space-x-4 text-slate-400 text-sm mt-1">
                                            <span className="flex items-center"><Mail className="w-3 h-3 mr-1" /> {selectedCustomer.email}</span>
                                            <span className="flex items-center"><Phone className="w-3 h-3 mr-1" /> {selectedCustomer.phone}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button className="p-2 border border-slate-700 rounded-lg text-slate-400 hover:text-white hover:border-slate-500 transition-colors">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                                    <div className="text-slate-500 text-xs mb-1">LIFETIME SPEND</div>
                                    <div className="text-xl font-medium text-white">${selectedCustomer.totalSpend}</div>
                                </div>
                                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                                    <div className="text-slate-500 text-xs mb-1">LOYALTY TIER</div>
                                    <div className="text-xl font-medium text-gold-500">Gold Member</div>
                                </div>
                                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                                    <div className="text-slate-500 text-xs mb-1">LAST SERVICE</div>
                                    <div className="text-xl font-medium text-white">Full Color</div>
                                </div>
                            </div>

                            {/* AI Recommendation Card */}
                            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-gold-500/20 p-6">
                                <div className="absolute top-0 right-0 p-4 opacity-5">
                                    <Sparkles className="w-32 h-32 text-gold-500" />
                                </div>
                                <h3 className="text-gold-500 font-medium mb-4 flex items-center">
                                    <Sparkles className="w-4 h-4 mr-2" /> 
                                    Smart Recommendation
                                </h3>
                                
                                {loadingRec ? (
                                    <div className="flex items-center space-x-3 text-slate-400 animate-pulse">
                                        <div className="w-4 h-4 bg-gold-500 rounded-full"></div>
                                        <span>Analyzing purchase history...</span>
                                    </div>
                                ) : recommendation ? (
                                    <div className="animate-fade-in">
                                        <p className="text-xl text-white font-serif mb-2">
                                            Suggested: <span className="text-gold-400">{recommendation.service}</span>
                                        </p>
                                        <p className="text-slate-400 text-sm leading-relaxed max-w-lg">
                                            {recommendation.reason}
                                        </p>
                                        <button className="mt-4 px-4 py-2 bg-gold-500 text-slate-900 text-sm font-semibold rounded-lg hover:bg-gold-400">
                                            Book This Service
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-slate-500">Select a customer to generate insights.</p>
                                )}
                            </div>

                            <div>
                                <h3 className="text-white font-medium mb-4">Visit History</h3>
                                <div className="space-y-3">
                                    {selectedCustomer.history.map((visit, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-slate-900 rounded-xl border border-slate-800">
                                            <div className="flex items-center space-x-4">
                                                <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
                                                    <ShoppingBag className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="text-white text-sm font-medium">{visit.serviceId}</div>
                                                    <div className="text-slate-500 text-xs">{visit.date}</div>
                                                </div>
                                            </div>
                                            <div className="text-white font-medium">${visit.price}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500">
                            <Users className="w-16 h-16 mb-4 opacity-20" />
                            <p>Select a client to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Customers;