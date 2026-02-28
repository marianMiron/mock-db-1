import React from 'react';
import TerminalView from './TerminalView';
import MSTeamsPanel from './MSTeamsPanel';
import SummitDataView from './SummitDataView';
import LiveVisualizer from './LiveVisualizer';
import ApprovalModal from './ApprovalModal';

const Dashboard = ({
    sendAction, logs, step,
    summitData, teamsMsgs,
    requireApproval, setRequireApproval, chartData
}) => {
    return (
        <div className="flex-1 flex flex-col space-y-4 min-h-0">
            {/* Top Section - Visualizer */}
            <div className="h-24 flex-shrink-0">
                <LiveVisualizer step={step} />
            </div>

            {/* Main Grid Content */}
            <div className="flex-1 flex space-x-4 min-h-0">

                {/* Left Column - User Chat & MS Teams Mock View */}
                <div className="w-1/3 flex flex-col space-y-4 min-h-0">
                    <MSTeamsPanel messages={teamsMsgs} sendAction={sendAction} />
                </div>

                {/* Center Column - Summit Data (Business Logic) & Terminal */}
                <div className="w-2/3 flex flex-col space-y-4 min-h-0">
                    <SummitDataView data={summitData} />
                    <TerminalView logs={logs} />
                </div>

            </div>

            {/* Modals */}
            {requireApproval && (
                <ApprovalModal
                    reason={requireApproval}
                    onApprove={() => {
                        sendAction('approve');
                        setRequireApproval(null);
                    }}
                    onReject={() => {
                        sendAction('reject');
                        setRequireApproval(null);
                    }}
                />
            )}
        </div>
    );
};

export default Dashboard;
