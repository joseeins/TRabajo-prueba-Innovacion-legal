import React from 'react';
import { Scale, PlusCircle, FolderOpen, UserCheck, UserX, Shield } from 'lucide-react';
import type { UserSession } from '../types';

interface HeaderProps {
  currentView: 'list' | 'new' | 'summary';
  onNavigate: (view: 'list' | 'new') => void;
  session: UserSession | null;
  onToggleSession: () => void;
  expedientesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  session,
  onToggleSession,
  expedientesCount,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Legaltech Identity */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('list')}>
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center shadow-sm">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">IurisFile</span>
                <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider rounded bg-amber-100 text-amber-900 border border-amber-200">
                  MVP Legaltech
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Expedientes Digitales Centralizados
              </p>
            </div>
          </div>

          {/* Navigation & Controls */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              onClick={() => onNavigate('list')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'list'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FolderOpen className="w-4 h-4 text-slate-500" />
              <span>Expedientes ({expedientesCount})</span>
            </button>

            <button
              onClick={() => onNavigate('new')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-xs ${
                currentView === 'new'
                  ? 'bg-amber-600 text-white hover:bg-amber-700'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Nuevo expediente</span>
            </button>

            {/* Session Simulator Toggle */}
            <div className="pl-2 border-l border-slate-200">
              <button
                onClick={onToggleSession}
                title="Alternar entre usuario con sesión autenticada y sin autenticación (Requisito 5.2/5.4)"
                className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  session
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                }`}
              >
                {session ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="hidden md:inline font-semibold">Sesión activa:</span>
                    <span className="truncate max-w-[120px]">{session.nombre}</span>
                  </>
                ) : (
                  <>
                    <UserX className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-slate-700">Sin autenticación</span>
                  </>
                )}
                <span className="text-[10px] px-1 py-0.5 rounded bg-white text-slate-500 border border-slate-200 font-mono">
                  Alternar
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
