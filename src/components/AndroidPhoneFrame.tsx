import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal, ArrowLeft, RotateCcw, Smartphone, Laptop } from 'lucide-react';
import { AppScreen } from '../types';

interface AndroidPhoneFrameProps {
  children: React.ReactNode;
  currentScreen: AppScreen;
  onNavigateHome: () => void;
  onNavigateBack: () => void;
  title: string;
  isExpandedView: boolean;
  onToggleExpandedView: () => void;
  onResetData: () => void;
  onOpenKotlinModal: () => void;
}

export const AndroidPhoneFrame: React.FC<AndroidPhoneFrameProps> = ({
  children,
  currentScreen,
  onNavigateHome,
  onNavigateBack,
  title,
  isExpandedView,
  onToggleExpandedView,
  onResetData,
  onOpenKotlinModal,
}) => {
  const [currentTime, setCurrentTime] = useState('10:42');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-4 px-2 sm:px-4 bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white relative">
      {/* Ambient background glow for sleek depth */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl -translate-y-24" />
        <div className="w-[400px] h-[400px] bg-sky-500/5 rounded-full blur-3xl translate-x-48 translate-y-48" />
      </div>

      {/* Top Utility Bar for Web AI Studio Sandbox */}
      <header className="w-full max-w-4xl mb-4 flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl px-4 py-2.5 rounded-2xl shadow-xl shadow-slate-950/50 z-20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center shadow-lg shadow-indigo-600/30 border border-indigo-400/20">
            <Laptop className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              Soporte Técnico
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-medium">
                Android Jetpack Compose
              </span>
            </h1>
            <p className="text-xs text-slate-400">Prototipo interactivo Cliente &amp; Técnico</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-open-kotlin-code"
            onClick={onOpenKotlinModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-semibold transition shadow-sm active:scale-95 hover:border-indigo-400/60"
            title="Ver código fuente de Kotlin y Jetpack Compose"
          >
            <span className="font-mono font-bold text-xs bg-indigo-500 text-white px-1.5 py-0.5 rounded">.kt</span>
            <span>Código Kotlin / Compose</span>
          </button>

          <button
            id="btn-toggle-view-mode"
            onClick={onToggleExpandedView}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 text-xs transition active:scale-95"
            title={isExpandedView ? "Modo teléfono" : "Modo expandido"}
          >
            <Smartphone className={`w-4 h-4 ${!isExpandedView ? 'text-indigo-400' : 'text-slate-400'}`} />
          </button>

          <button
            id="btn-reset-mock-data"
            onClick={onResetData}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 text-xs transition active:scale-95"
            title="Restablecer datos de prueba"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container: Android Phone Screen or Responsive Tablet/Expanded View */}
      <main
        className={`w-full transition-all duration-300 relative z-10 ${
          isExpandedView
            ? 'max-w-4xl bg-slate-900/95 border border-slate-800/90 rounded-3xl p-6 shadow-2xl backdrop-blur-xl ring-1 ring-white/5'
            : 'max-w-[420px] bg-slate-900 border-[8px] border-slate-800/90 rounded-[44px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] ring-1 ring-white/10 overflow-hidden'
        }`}
      >
        {/* Android Status Bar (Shown in Phone Mode) */}
        {!isExpandedView && (
          <div className="bg-slate-900/95 text-slate-300 px-6 pt-3 pb-1 flex items-center justify-between text-xs font-medium select-none border-b border-slate-800/60">
            <span className="font-semibold tracking-tight text-white">{currentTime}</span>
            {/* Camera cutout notch */}
            <div className="w-4 h-4 rounded-full bg-black ring-2 ring-slate-800/80 mx-auto" />
            <div className="flex items-center gap-2 text-slate-300">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-400">98%</span>
                <Battery className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          </div>
        )}

        {/* Android Material 3 Top App Bar */}
        <div className="bg-slate-900/90 backdrop-blur-md px-4 py-3.5 border-b border-slate-800/80 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {currentScreen !== 'home' && (
              <button
                id="android-back-button"
                onClick={onNavigateBack}
                className="p-2 -ml-1 rounded-full hover:bg-slate-800/80 active:bg-slate-700 text-slate-200 transition"
                aria-label="Volver"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h2 className="text-base font-bold text-white leading-tight tracking-tight">
                {title}
              </h2>
              {currentScreen !== 'home' && (
                <p className="text-[11px] text-indigo-400 font-medium capitalize tracking-tight">
                  {currentScreen.startsWith('client') ? 'Panel del Cliente' : 'Panel del Técnico'}
                </p>
              )}
            </div>
          </div>

          {currentScreen !== 'home' && (
            <button
              id="android-home-shortcut"
              onClick={onNavigateHome}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 font-medium transition active:scale-95"
            >
              Inicio
            </button>
          )}
        </div>

        {/* Scrollable Android Content View */}
        <div
          className={`${
            isExpandedView ? 'min-h-[600px]' : 'h-[680px]'
          } overflow-y-auto custom-scrollbar bg-slate-950 text-slate-100 flex flex-col`}
        >
          {children}
        </div>

        {/* Android Gesture Navigation Bar (Shown in Phone Mode) */}
        {!isExpandedView && (
          <div className="bg-slate-950 py-2 flex justify-center items-center border-t border-slate-900">
            <div className="w-32 h-1 rounded-full bg-slate-700 hover:bg-slate-600 cursor-pointer transition" />
          </div>
        )}
      </main>
    </div>
  );
};
