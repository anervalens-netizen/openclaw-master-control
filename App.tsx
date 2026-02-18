
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Terminal } from './components/Terminal';
import { DashboardContent } from './components/DashboardContent';
import { StatusBanner } from './components/StatusBanner';
import { TabType, LogEntry, LogType, SystemStatus, Command } from './types';
import { analyzeSystemLog } from './services/geminiService';
import { executeCommand } from './services/openClawService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.LIFECYCLE);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [status, setStatus] = useState<SystemStatus>({
    gatewayActive: false,
    health: 'healthy',
    version: 'v2.4.1-stable'
  });
  const [isExecuting, setIsExecuting] = useState(false);
  const [showConfirm, setShowConfirm] = useState<{ cmd: string; label: string } | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/health');
        const data = await response.json();
        setStatus(prev => ({ 
          ...prev, 
          gatewayActive: data.active,
          config: data.config
        }));
      } catch (err) {
        setStatus(prev => ({ ...prev, gatewayActive: false }));
      }
    };

    const interval = setInterval(checkStatus, 5000);
    checkStatus();
    return () => clearInterval(interval);
  }, []);

  const addLog = useCallback((message: string, type: LogType = 'info') => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toLocaleTimeString(),
      type,
      message
    };
    setLogs(prev => [...prev, newLog]);
    return newLog.id;
  }, []);

  const appendToLog = useCallback((id: string, text: string) => {
    setLogs(prev => prev.map(log => 
      log.id === id ? { ...log, message: log.message + text } : log
    ));
  }, []);

  const runCommand = async (cmd: string, wizard: boolean = false) => {
    if (isExecuting && !cmd.includes('pkill')) return;
    
    setIsExecuting(true);
    addLog(`$ ${cmd}`, 'command');

    // Create a specific entry for the command output
    const outputLogId = addLog('', 'info');

    if (wizard) {
      // Wizards still show special UI prompts but now execute real initial checks
      appendToLog(outputLogId, `[Wizard Mode] Initializing hardware bridge...\n`);
    }

    await executeCommand(
      cmd,
      (chunk) => {
        appendToLog(outputLogId, chunk);
        
        // Dynamic status updates based on output
        if (chunk.includes('started successfully')) {
          setStatus(prev => ({ ...prev, gatewayActive: true }));
        }
        if (chunk.includes('Shutting down')) {
          setStatus(prev => ({ ...prev, gatewayActive: false }));
        }
      },
      () => {
        setIsExecuting(false);
        // AI Analysis trigger for specific commands
        if (cmd.includes('doctor')) {
          const lastOutput = logs.find(l => l.id === outputLogId)?.message || '';
          analyzeSystemLog(lastOutput).then(aiMsg => {
            addLog(`AI DIAGNOSIS: ${aiMsg}`, 'info');
          });
        }
      },
      (err) => {
        appendToLog(outputLogId, `\nBRIDGE_ERROR: ${err}\nEnsure bridge.js is running on port 3001.`);
      }
    );
  };

  const handleCommandClick = (cmd: Command) => {
    if (cmd.dangerous) {
      setShowConfirm({ cmd: cmd.cmd, label: cmd.label });
    } else {
      runCommand(cmd.cmd, cmd.wizard);
    }
  };

  const isExpandedTerminal = activeTab !== TabType.SYSTEM;

  return (
    <div className="flex h-screen w-full bg-[#fcfcfc] overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        status={status}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white px-10 py-4 flex items-center justify-between z-10 shrink-0 border-b border-gray-50">
          <div className="flex items-center gap-4">
            <h1 className="text-lg tracking-tight">
              <span className="text-red-600 font-black uppercase tracking-wider">Control</span> 
              <span className="text-gray-800 font-bold ml-1.5">Board</span>
            </h1>
          </div>
          <StatusBanner status={status} />
        </header>

        <main className={`px-10 py-6 scroll-smooth transition-all duration-500 ${isExpandedTerminal ? 'shrink-0' : 'flex-1 overflow-y-auto'}`}>
          <DashboardContent 
            activeTab={activeTab} 
            onCommand={handleCommandClick} 
            isExecuting={isExecuting}
            status={status}
          />
        </main>

        <div className={`relative z-20 transition-all duration-500 overflow-hidden ${isExpandedTerminal ? 'flex-1' : 'h-[32%]'}`}>
          <Terminal 
            logs={logs} 
            clearLogs={() => setLogs([])} 
            onCommand={(cmd) => runCommand(cmd, false)}
            isExecuting={isExecuting}
          />
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl p-8 max-w-md w-full border border-red-50 text-center animate-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Elevated Command</h3>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              Execution of <code className="bg-red-50 px-1.5 py-0.5 rounded font-mono text-red-600 font-bold">{showConfirm.cmd}</code> may impact system stability.
            </p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setShowConfirm(null)} className="px-6 py-2.5 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-full transition-colors">Abort</button>
              <button 
                onClick={() => { runCommand(showConfirm.cmd); setShowConfirm(null); }}
                className="px-6 py-2.5 bg-red-600 text-white text-xs font-bold hover:bg-red-700 rounded-full shadow-lg transition-all"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
