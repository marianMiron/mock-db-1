import React from 'react';
import { ShieldAlert } from 'lucide-react';

const ApprovalModal = ({ reason, onApprove, onReject }) => {
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden text-center flex flex-col items-center">

                <div className="absolute top-0 left-0 w-full h-1 bg-orange-500"></div>

                <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mb-6">
                    <ShieldAlert size={32} className="text-orange-500" />
                </div>

                <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Human Approval Required</h2>

                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 w-full mb-8 text-left shadow-inner">
                    <p className="text-sm font-semibold text-gray-400 mb-1">Agent Request Reason:</p>
                    <p className="text-md text-gray-200">{reason}</p>
                </div>

                <div className="flex space-x-4 w-full">
                    <button
                        onClick={onReject}
                        className="flex-1 bg-gray-800 hover:bg-red-600 border border-gray-700 hover:border-red-600 text-white font-medium py-3 rounded-lg transition-colors shadow-lg"
                    >
                        Reject Request
                    </button>

                    <button
                        onClick={onApprove}
                        className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-lg transition-colors shadow-lg"
                    >
                        Approve Request
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApprovalModal;
