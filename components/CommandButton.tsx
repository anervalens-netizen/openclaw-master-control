
import React from 'react';
import { ExternalLink, ShieldAlert } from 'lucide-react';

interface CommandButtonProps {
  label: string;
  cmd: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
  dangerous?: boolean;
  wizard?: boolean;
  isLarge?: boolean;
}

export const CommandButton: React.FC<CommandButtonProps> = ({ 
  label, cmd, icon, onClick, disabled, dangerous, wizard, isLarge 
}) => {
  // Google Signature Palette
  const getTheme = () => {
    if (dangerous) return { border: 'hover:border-red-400', bg: 'bg-white', text: 'text-red-500', iconBg: 'bg-red-50' };
    if (wizard) return { border: 'hover:border-blue-400', bg: 'bg-white', text: 'text-blue-500', iconBg: 'bg-blue-50' };
    
    const palette = [
      { border: 'hover:border-green-400', text: 'text-green-600', iconBg: 'bg-green-50' },
      { border: 'hover:border-yellow-500', text: 'text-yellow-600', iconBg: 'bg-yellow-50' },
      { border: 'hover:border-blue-400', text: 'text-blue-500', iconBg: 'bg-blue-50' },
    ];
    return palette[label.length % palette.length];
  };

  const theme = getTheme();

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative flex items-center gap-4 ${isLarge ? 'p-6 h-full' : 'p-3'} rounded-2xl border border-gray-100 transition-all duration-200 text-left bg-white shadow-sm hover:shadow-md ${
        disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer active:scale-[0.97]'
      } ${theme.border} w-full`}
    >
      <div className={`${isLarge ? 'p-4 rounded-2xl' : 'p-2.5 rounded-xl'} transition-all duration-300 ${theme.iconBg} ${theme.text} group-hover:scale-110`}>
        {React.cloneElement(icon as React.ReactElement, { size: isLarge ? 28 : 18 })}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className={`font-bold text-gray-800 truncate mb-0.5 ${isLarge ? 'text-lg' : 'text-xs'}`}>{label}</h4>
        <code className={`${isLarge ? 'text-xs' : 'text-[9px]'} text-gray-400 font-mono block truncate opacity-60 italic`}>{cmd}</code>
      </div>

      {wizard && <ExternalLink size={isLarge ? 18 : 12} className="text-blue-300 mr-1" />}
      {dangerous && <ShieldAlert size={isLarge ? 18 : 12} className="text-red-300 mr-1" />}
    </button>
  );
};
