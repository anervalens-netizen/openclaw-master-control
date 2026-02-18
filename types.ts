
import React from 'react';

export enum TabType {
  LIFECYCLE = 'Setup & Launch',
  SYSTEM = 'System & Gateway',
  AGENTS = 'Agents & Intelligence',
  CHANNELS = 'Channels & Media',
  HELP = 'Documentation & Info'
}

export type LogType = 'info' | 'success' | 'error' | 'command' | 'critical';

export interface LogEntry {
  id: string;
  timestamp: string;
  type: LogType;
  message: string;
}

export interface SystemStatus {
  gatewayActive: boolean;
  health: 'healthy' | 'warning' | 'critical';
  version: string;
  config?: {
    status: 'healthy' | 'warning' | 'error' | 'missing';
    message: string;
    backup: boolean;
  };
}

// Fixed: Added Command interface to centralize command definition and fix TypeScript property errors
export interface Command {
  label: string;
  cmd: string;
  icon: React.ReactNode;
  wizard?: boolean;
  dangerous?: boolean;
}
