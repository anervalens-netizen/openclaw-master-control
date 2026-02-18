
import React, { useEffect, useRef, useState } from 'react';
import { LogEntry } from '../types';
import { Terminal as TerminalIcon, Trash2, Maximize2, Circle, Send } from 'lucide-react';

interface TerminalProps {
  logs: LogEntry[];
  clearLogs: () => void;
  onCommand?: (cmd: string) => void;
  isExecuting?: boolean;
}

export const Terminal: React.FC<TerminalProps> = ({ logs, clearLogs, onCommand, isExecuting }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Auto-scroll to bottom on new logs
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !onCommand) return;
    
    const cmd = inputValue.trim();
    onCommand(cmd);
    
    setHistory(prev => [cmd, ...prev]);
    setHistoryIndex(-1);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIndex = Math.min(historyIndex + 1, history.length - 1);
        setHistoryIndex(nextIndex);
        setInputValue(history[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = Math.max(historyIndex - 1, -1);
        setHistoryIndex(nextIndex);
        setInputValue(nextIndex === -1 ? '' : history[nextIndex]);
      } else {
        setHistoryIndex(-1);
        setInputValue('');
      }
    }
  };

  return (
    <div className="h-full bg-[#1a1b1e] flex flex-col overflow-hidden text-[#e1e1e6] rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.2)] border-t border-[#2a2b30] relative">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-8 py-3 bg-[#212226]/80 backdrop-blur-xl border-b border-[#2a2b30] shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            <Circle size={10} fill="#ff5f56" stroke="none" />
            <Circle size={10} fill="#ffbd2e" stroke="none" />
            <Circle size={10} fill="#27c93f" stroke="none" />
          </div>
          <div className="h-4 w-px bg-[#34353a] mx-1" />
          <div className="flex items-center gap-2">
            <TerminalIcon className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Master System Console</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={clearLogs}
            className="p-1.5 hover:bg-[#2a2b30] rounded-lg text-gray-500 hover:text-white transition-all"
            title="Wipe Logs"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button className="p-1.5 hover:bg-[#2a2b30] rounded-lg text-gray-500 hover:text-white transition-all">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Terminal Content */}
      <div 
        ref={scrollRef}
        className="flex-1 p-6 pb-2 terminal-font text-[13px] overflow-y-auto scroll-smooth custom-scrollbar"
      >
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-20 select-none pb-12">
            <TerminalIcon size={48} className="mb-4 text-gray-600" />
            <p className="text-xs uppercase tracking-[0.2em] font-bold text-gray-600">Awaiting Input Signal</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {logs.map((log) => (
              <div key={log.id} className="flex gap-4 animate-in fade-in slide-in-from-left-2 duration-300">
                <span className="text-gray-600 shrink-0 font-mono text-[11px] mt-0.5 select-none">[{log.timestamp}]</span>
                <span className={`break-words leading-relaxed whitespace-pre-wrap font-mono ${
                  log.type === 'command' ? 'text-blue-400 font-bold border-l-2 border-blue-500/30 pl-3 ml-[-12px]' :
                  log.type === 'success' ? 'text-green-400' :
                  log.type === 'error' ? 'text-red-400' :
                  log.type === 'critical' ? 'text-red-500 font-black bg-red-500/10 px-2 rounded-sm' :
                  'text-gray-300'
                }`}>
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#1a1b1e] border-t border-[#2a2b30] shrink-0">
        <form onSubmit={handleSubmit} className="flex items-center gap-3 relative group">
          <span className="text-green-500 font-bold select-none text-lg leading-none mt-[-2px]">$</span>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isExecuting}
            placeholder={isExecuting ? "Processing command..." : "Enter command..."}
            className="flex-1 bg-transparent border-none outline-none text-[#e1e1e6] font-mono text-sm placeholder:text-gray-700 caret-green-500"
            autoFocus
            autoComplete="off"
            spellCheck="false"
          />
          <button 
            type="submit"
            disabled={!inputValue.trim() || isExecuting}
            className="p-2 text-gray-500 hover:text-green-400 disabled:opacity-30 disabled:hover:text-gray-500 transition-colors"
          >
            <Send size={16} />
          </button>
        </form>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #2a2b30;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #34353a;
        }
      `}</style>
    </div>
  );
};
