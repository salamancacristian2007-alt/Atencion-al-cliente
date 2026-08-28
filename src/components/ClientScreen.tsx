import React, { useState } from 'react';
import {
  Wifi,
  Gauge,
  VolumeX,
  Monitor,
  ShieldAlert,
  Cpu,
  HelpCircle,
  Send,
  PlusCircle,
  ListFilter,
  Check,
  X,
  CheckCircle,
  Clock,
  Sparkles,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Layers,
} from 'lucide-react';
import { ProblemCategory, SolutionFeedback, Ticket } from '../types';
import { StatusBadge } from './StatusBadge';
import { motion, AnimatePresence } from 'motion/react';

interface ClientScreenProps {
  tickets: Ticket[];
  selectedTicketId: string | null;
  onSelectTicket: (ticketId: string) => void;
  onSubmitTicket: (category: ProblemCategory, description: string, clientName: string, device: string) => void;
  onProvideFeedback: (ticketId: string, solutionId: string, feedback: SolutionFeedback, comment?: string) => void;
  onBackToHome: () => void;
}

const CATEGORY_ICONS: Record<ProblemCategory, React.ElementType> = {
  Internet: Wifi,
  'Computador lento': Gauge,
  'Sin sonido': VolumeX,
  Pantalla: Monitor,
  Virus: ShieldAlert,
  Windows: Cpu,
  Otro: HelpCircle,
};

export const ClientScreen: React.FC<ClientScreenProps> = ({
  tickets,
  selectedTicketId,
  onSelectTicket,
  onSubmitTicket,
  onProvideFeedback,
}) => {
  const [viewMode, setViewMode] = useState<'form' | 'list' | 'detail'>(
    selectedTicketId ? 'detail' : 'form'
  );

  // Form states
  const [selectedCategory, setSelectedCategory] = useState<ProblemCategory>('Internet');
  const [description, setDescription] = useState('');
  const [clientName, setClientName] = useState('');
  const [device, setDevice] = useState('');
  const [formSubmittedSuccess, setFormSubmittedSuccess] = useState(false);
  const [feedbackInput, setFeedbackInput] = useState<{ [solId: string]: string }>({});

  const activeTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    onSubmitTicket(
      selectedCategory,
      description.trim(),
      clientName.trim() || 'Cliente',
      device.trim() || 'Computador'
    );

    setFormSubmittedSuccess(true);
    setTimeout(() => {
      setFormSubmittedSuccess(false);
      setViewMode('list');
    }, 1200);

    // Reset form
    setDescription('');
  };

  const categories: ProblemCategory[] = [
    'Internet',
    'Computador lento',
    'Sin sonido',
    'Pantalla',
    'Virus',
    'Windows',
    'Otro',
  ];

  return (
    <div className="p-4 flex flex-col flex-1 pb-16">
      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 mb-4 p-1 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm">
        <button
          id="tab-client-new-problem"
          onClick={() => setViewMode('form')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 ${
            viewMode === 'form'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Reportar Problema</span>
        </button>

        <button
          id="tab-client-my-tickets"
          onClick={() => setViewMode('list')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 relative ${
            viewMode === 'list' || viewMode === 'detail'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <ListFilter className="w-3.5 h-3.5" />
          <span>Mis Reportes ({tickets.length})</span>
          {tickets.some((t) => t.solutions.length > 0 && t.solutions.some((s) => s.feedback === 'none')) && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* VIEW 1: Formulario de Reporte de Problema */}
        {viewMode === 'form' && (
          <motion.div
            key="client-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-xl shadow-slate-950/40">
              <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2 tracking-tight">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                ¿Qué problema tiene tu computador?
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Elige la opción que mejor describa la falla para asignarte un técnico especializado.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Opciones de Problemas requeridas */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Tipo de problema:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((cat) => {
                      const IconComp = CATEGORY_ICONS[cat];
                      const isSelected = selectedCategory === cat;
                      return (
                        <button
                          key={cat}
                          type="button"
                          id={`cat-btn-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                          onClick={() => setSelectedCategory(cat)}
                          className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all duration-200 ${
                            isSelected
                              ? 'bg-indigo-600/20 border-indigo-500/80 text-indigo-200 ring-1 ring-indigo-500/50 shadow-md shadow-indigo-950/40'
                              : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform ${
                              isSelected ? 'bg-indigo-500 text-white shadow-sm' : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            <IconComp className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-semibold leading-tight">{cat}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Nombre del cliente */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tu nombre:
                  </label>
                  <input
                    type="text"
                    id="input-client-name"
                    placeholder="Ej. Juan Pérez"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition placeholder:text-slate-500"
                  />
                </div>

                {/* Dispositivo (opcional) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Equipo o modelo (opcional):
                  </label>
                  <input
                    type="text"
                    id="input-client-device"
                    placeholder="Ej. Laptop HP Pavilion / PC Escritorio"
                    value={device}
                    onChange={(e) => setDevice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition placeholder:text-slate-500"
                  />
                </div>

                {/* Formulario para escribir el problema */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Describe el problema del computador:
                  </label>
                  <textarea
                    id="input-client-description"
                    rows={4}
                    required
                    placeholder="Describe qué ocurre, cuándo empezó o qué mensaje de error aparece..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition resize-none placeholder:text-slate-500"
                  />
                </div>

                {/* Botón Enviar problema */}
                <button
                  type="submit"
                  id="btn-submit-problem"
                  disabled={!description.trim() || formSubmittedSuccess}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all duration-200 ${
                    formSubmittedSuccess
                      ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                      : !description.trim()
                      ? 'bg-slate-800/80 text-slate-500 cursor-not-allowed border border-slate-700/60'
                      : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-indigo-600/30 active:scale-[0.98]'
                  }`}
                >
                  {formSubmittedSuccess ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>¡Problema enviado con éxito!</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Enviar problema</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {/* VIEW 2: Lista de Reportes del Cliente */}
        {viewMode === 'list' && (
          <motion.div
            key="client-list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Historial de reportes
              </h3>
              <span className="text-xs text-slate-400">Toca para ver respuestas</span>
            </div>

            {tickets.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
                <HelpCircle className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-300">No tienes reportes activos</p>
                <p className="text-xs text-slate-400 mt-1 mb-4">
                  Envía un reporte para que un técnico te ayude.
                </p>
                <button
                  onClick={() => setViewMode('form')}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition"
                >
                  Reportar ahora
                </button>
              </div>
            ) : (
              tickets.map((ticket) => {
                const IconComp = CATEGORY_ICONS[ticket.category] || HelpCircle;
                const hasPendingSolutions =
                  ticket.solutions.length > 0 &&
                  ticket.solutions.some((s) => s.feedback === 'none');

                return (
                  <div
                    key={ticket.id}
                    id={`ticket-card-${ticket.id}`}
                    onClick={() => {
                      onSelectTicket(ticket.id);
                      setViewMode('detail');
                    }}
                    className="p-4 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800/90 hover:border-indigo-500/40 cursor-pointer transition-all shadow-md shadow-slate-950/30 group"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white block">
                            {ticket.category}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {ticket.createdAt} • ID: {ticket.id}
                          </span>
                        </div>
                      </div>
                      <StatusBadge status={ticket.status} size="sm" />
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 mb-3 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60">
                      {ticket.description}
                    </p>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
                      <div className="flex items-center gap-2 text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-indigo-400" />
                          {ticket.solutions.length} solución
                          {ticket.solutions.length !== 1 ? 'es' : ''}
                        </span>
                        {hasPendingSolutions && (
                          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                            • ¡Respuesta nueva!
                          </span>
                        )}
                      </div>
                      <span className="text-indigo-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 font-semibold text-[11px]">
                        Ver detalle <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </motion.div>
        )}

        {/* VIEW 3: Detalle del Reporte del Cliente con Soluciones y Feedback */}
        {viewMode === 'detail' && activeTicket && (
          <motion.div
            key="client-detail"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <button
              onClick={() => setViewMode('list')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-semibold mb-1 transition"
            >
              ← Volver a mis reportes
            </button>

            {/* Cabecera del Reporte y Estado */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-xl shadow-slate-950/30">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-white tracking-tight">{activeTicket.category}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 font-mono">
                      {activeTicket.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Reportado por <span className="text-slate-300 font-medium">{activeTicket.clientName}</span> • {activeTicket.createdAt}
                  </p>
                </div>
                <StatusBadge status={activeTicket.status} size="md" />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Tu problema reportado:
                </span>
                <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {activeTicket.description}
                </p>
              </div>

              {/* Mensaje / Diagnóstico del Técnico si existe */}
              {activeTicket.technicianResponse && (
                <div className="mt-3 p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-800/40">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300 mb-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Diagnóstico del Técnico:
                  </div>
                  <p className="text-xs text-indigo-100 leading-relaxed">
                    {activeTicket.technicianResponse}
                  </p>
                </div>
              )}
            </div>

            {/* Sección: Respuestas y Soluciones enviadas por el técnico */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  Soluciones enviadas por el técnico ({activeTicket.solutions.length})
                </h3>
              </div>

              {activeTicket.solutions.length === 0 ? (
                <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 text-center shadow-md">
                  <Clock className="w-8 h-8 text-amber-400/80 mx-auto mb-2 animate-pulse" />
                  <h4 className="text-xs font-bold text-white">Aún no hay soluciones enviadas</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                    El técnico está analizando tu caso. Puedes ingresar como Técnico en la app para responder y enviar soluciones paso a paso.
                  </p>
                </div>
              ) : (
                activeTicket.solutions.map((sol, index) => (
                  <div
                    key={sol.id}
                    id={`solution-card-${sol.id}`}
                    className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-xl shadow-slate-950/30 space-y-3"
                  >
                    {/* Título de la solución */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                          Solución #{index + 1}
                        </span>
                        <h4 className="text-sm font-bold text-white mt-0.5 tracking-tight">{sol.title}</h4>
                      </div>
                      <span className="text-[10px] text-slate-400">{sol.createdAt}</span>
                    </div>

                    {/* Descripción de la solución */}
                    <p className="text-xs text-slate-300 leading-relaxed">{sol.description}</p>

                    {/* Pasos para realizarla */}
                    {sol.steps && sol.steps.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2.5">
                        <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                          Pasos a seguir:
                        </span>
                        <ol className="space-y-2">
                          {sol.steps.map((step, sIdx) => (
                            <li key={sIdx} className="text-xs text-slate-300 flex items-start gap-2.5">
                              <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                                {sIdx + 1}
                              </span>
                              <span className="leading-snug">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {/* Indicador de si la solución funcionó o no */}
                    <div className="pt-2 border-t border-slate-800">
                      <div className="text-[11px] font-semibold text-slate-400 mb-2">
                        ¿Esta solución resolvió el problema?
                      </div>

                      {sol.feedback === 'none' ? (
                        <div className="flex items-center gap-2">
                          <button
                            id={`btn-feedback-worked-${sol.id}`}
                            onClick={() => onProvideFeedback(activeTicket.id, sol.id, 'worked')}
                            className="flex-1 py-2 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-sm"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>Sí, funcionó 👍</span>
                          </button>
                          <button
                            id={`btn-feedback-not-worked-${sol.id}`}
                            onClick={() => onProvideFeedback(activeTicket.id, sol.id, 'did_not_work')}
                            className="flex-1 py-2 px-3 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-sm"
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                            <span>No funcionó 👎</span>
                          </button>
                        </div>
                      ) : (
                        <div
                          className={`p-3 rounded-xl flex items-center justify-between text-xs ${
                            sol.feedback === 'worked'
                              ? 'bg-emerald-950/40 border border-emerald-800/60 text-emerald-200'
                              : 'bg-rose-950/40 border border-rose-800/60 text-rose-200'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {sol.feedback === 'worked' ? (
                              <CheckCircle className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <X className="w-4 h-4 text-rose-400" />
                            )}
                            <span className="font-semibold">
                              {sol.feedback === 'worked'
                                ? 'Indicaste que esta solución SÍ funcionó'
                                : 'Indicaste que esta solución NO funcionó'}
                            </span>
                          </div>
                          <button
                            onClick={() => onProvideFeedback(activeTicket.id, sol.id, 'none')}
                            className="text-[10px] text-slate-400 hover:text-white underline font-medium"
                          >
                            Cambiar
                          </button>
                        </div>
                      )}

                      {sol.feedbackComment && (
                        <p className="text-[11px] text-slate-400 italic mt-2 px-1">
                          Nota del cliente: "{sol.feedbackComment}"
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
