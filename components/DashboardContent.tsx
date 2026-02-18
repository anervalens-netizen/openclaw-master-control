
import { TabType, Command, SystemStatus } from '../types';
import { COMMANDS, TAB_ICONS } from '../constants';
import { CommandButton } from './CommandButton';
import { Info as InfoIcon, ShieldAlert, CheckCircle2, History } from 'lucide-react';

interface DashboardContentProps {
  activeTab: TabType;
  onCommand: (cmd: Command) => void;
  isExecuting: boolean;
  status?: SystemStatus;
}

export const DashboardContent: React.FC<DashboardContentProps> = ({ activeTab, onCommand, isExecuting, status }) => {
  const currentCommands: Command[] = COMMANDS[activeTab] || [];
  const isNotInstalled = status?.config?.status === 'not_installed';

  const getAccentColor = () => {
    switch(activeTab) {
      case TabType.LIFECYCLE: return 'bg-blue-500';
      case TabType.SYSTEM: return 'bg-red-500';
      case TabType.AGENTS: return 'bg-green-500';
      case TabType.CHANNELS: return 'bg-yellow-500';
      case TabType.HELP: return 'bg-indigo-500';
      default: return 'bg-gray-400';
    }
  };

  if (isNotInstalled) {
    const installCommand = COMMANDS[TabType.LIFECYCLE].find(c => c.label === 'Install Core');
    
    return (
      <div className="animate-in fade-in zoom-in-95 duration-500">
        <div className="max-w-3xl mx-auto py-12">
          <div className="bg-white p-12 rounded-[3rem] border border-gray-100 shadow-xl text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <ShieldAlert className="text-blue-500 w-10 h-10" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Welcome to OpenClaw</h1>
            <p className="text-gray-500 mb-12 max-w-md mx-auto leading-relaxed">
              We couldn't detect a local OpenClaw installation. To begin using the dashboard, you need to install the core system first.
            </p>
            
            <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 mb-8 inline-block w-full max-w-md text-left">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Quick Setup</h3>
              {installCommand && (
                <div className="space-y-4">
                  <CommandButton 
                    command={installCommand}
                    onClick={() => onCommand(installCommand)}
                    isExecuting={isExecuting}
                    variant="hero"
                  />
                  <p className="text-[10px] text-gray-400 text-center italic">
                    This will run the official install.sh script on your system.
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-6 pt-6 border-t border-gray-50">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Node.js Detected
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Bridge Connected
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === TabType.HELP) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-400">
        <div className="mb-6 flex items-center gap-4">
          <div className={`w-1.5 h-8 rounded-full ${getAccentColor()}`} />
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">{activeTab}</h2>
            <p className="text-[11px] text-gray-500 font-medium">Core Intelligence Documentation</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                <InfoIcon className="text-indigo-500 w-4 h-4" />
              </div>
              About Control Board
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              This is the centralized management interface for the <strong>OpenClaw</strong> ecosystem. 
              It allows for low-level system interaction even when the main agent is offline.
            </p>
            <div className="space-y-4 mb-8">
              <HelpItem 
                title="Installation" 
                desc="Use 'Install Core' to fetch the latest OpenClaw binaries via the dedicated bridge." 
              />
              <HelpItem 
                title="Emergency Control" 
                desc="The 'Stop Live Logs' button bypasses standard locks to kill runaway log streams." 
              />
              <HelpItem 
                title="Remote Access" 
                desc="Access this board on your local network using the laptop's IP on port 5173." 
              />
            </div>

            <div className="pt-6 border-t border-gray-50">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">External Resources</h4>
                <div className="flex flex-wrap gap-3">
                    <a href="https://docs.openclaw.ai" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[11px] font-bold hover:bg-indigo-100 transition-colors">
                        Official Docs
                    </a>
                    <a href="https://github.com/openclaw/openclaw" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-xl text-[11px] font-bold hover:bg-gray-100 transition-colors">
                        GitHub Repo
                    </a>
                </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-8 rounded-[2rem] text-white shadow-xl">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-indigo-200">
              System Architecture
            </h3>
            <div className="space-y-6">
              <div className="border-l-2 border-indigo-400 pl-4">
                <div className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-1">Layer 1: Bridge</div>
                <div className="text-xs text-indigo-100/80">A Node.js process on port 3001 that executes shell commands and manages the PTY.</div>
              </div>
              <div className="border-l-2 border-emerald-400 pl-4">
                <div className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest mb-1">Layer 2: Frontend</div>
                <div className="text-xs text-emerald-100/80">React/Vite dashboard running on port 5173 with direct bridge integration.</div>
              </div>
              <div className="border-l-2 border-red-400 pl-4">
                <div className="text-[10px] font-bold text-red-300 uppercase tracking-widest mb-1">Layer 3: Gateway</div>
                <div className="text-xs text-red-100/80">The main OpenClaw engine that orchestrates agents, memory, and channel plugins.</div>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-white/10 flex justify-between items-center text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">
              <span>v2.4.1-stable</span>
              <span>© 2026 OpenClaw</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-400">
      <div className="mb-6 flex items-center gap-4">
        <div className={`w-1.5 h-8 rounded-full ${getAccentColor()}`} />
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">{activeTab}</h2>
          <p className="text-[11px] text-gray-500 font-medium">{currentCommands.length} Operations Available</p>
        </div>
      </div>

      {activeTab === TabType.LIFECYCLE && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6 items-stretch">
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {currentCommands.filter(c => c.label === 'Install Core' || c.label === 'Onboard' || c.label === 'Configure').map(cmd => (
              <div key={cmd.label} className="h-full">
                <CommandButton 
                  label={cmd.label}
                  cmd={cmd.cmd}
                  icon={cmd.icon}
                  onClick={() => onCommand(cmd)}
                  disabled={isExecuting}
                  dangerous={cmd.dangerous}
                  wizard={cmd.wizard}
                  isLarge={true}
                />
              </div>
            ))}
            
            {/* Second row of Setup buttons - small ones */}
            <div className="sm:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {currentCommands.filter(c => 
                c.label === 'Config Helper' || 
                c.label === 'Version Info' || 
                c.label === 'Global Status' || 
                c.label === 'Inline Help'
              ).map(cmd => (
                <div key={cmd.label}>
                  <CommandButton 
                    label={cmd.label}
                    cmd={cmd.cmd}
                    icon={cmd.icon}
                    onClick={() => onCommand(cmd)}
                    disabled={isExecuting}
                    dangerous={cmd.dangerous}
                    wizard={cmd.wizard}
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-red-50 to-white p-6 rounded-[2rem] border border-red-100 flex flex-col justify-center">
            <h3 className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-3">Setup Guide</h3>
            <div className="space-y-3">
              <p className="text-[11px] text-gray-700 leading-relaxed">
                1. <span className="font-bold text-red-600">Install</span> the core binaries.
              </p>
              <p className="text-[11px] text-gray-700 leading-relaxed">
                2. Run <span className="font-bold text-gray-900">Onboard</span> for initial identity and workspace setup.
              </p>
              <p className="text-[11px] text-gray-700 leading-relaxed">
                3. Use <span className="font-bold text-blue-600">Configure</span> to manage API providers, models, and advanced gateway settings.
              </p>
              <p className="text-[11px] text-gray-500 italic mt-2 border-t border-red-100 pt-2">
                Verify with 'Global Status' after setup.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {currentCommands
          .filter(c => activeTab !== TabType.LIFECYCLE || (
            c.label !== 'Install Core' && 
            c.label !== 'Onboard' && 
            c.label !== 'Configure' &&
            c.label !== 'Config Helper' &&
            c.label !== 'Version Info' &&
            c.label !== 'Global Status' &&
            c.label !== 'Inline Help'
          ))
          .map((cmd) => (
            <div key={cmd.label}>
              <CommandButton 
                label={cmd.label}
                cmd={cmd.cmd}
                icon={cmd.icon}
                onClick={() => onCommand(cmd)}
                disabled={isExecuting && cmd.label !== 'Stop Live Logs'}
                dangerous={cmd.dangerous}
                wizard={cmd.wizard}
              />
            </div>
          ))}
      </div>

      {activeTab === TabType.SYSTEM && (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center justify-between">
                  Config Integrity Watch
                  {status?.config?.backup && <span className="text-[9px] text-green-500 bg-green-50 px-2 py-0.5 rounded-full lowercase">backup active</span>}
                </h3>
                
                <div className="flex-1 flex flex-col justify-center">
                  <div className={`p-4 rounded-2xl flex items-start gap-4 ${
                    status?.config?.status === 'healthy' ? 'bg-green-50 border border-green-100' :
                    status?.config?.status === 'warning' ? 'bg-yellow-50 border border-yellow-100' :
                    'bg-red-50 border border-red-100'
                  }`}>
                    {status?.config?.status === 'healthy' ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                    ) : (
                      <ShieldAlert className={`w-6 h-6 shrink-0 ${status?.config?.status === 'warning' ? 'text-yellow-500' : 'text-red-500'}`} />
                    )}
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 mb-1 capitalize">
                        {status?.config?.status || 'Unknown'} status
                      </h4>
                      <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
                        {status?.config?.message || 'Awaiting bridge data...'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                      <History className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Last Activity</span>
                    </div>
                    <span className="text-[10px] text-gray-900 font-mono italic">
                      {isExecuting ? 'Processing command...' : 'System Idle'}
                    </span>
                  </div>
                </div>
            </div>
            
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Core Systems Status</h3>
                <div className="grid grid-cols-2 gap-3 flex-1">
                    <StatusMini label="Gateway" status={status?.gatewayActive ? 'online' : 'offline'} color={status?.gatewayActive ? 'bg-green-500' : 'bg-red-500'} />
                    <StatusMini label="Database" status="online" color="bg-green-500" />
                    <StatusMini label="LLM Api" status={status?.config?.status === 'healthy' ? 'online' : 'check config'} color={status?.config?.status === 'healthy' ? 'bg-green-500' : 'bg-yellow-500'} />
                    <StatusMini label="Channels" status="listening" color="bg-blue-500" />
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

const HelpItem = ({ title, desc }: { title: string; desc: string }) => (
  <div className="flex gap-4">
    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
    <div>
      <div className="text-xs font-bold text-gray-800 mb-0.5">{title}</div>
      <div className="text-[11px] text-gray-500 leading-normal">{desc}</div>
    </div>
  </div>
);

const StatusMini = ({ label, status, color }: { label: string; status: string; color: string }) => (
    <div className="flex flex-col items-center justify-center p-3 bg-gray-50/40 rounded-2xl border border-white hover:border-gray-100 transition-all hover:shadow-sm text-center">
        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">{label}</span>
        
        <div className="relative flex items-center justify-center mb-2">
            <div className={`absolute w-8 h-8 rounded-full ${color} opacity-20 animate-ping`} />
            <div className={`w-4 h-4 rounded-full ${color} shadow-sm border-2 border-white relative z-10`} />
        </div>

        <span className="text-[10px] font-bold text-gray-800 uppercase tracking-tight">{status}</span>
    </div>
);
