import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Calendar, AlertCircle, Sparkles, Activity } from 'lucide-react';
import { KPI } from '../types';
import { generateExecutiveInsights } from '../services/geminiService';

const mockKPI: KPI = {
    period: 'Current Month',
    revenue: 124500,
    appointments: 842,
    utilization: 87,
    noShowRate: 4.2
};

const chartData = [
  { name: 'Week 1', revenue: 24000 },
  { name: 'Week 2', revenue: 35000 },
  { name: 'Week 3', revenue: 28000 },
  { name: 'Week 4', revenue: 37500 },
];

const Dashboard: React.FC = () => {
    const [insight, setInsight] = useState<string>('Analyzing business performance...');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        let isMounted = true;
        const fetchInsight = async () => {
            setLoading(true);
            const text = await generateExecutiveInsights(mockKPI);
            if (isMounted) {
                setInsight(text);
                setLoading(false);
            }
        };
        fetchInsight();
        return () => { isMounted = false; };
    }, []);

    const StatCard = ({ title, value, subtext, icon: Icon, trend }: any) => (
        <div className="bg-slate-850 p-6 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Icon className="w-16 h-16 text-white" />
            </div>
            <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-slate-800 rounded-lg text-gold-500">
                    <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
            </div>
            <div className="mt-4">
                <span className="text-3xl font-bold text-white">{value}</span>
                <div className={`flex items-center mt-1 text-sm ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    <TrendingUp className="w-3 h-3 mr-1" />
                    <span>{subtext}</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
            <header className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-serif text-white mb-2">Executive Overview</h2>
                    <p className="text-slate-400">Welcome back, Admin. Here is your salon's pulse.</p>
                </div>
                <div className="text-right">
                    <span className="text-slate-500 text-sm block">Last updated</span>
                    <span className="text-white font-mono">Today, 09:41 AM</span>
                </div>
            </header>

            {/* AI Insight Banner */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 flex items-start space-x-4 shadow-lg">
                <div className="bg-gold-500/10 p-3 rounded-full animate-pulse">
                    <Sparkles className="w-6 h-6 text-gold-500" />
                </div>
                <div className="flex-1">
                    <h3 className="text-gold-500 font-semibold mb-1 flex items-center">
                        Lumina AI Analyst
                        {loading && <span className="ml-2 text-xs text-slate-500 animate-pulse">Thinking...</span>}
                    </h3>
                    <p className="text-slate-300 leading-relaxed font-light">
                        {insight}
                    </p>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Revenue" 
                    value={`$${mockKPI.revenue.toLocaleString()}`} 
                    subtext="+12.5% vs last month" 
                    icon={Activity} 
                    trend="up" 
                />
                <StatCard 
                    title="Appointments" 
                    value={mockKPI.appointments} 
                    subtext="+5% new clients" 
                    icon={Calendar} 
                    trend="up" 
                />
                <StatCard 
                    title="Utilization Rate" 
                    value={`${mockKPI.utilization}%`} 
                    subtext="Peak capacity reached" 
                    icon={Users} 
                    trend="up" 
                />
                <StatCard 
                    title="No-Show Rate" 
                    value={`${mockKPI.noShowRate}%`} 
                    subtext="Above threshold" 
                    icon={AlertCircle} 
                    trend="down" 
                />
            </div>

            {/* Main Content Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart */}
                <div className="lg:col-span-2 bg-slate-850 p-6 rounded-2xl border border-slate-800">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-medium text-white">Revenue Trend</h3>
                        <select className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg p-2">
                            <option>This Month</option>
                            <option>Last Quarter</option>
                        </select>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#EAB308" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#EAB308" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748B" axisLine={false} tickLine={false} />
                                <YAxis stroke="#64748B" axisLine={false} tickLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', color: '#F8FAFC' }}
                                    itemStyle={{ color: '#EAB308' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#EAB308" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Quick Actions / Mini Schedule */}
                <div className="bg-slate-850 p-6 rounded-2xl border border-slate-800 flex flex-col">
                    <h3 className="text-lg font-medium text-white mb-4">Today's Priority</h3>
                    <div className="space-y-4 flex-1 overflow-y-auto">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center space-x-3 p-3 bg-slate-900 rounded-xl border border-slate-800 hover:border-gold-500/50 transition-colors cursor-pointer">
                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold">
                                    {12 + i}:00
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-white">Haircut & Style</h4>
                                    <p className="text-xs text-slate-400">Sarah J. • Stylist: Michael</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="mt-4 w-full py-3 bg-slate-800 text-gold-500 font-medium rounded-xl hover:bg-slate-700 transition-colors">
                        View Full Schedule
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;