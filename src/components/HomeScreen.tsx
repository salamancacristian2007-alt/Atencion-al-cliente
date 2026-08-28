import React from 'react';
import { User, Wrench, ShieldCheck, Cpu, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface HomeScreenProps {
  onSelectClient: () => void;
  onSelectTechnician: () => void;
  totalTickets: number;
  pendingCount: number;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectClient,
  onSelectTechnician,
  totalTickets,
  pendingCount,
}) => {
  return (
    <div className="p-6 flex flex-col justify-between flex-1 max-w-lg mx-auto w-full">
      {/* Top Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center pt-4"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-sky-600 shadow-xl shadow-indigo-600/30 mb-5 border border-indigo-400/30 relative group">
          <div className="absolute inset-0 rounded-3xl bg-indigo-400/20 blur-md group-hover:blur-lg transition-all" />
          <Cpu className="w-10 h-10 text-white relative z-10" />
        </div>

        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Soporte Técnico
        </h1>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed max-w-xs mx-auto">
          Atención y solución de fallas para computadores, redes, audio y sistemas operativos.
        </p>
      </motion.div>

      {/* Main Mode Selection Buttons: Cliente y Técnico */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="space-y-4 my-8"
      >
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">
          Selecciona tu rol para ingresar
        </div>

        {/* Botón 1: Cliente */}
        <button
          id="btn-modo-cliente"
          onClick={onSelectClient}
          className="group w-full relative overflow-hidden p-5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-800 hover:from-indigo-500 hover:via-indigo-600 hover:to-blue-700 active:scale-[0.98] transition-all duration-200 shadow-xl shadow-indigo-950/50 border border-indigo-400/30 text-left flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center backdrop-blur-md group-hover:scale-105 transition-transform shadow-inner">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-lg font-bold text-white flex items-center gap-2">
                Cliente
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-semibold backdrop-blur-sm">
                  Reportar
                </span>
              </div>
              <p className="text-xs text-indigo-100/90 mt-0.5">
                Reporta fallas, recibe soluciones y califica respuestas
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-white/80 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Botón 2: Técnico */}
        <button
          id="btn-modo-tecnico"
          onClick={onSelectTechnician}
          className="group w-full relative overflow-hidden p-5 rounded-2xl bg-slate-900/90 hover:bg-slate-850 active:scale-[0.98] transition-all duration-200 shadow-xl shadow-slate-950/40 border border-slate-800 hover:border-indigo-500/40 text-left flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Wrench className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-white flex items-center gap-2">
                Técnico
                {pendingCount > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                    {pendingCount} pendientes
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Diagnostica problemas y envía soluciones paso a paso
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>

      {/* Quick Summary Pill & Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md text-center shadow-lg"
      >
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mb-1">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          <span>Prototipo con datos locales en memoria</span>
        </div>
        <p className="text-[11px] text-slate-400">
          Total de tickets activos: <span className="font-semibold text-indigo-300">{totalTickets}</span>
        </p>
      </motion.div>
    </div>
  );
};
