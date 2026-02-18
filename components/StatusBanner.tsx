
import React from 'react';
import { SystemStatus } from '../types';
import { CheckCircle2, AlertTriangle, XCircle, Cloud, CloudOff } from 'lucide-react';

interface StatusBannerProps {
  status: SystemStatus;
}

export const StatusBanner: React.FC<StatusBannerProps> = ({ status }) => {
  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
        <span className="text-[10px] font-bold text-gray-500 uppercase">Version</span>
        <span className="text-xs font-mono font-semibold text-gray-700">{status.version}</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
            {status.gatewayActive ? (
                <>
                <Cloud className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-semibold text-gray-600">Gateway Online</span>
                </>
            ) : (
                <>
                <CloudOff className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-semibold text-gray-400">Gateway Offline</span>
                </>
            )}
        </div>

        <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Health</div>
          {status.health === 'healthy' && (
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
            </div>
          )}
          {status.health === 'warning' && (
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)] animate-pulse" />
            </div>
          )}
          {status.health === 'critical' && (
            <div className="flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-red-500" />
              <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
