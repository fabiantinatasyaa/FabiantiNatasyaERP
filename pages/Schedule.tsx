import React, { useState } from 'react';
import { Clock, Plus, Filter, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Appointment } from '../types';
import { analyzeScheduleRisk } from '../services/geminiService';

// Mock Appointments
const initialAppointments: Appointment[] = [
    { id: '1', customerId: 'c1', staffId: 's1', serviceId: 'srv1', startTime: '2023-10-27T09:00:00', status: 'Scheduled' },
    { id: '2', customerId: 'c2', staffId: 's2', serviceId: 'srv2', startTime: '2023-10-27T10:30:00', status: 'Scheduled' },
    { id: '3', customerId: 'c3', staffId: 's1', serviceId: 'srv3', startTime: '2023-10-27T14:00:00', status: 'Scheduled' },
    { id: '4', customerId: 'c4', staffId: 's3', serviceId: 'srv1', startTime: '2023-10-27T16:00:00', status: 'Scheduled' },
];

const Schedule: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
    const [analyzing, setAnalyzing] = useState(false);

    const handleOptimize = async () => {
        setAnalyzing(true);
        const riskyIds = await analyzeScheduleRisk(appointments);
        
        const updated = appointments.map(appt => ({
            ...appt,
            predictedRisk: riskyIds.includes(appt.id) ? 'High' : 'Low'
        })) as Appointment[];
        
        setAppointments(updated);
        setAnalyzing(false);
    };

    const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
    const staffMembers = ['Michael', 'Jessica', 'David'];

    return (
        <div className="p-8 max-w-7xl mx-auto h-screen flex flex-col">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-serif text-white">Schedule Management</h2>
                    <p className="text-slate-400">Manage appointments and staff allocation.</p>
                </div>
                <div className="flex space-x-3">
                    <button 
                        onClick={handleOptimize}
                        disabled={analyzing}
                        className="flex items-center space-x-2 px-5 py-2.5 bg-slate-800 text-gold-400 border border-gold-500/30 rounded-xl hover:bg-slate-700 transition-all disabled:opacity-50"
                    >
                        {analyzing ? <span className="animate-spin mr-2">⟳</span> : <AlertTriangle className="w-4 h-4" />}
                        <span>{analyzing ? 'AI Analyzing...' : 'Predict Risks'}</span>
                    </button>
                    <button className="flex items-center space-x-2 px-5 py-2.5 bg-gold-500 text-slate-900 font-semibold rounded-xl hover:bg-gold-400 transition-colors">
                        <Plus className="w-5 h-5" />
                        <span>New Booking</span>
                    </button>
                </div>
            </header>

            <div className="flex-1 bg-slate-850 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
                {/* Toolbar */}
                <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                    <div className="flex items-center space-x-4">
                        <div className="text-white font-medium">Oct 27, 2023</div>
                        <div className="h-6 w-px bg-slate-700"></div>
                        <button className="text-slate-400 hover:text-white flex items-center space-x-1 text-sm">
                            <Filter className="w-4 h-4" />
                            <span>Filter Staff</span>
                        </button>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="flex-1 overflow-auto p-4">
                    <div className="grid grid-cols-[100px_1fr_1fr_1fr] gap-4">
                        {/* Header Row */}
                        <div className="text-slate-500 font-medium text-sm">Time</div>
                        {staffMembers.map(staff => (
                            <div key={staff} className="text-slate-300 font-medium pb-2 border-b border-slate-800">
                                {staff}
                            </div>
                        ))}

                        {/* Slots */}
                        {timeSlots.map(time => (
                            <React.Fragment key={time}>
                                <div className="text-slate-500 text-sm py-4 border-t border-slate-800/50 flex items-start pt-6">
                                    {time}
                                </div>
                                {staffMembers.map((staff, index) => {
                                    // Extremely simplified matching logic for demo
                                    const appt = appointments.find(a => a.startTime.includes(`T${time}`) && (index === parseInt(a.staffId.replace('s','')) - 1));
                                    
                                    return (
                                        <div key={`${time}-${staff}`} className="border-t border-slate-800/50 py-2 relative min-h-[100px]">
                                            {appt ? (
                                                <div className={`p-3 rounded-xl border ${
                                                    appt.predictedRisk === 'High' 
                                                        ? 'bg-red-500/10 border-red-500/50' 
                                                        : 'bg-slate-800 border-slate-700 hover:border-gold-500/50'
                                                } transition-all cursor-pointer group`}>
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className="text-white font-medium text-sm">Customer {appt.customerId}</span>
                                                        {appt.predictedRisk === 'High' && (
                                                            <div className="text-red-400 text-xs flex items-center bg-red-950 px-1.5 py-0.5 rounded">
                                                                <AlertTriangle className="w-3 h-3 mr-1" />
                                                                High Risk
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="text-slate-400 text-xs mb-2">Service Type {appt.serviceId}</div>
                                                    <div className="flex items-center text-xs text-slate-500">
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        60 min
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="h-full w-full rounded-xl hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-800 border-dashed flex items-center justify-center opacity-0 hover:opacity-100">
                                                    <Plus className="w-5 h-5 text-slate-600" />
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Schedule;