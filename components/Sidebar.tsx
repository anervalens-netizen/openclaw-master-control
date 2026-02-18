
import React from 'react';
import { TabType, SystemStatus } from '../types';
import { TAB_ICONS } from '../constants';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  status?: SystemStatus;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, status }) => {
  const tabs = Object.values(TabType);
  const isNotInstalled = status?.config?.status === 'not_installed';

  const getActiveTheme = (tab: TabType) => {
    switch(tab) {
      case TabType.LIFECYCLE: return 'bg-blue-50 text-blue-600 shadow-sm';
      case TabType.SYSTEM: return 'bg-red-50 text-red-600 shadow-sm';
      case TabType.AGENTS: return 'bg-green-50 text-green-600 shadow-sm';
      case TabType.CHANNELS: return 'bg-yellow-50 text-yellow-600 shadow-sm';
      case TabType.HELP: return 'bg-indigo-50 text-indigo-600 shadow-sm';
      default: return 'bg-gray-50';
    }
  };

  return (
    <aside className="w-64 bg-white flex flex-col h-full border-r border-gray-100 shadow-sm z-20">
      <div className="p-8 pb-6">
        <div className="flex flex-col cursor-default select-none">
          <h1 className="text-[32px] font-[1000] tracking-[-0.05em] leading-none uppercase">
            <span className="text-red-600">Open</span>
            <span className="text-gray-900">Claw</span>
          </h1>
          <div className="text-[9px] uppercase tracking-[0.3em] text-gray-400 font-black mt-2 ml-0.5">
            Master Control
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 flex flex-col gap-1 overflow-y-auto">
        <div className="text-[10px] font-bold text-gray-300 uppercase tracking-widest px-4 mb-2 mt-4">Console</div>
        {tabs.map(tab => {
          const isDisabled = isNotInstalled && tab !== TabType.HELP;
          return (
            <button
              key={tab}
              onClick={() => !isDisabled && setActiveTab(tab)}
              disabled={isDisabled}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-full transition-all duration-300 group ${
                isDisabled ? 'opacity-30 cursor-not-allowed grayscale' :
                activeTab === tab 
                  ? getActiveTheme(tab)
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className={`transition-transform duration-300 ${!isDisabled ? 'group-hover:scale-110' : ''} ${activeTab === tab ? 'scale-110' : ''}`}>
                {TAB_ICONS[tab]}
              </div>
              <span className="text-xs font-semibold">{tab.split(' & ')[0]}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-gray-50 rounded-3xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Node Status</span>
          </div>
          <span className="text-[11px] font-mono text-gray-600 truncate block">master_cloud_v1</span>
        </div>
      </div>
    </aside>
  );
};
