import React, { useState } from 'react';
import {
  Wrench,
  CheckCircle2,
  Clock,
  Activity,
  Plus,
  Trash2,
  Send,
  Check,
  Search,
  Filter,
  User,
  Laptop,
  ChevronRight,
  Layers,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
} from 'lucide-react';
import { Ticket, TicketStatus } from '../types';
import { StatusBadge } from './StatusBadge';
import { motion, AnimatePresence } from 'motion/react';

interface TechnicianScreenProps {
  tickets: Ticket[];
  selectedTicketId: string | null;
  onSelectTicket: (ticketId: string) => void;
  onAddSolution: (
    ticketId: string,
    technicianResponse: string,
    solutionTitle: string,
    solutionDesc: string,
    steps: string[]
  ) => void;
  onUpdateStatus: (ticketId: string, newStatus: TicketStatus) => void;
}

export const TechnicianScreen: React.FC<TechnicianScreenProps> = ({
  tickets,
  selectedTicketId,
  onSelectTicket,
  onAddSolution,
  onUpdateStatus,
}) => {
  const [filterStatus, setFilterStatus] = useState<'Todos' | TicketStatus>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewSolutionForm, setShowNewSolutionForm] = useState(false);

  // Form states for adding a solution
  const [techResponse, setTechResponse] = useState('');
  const [solTitle, setSolTitle] = useState('');
  const [solDescription, setSolDescription] = useState('');
  const [steps, setSteps] = useState<string[]>(['', '']);
  const [solutionSentSuccess, setSolutionSentSuccess] = useState(false);

  const activeTicket = tickets.find((t) => t.id === selectedTicketId);

  const filteredTickets = tickets.filter((ticket) => {
    const matchesFilter = filterStatus === 'Todos' || ticket.status === filterStatus;
    const matchesSearch =
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleAddStep = () => {
    setSteps([...steps, '']);
  };

  const handleRemoveStep = (indexToRemove: number) => {
    if (steps.length <= 1) return;
    setSteps(steps.filter((_, idx) => idx !== indexToRemove));
  };

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const handleSendSolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket || !solTitle.trim() || !solDescription.trim()) return;

    const validSteps = steps.filter((s) => s.trim().length > 0);

    onAddSolution(
      activeTicket.id,
      techResponse.trim(),
      solTitle.trim(),
      solDescription.trim(),
      validSteps.length > 0 ? validSteps : ['Seguir las instrucciones indicadas en la descripción.']
    );

    setSolutionSentSuccess(true);
    setTimeout(() => {
      setSolutionSentSuccess(false);
      setShowNewSolutionForm(false);
      setSolTitle('');
      setSolDescription('');
      setSteps(['', '']);
    }, 1200);
  };

  return (
    <div className="p-4 flex flex-col flex-1 pb-16">
      <AnimatePresence mode="wait">
        {/* VIEW 1: Lista de tickets enviados por clientes */}
        {!activeTicket ? (
          <motion.div
            key="tech-list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {/* Buscador y Filtros */}
            <div className="space-y-2.5">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  id="tech-search-input"
                  placeholder="Buscar por cliente, categoría o falla..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
                />
              </div>

              {/* Filtros de estado */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-xs">
                {(['Todos', 'Pendiente', 'En diagnóstico', 'Solucionado'] as const).map((st) => (
                  <button
                    key={st}
                    id={`filter-btn-${st.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => setFilterStatus(st)}
                    className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all duration-200 ${
                      filterStatus === st
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-slate-900/90 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {st} {st !== 'Todos' && `(${tickets.filter((t) => t.status === st).length})`}
                  </button>
                ))}
              </div>
            </div>

            {/* Listado de problemas */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-semibold uppercase tracking-wider">
                <span>Problemas de Clientes ({filteredTickets.length})</span>
                <span>Selecciona para atender</span>
              </div>

              {filteredTickets.length === 0 ? (
                <div className="text-center py-12 rounded-2xl bg-slate-900/90 border border-slate-800 p-4 shadow-lg">
                  <Wrench className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-300">No hay tickets en este filtro</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Cambia de filtro o crea un nuevo problema desde el modo Cliente.
                  </p>
                </div>
              ) : (
                filteredTickets.map((ticket) => {
                  return (
                    <div
                      key={ticket.id}
                      id={`tech-ticket-card-${ticket.id}`}
                      onClick={() => onSelectTicket(ticket.id)}
                      className="p-4 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800/90 hover:border-indigo-500/40 cursor-pointer transition-all shadow-md shadow-slate-950/30 group"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                            {ticket.category}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-400 font-mono">
                            {ticket.id}
                          </span>
                        </div>
                        <StatusBadge status={ticket.status} size="sm" />
                      </div>

                      <p className="text-xs text-slate-300 line-clamp-2 mb-3 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60">
                        {ticket.description}
                      </p>

                      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
                        <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                          <span className="flex items-center gap-1 text-slate-300">
                            <User className="w-3 h-3 text-indigo-400" />
                            {ticket.clientName}
                          </span>
                          <span>•</span>
                          <span>{ticket.createdAt}</span>
                        </div>
                        <span className="text-indigo-400 font-semibold text-[11px] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                          Atender <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        ) : (
          /* VIEW 2: Detalle del problema seleccionado para el Técnico */
          <motion.div
            key="tech-detail"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {/* Botón Volver al listado */}
            <button
              id="btn-tech-back-to-list"
              onClick={() => {
                onSelectTicket('');
                setShowNewSolutionForm(false);
              }}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-semibold transition"
            >
              ← Volver al listado de problemas
            </button>

            {/* Tarjeta de Información del Problema */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-xl shadow-slate-950/30 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-white tracking-tight">{activeTicket.category}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 font-mono">
                      {activeTicket.id}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-slate-300 font-medium">
                      <User className="w-3.5 h-3.5 text-indigo-400" />
                      {activeTicket.clientName}
                    </span>
                    {activeTicket.clientDevice && (
                      <span className="flex items-center gap-1">
                        <Laptop className="w-3.5 h-3.5 text-slate-500" />
                        {activeTicket.clientDevice}
                      </span>
                    )}
                    <span>• {activeTicket.createdAt}</span>
                  </div>
                </div>
                <StatusBadge status={activeTicket.status} size="md" />
              </div>

              {/* Descripción del cliente */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Descripción del problema reportado:
                </span>
                <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {activeTicket.description}
                </p>
              </div>

              {/* Botones de Actualización Rápida de Estado */}
              <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400 font-semibold">Estado actual:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    id="btn-status-diagnostico"
                    onClick={() => onUpdateStatus(activeTicket.id, 'En diagnóstico')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition active:scale-95 ${
                      activeTicket.status === 'En diagnóstico'
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
                    }`}
                  >
                    En diagnóstico
                  </button>

                  {/* Botón requerido: "Marcar como solucionado" */}
                  <button
                    id="btn-marcar-solucionado"
                    onClick={() => onUpdateStatus(activeTicket.id, 'Solucionado')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 ${
                      activeTicket.status === 'Solucionado'
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                        : 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Marcar como solucionado</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Soluciones Existentes enviadas al cliente */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  Soluciones enviadas ({activeTicket.solutions.length})
                </h4>

                {!showNewSolutionForm && (
                  <button
                    id="btn-toggle-add-solution"
                    onClick={() => setShowNewSolutionForm(true)}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Nueva Solución</span>
                  </button>
                )}
              </div>

              {/* Formulario para Enviar Solución con Título, Descripción y Pasos */}
              {showNewSolutionForm && (
                <div className="p-4 rounded-2xl bg-slate-900/95 border border-indigo-500/50 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-bold text-white flex items-center gap-2 tracking-tight">
                      <Wrench className="w-4 h-4 text-indigo-400" />
                      Redactar Solución para el Cliente
                    </h5>
                    <button
                      onClick={() => setShowNewSolutionForm(false)}
                      className="text-xs text-slate-400 hover:text-white transition"
                    >
                      Cancelar
                    </button>
                  </div>

                  <form onSubmit={handleSendSolution} className="space-y-3">
                    {/* Campo para escribir respuesta/diagnóstico general */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Respuesta o Diagnóstico técnico para el cliente:
                      </label>
                      <textarea
                        id="input-tech-response"
                        rows={2}
                        placeholder="Ej. Hemos analizado tu caso. El fallo se debe a un controlador desactualizado..."
                        value={techResponse}
                        onChange={(e) => setTechResponse(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition resize-none placeholder:text-slate-500"
                      />
                    </div>

                    {/* Título de la solución */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Título de la solución: <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        id="input-solution-title"
                        placeholder="Ej. Reinstalación del controlador Wi-Fi"
                        value={solTitle}
                        onChange={(e) => setSolTitle(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition placeholder:text-slate-500"
                      />
                    </div>

                    {/* Descripción de la solución */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Descripción de la solución: <span className="text-rose-400">*</span>
                      </label>
                      <textarea
                        required
                        id="input-solution-description"
                        rows={2}
                        placeholder="Explica brevemente en qué consiste este método..."
                        value={solDescription}
                        onChange={(e) => setSolDescription(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition resize-none placeholder:text-slate-500"
                      />
                    </div>

                    {/* Pasos para realizarla */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[11px] font-semibold text-slate-300">
                          Pasos para realizarla:
                        </label>
                        <button
                          type="button"
                          id="btn-add-step"
                          onClick={handleAddStep}
                          className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Agregar paso</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {steps.map((step, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <input
                              type="text"
                              id={`input-step-${idx}`}
                              placeholder={`Paso ${idx + 1}: Ej. Abrir el Administrador de Dispositivos...`}
                              value={step}
                              onChange={(e) => handleStepChange(idx, e.target.value)}
                              className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 transition placeholder:text-slate-500"
                            />
                            {steps.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveStep(idx)}
                                className="p-1 text-slate-500 hover:text-rose-400 transition"
                                title="Eliminar paso"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Botón Enviar solución */}
                    <button
                      type="submit"
                      id="btn-submit-solution"
                      disabled={!solTitle.trim() || !solDescription.trim() || solutionSentSuccess}
                      className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
                        solutionSentSuccess
                          ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                          : !solTitle.trim() || !solDescription.trim()
                          ? 'bg-slate-800/80 text-slate-500 cursor-not-allowed border border-slate-700/60'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 active:scale-95'
                      }`}
                    >
                      {solutionSentSuccess ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>¡Solución enviada al cliente!</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Enviar solución</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* Lista de soluciones ya agregadas */}
              {activeTicket.solutions.length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-dashed border-slate-800 text-center">
                  <p className="text-xs text-slate-400">
                    No has enviado soluciones a este cliente todavía.
                  </p>
                  {!showNewSolutionForm && (
                    <button
                      onClick={() => setShowNewSolutionForm(true)}
                      className="mt-2 text-xs text-indigo-400 hover:underline font-semibold"
                    >
                      + Redactar primera solución
                    </button>
                  )}
                </div>
              ) : (
                activeTicket.solutions.map((sol, index) => (
                  <div
                    key={sol.id}
                    className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-xl shadow-slate-950/30 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                          Solución #{index + 1}
                        </span>
                        <h5 className="text-xs font-bold text-white mt-0.5 tracking-tight">{sol.title}</h5>
                      </div>
                      <span className="text-[10px] text-slate-400">{sol.createdAt}</span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{sol.description}</p>

                    {/* Pasos */}
                    {sol.steps && sol.steps.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Pasos configurados:
                        </span>
                        <ol className="space-y-1.5">
                          {sol.steps.map((step, sIdx) => (
                            <li key={sIdx} className="text-xs text-slate-300 flex items-start gap-2">
                              <span className="w-4 h-4 rounded-full bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                                {sIdx + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {/* Estado del feedback del cliente */}
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-400">Respuesta del cliente:</span>
                      {sol.feedback === 'none' && (
                        <span className="text-[11px] text-amber-400/90 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Esperando confirmación del cliente
                        </span>
                      )}
                      {sol.feedback === 'worked' && (
                        <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1 bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-800/40">
                          <ThumbsUp className="w-3 h-3" />
                          ¡El cliente confirmó que SÍ funcionó!
                        </span>
                      )}
                      {sol.feedback === 'did_not_work' && (
                        <span className="text-[11px] text-rose-400 font-bold flex items-center gap-1 bg-rose-950/40 px-2.5 py-0.5 rounded-full border border-rose-800/40">
                          <ThumbsDown className="w-3 h-3" />
                          El cliente indicó que no resolvió la falla
                        </span>
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
