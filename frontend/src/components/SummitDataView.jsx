import React from 'react';
import { Database } from 'lucide-react';

const SummitDataView = ({ data }) => {
    return (
        <div className="bg-gray-900 border border-gray-800 rounded-lg flex flex-col flex-1 shadow-lg max-h-[300px]">
            <div className="bg-gray-800 p-2 px-4 shadow-sm flex items-center space-x-2 border-b border-gray-700">
                <Database size={16} className="text-blue-500" />
                <h2 className="text-md font-semibold text-gray-200">Summit Core Architecture</h2>
            </div>

            <div className="p-4 overflow-auto custom-scrollbar flex-1">
                {!data ? (
                    <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                        No booking data available.
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm bg-gray-800 p-3 rounded-lg border border-gray-700 shadow max-w-sm">
                            <span className="font-semibold text-gray-400">Booking ID:</span>
                            <span className="font-mono text-blue-400 font-bold">{data.booking_id}</span>
                        </div>

                        <div className="border border-gray-700 rounded-lg overflow-hidden shadow">
                            <table className="w-full text-sm text-left text-gray-300">
                                <thead className="text-xs text-gray-400 uppercase bg-gray-800 border-b border-gray-700">
                                    <tr>
                                        <th scope="col" className="px-4 py-3">Allocation Type</th>
                                        <th scope="col" className="px-4 py-3">Amount</th>
                                        <th scope="col" className="px-4 py-3">Book</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.allocations && data.allocations.map((alloc, idx) => (
                                        <tr key={idx} className="bg-gray-900 border-b border-gray-800 hover:bg-gray-800 transition">
                                            <td className="px-4 py-3 font-medium text-gray-200">{alloc.type}</td>
                                            <td className="px-4 py-3 font-mono text-green-400">${alloc.amount.toLocaleString()}</td>
                                            <td className="px-4 py-3 text-blue-300">{alloc.book}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SummitDataView;
