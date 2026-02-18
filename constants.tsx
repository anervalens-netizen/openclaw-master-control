
import React from 'react';
import { 
  Rocket, 
  Settings, 
  Stethoscope, 
  RotateCcw, 
  Play, 
  Square, 
  RefreshCw, 
  Activity, 
  Info,
  Users,
  Brain,
  Database,
  Clock,
  MessageSquare,
  QrCode,
  Globe,
  FolderSearch,
  Cpu,
  Wrench,
  Hash,
  LayoutDashboard,
  HelpCircle,
  FileText,
  Sliders,
  ShieldCheck,
  List,
  History,
  Search,
  Terminal as TerminalIcon,
  Zap,
  Network,
  Volume2,
  Camera,
  Video,
  LogIn,
  SlidersHorizontal,
  Info as InfoIcon
} from 'lucide-react';
import { TabType, Command } from './types';

export const TAB_ICONS: Record<string, React.ReactNode> = {
  [TabType.LIFECYCLE]: <Rocket className="w-5 h-5" />,
  [TabType.SYSTEM]: <Cpu className="w-5 h-5" />,
  [TabType.AGENTS]: <Brain className="w-5 h-5" />,
  [TabType.CHANNELS]: <MessageSquare className="w-5 h-5" />,
  [TabType.HELP]: <InfoIcon className="w-5 h-5" />
};

export const COMMANDS: Record<string, Command[]> = {
  [TabType.LIFECYCLE]: [
    { 
      label: 'Install Core', 
      cmd: 'curl -fsSL https://openclaw.ai/install.sh | bash', 
      icon: <Rocket className="w-5 h-5" />,
      dangerous: true
    },
    { 
      label: 'Onboard', 
      cmd: 'openclaw onboard', 
      icon: <LogIn className="w-5 h-5" />,
      wizard: true
    },
    { 
      label: 'Configure', 
      cmd: 'openclaw configure', 
      icon: <Settings className="w-5 h-5" />,
      wizard: true
    },
    { 
      label: 'Config Helper', 
      cmd: 'openclaw config', 
      icon: <SlidersHorizontal className="w-5 h-5" />,
      wizard: true
    },
    { 
      label: 'Version Info', 
      cmd: 'openclaw -v', 
      icon: <Hash className="w-5 h-5" /> 
    },
    { 
      label: 'Global Status', 
      cmd: 'openclaw status', 
      icon: <LayoutDashboard className="w-5 h-5" /> 
    },
    { 
      label: 'Inline Help', 
      cmd: 'openclaw help', 
      icon: <HelpCircle className="w-5 h-5" /> 
    }
  ],
  [TabType.SYSTEM]: [
    { 
      label: 'Start Gateway', 
      cmd: 'openclaw gateway start', 
      icon: <Play className="w-5 h-5" /> 
    },
    { 
      label: 'Stop Gateway', 
      cmd: 'openclaw gateway stop', 
      icon: <Square className="w-5 h-5" />,
      dangerous: true
    },
    { 
      label: 'Restart Gateway', 
      cmd: 'openclaw gateway restart', 
      icon: <RotateCcw className="w-5 h-5" /> 
    },
    { 
      label: 'Gateway Status', 
      cmd: 'openclaw gateway status', 
      icon: <Activity className="w-5 h-5" /> 
    },
    { 
      label: 'Live Logs', 
      cmd: 'openclaw logs --follow', 
      icon: <FileText className="w-5 h-5" /> 
    },
    { 
      label: 'Stop Live Logs', 
      cmd: 'pkill -f "openclaw logs"', 
      icon: <Square className="w-5 h-5" />,
      dangerous: true
    },
    { 
      label: 'Doctor', 
      cmd: 'openclaw doctor', 
      icon: <Stethoscope className="w-5 h-5" /> 
    },
    { 
      label: 'Doctor Fix', 
      cmd: 'openclaw doctor --fix', 
      icon: <Wrench className="w-5 h-5" />,
      dangerous: true
    },
    { 
      label: 'Security Audit', 
      cmd: 'openclaw security audit', 
      icon: <ShieldCheck className="w-5 h-5" /> 
    },
    { 
      label: 'Update Patch', 
      cmd: 'openclaw update', 
      icon: <RefreshCw className="w-5 h-5" /> 
    }
  ],
  [TabType.AGENTS]: [
    { label: 'List Agents', cmd: 'openclaw agents list', icon: <List className="w-5 h-5" /> },
    { label: 'Session History', cmd: 'openclaw sessions history', icon: <History className="w-5 h-5" /> },
    { label: 'Memory Status', cmd: 'openclaw memory status', icon: <Database className="w-5 h-5" /> },
    { label: 'Models List', cmd: 'openclaw models list', icon: <List className="w-5 h-5" /> },
    { label: 'Models Status', cmd: 'openclaw models status', icon: <Activity className="w-5 h-5" /> },
  ],
  [TabType.CHANNELS]: [
    { label: 'Chat login', cmd: 'openclaw channels login --verbose', icon: <LogIn className="w-5 h-5" />, wizard: true },
    { label: 'Deep Status', cmd: 'openclaw status --deep', icon: <Zap className="w-5 h-5" /> },
    { label: 'List Channels', cmd: 'openclaw channels list', icon: <List className="w-5 h-5" /> },
  ]
};
