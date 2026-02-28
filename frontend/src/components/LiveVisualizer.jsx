import React from 'react';
import { Network } from 'lucide-react';

const stepsLabel = [
    "Init", "Parse", "Summit API", "Validation", "CodeMiner", "Analysis",
    "DICE Fetch", "Approval Req", "DICE Update", "Re-Validate", "Booking Confirmed",
    "Teams Notify", "Client Mkt", "CPM Books", "Mirror Fee", "Finalize", "Done"
];

const LiveVisualizer = ({ step }) => {
    // Normalize step between 0 and 17
    const currentStepIndex = Math.min(Math.max(step - 1, -1), 16);

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-lg p-4 h-full flex flex-col justify-center">
            <div className="flex items-center space-x-2 border-b border-gray-800 pb-2 mb-4">
                <Network size={16} className="text-blue-500" />
                <h2 className="text-sm font-semibold text-gray-300">Agent Action Flow</h2>
            </div>

            <div className="flex items-center justify-between w-full relative">
                {/* Background Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-800 rounded-full -translate-y-1/2 z-0"></div>

                {/* Progress Line */}
                <div
                    className="absolute top-1/2 left-0 h-1 bg-blue-600 rounded-full -translate-y-1/2 z-0 transition-all duration-500"
                    style={{ width: `${(currentStepIndex / 16) * 100}%` }}
                ></div>

                {/* Dots & Labels */}
                {stepsLabel.map((label, idx) => {
                    const isActive = idx <= currentStepIndex;
                    const isCurrent = idx === currentStepIndex;

                    return (
                        <div key={idx} className="relative z-10 flex flex-col items-center group">
                            <div
                                className={`w-4 h-4 rounded-full border-2 transition-all duration-300 shadow-xl ${isCurrent ? 'bg-blue-500 border-blue-300 scale-125 animate-pulse'
                                        : isActive ? 'bg-blue-600 border-blue-600'
                                            : 'bg-gray-800 border-gray-600'
                                    }`}
                            ></div>
                            {/* Tooltip on Hover */}
                            <div className="absolute top-6 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-black text-xs text-white p-1 rounded z-20 pointer-events-none">
                                {label}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default LiveVisualizer;
