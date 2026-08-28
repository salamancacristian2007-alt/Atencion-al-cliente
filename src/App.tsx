/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppScreen, ProblemCategory, SolutionFeedback, Ticket, TicketStatus } from './types';
import { INITIAL_TICKETS } from './data/initialData';
import { AndroidPhoneFrame } from './components/AndroidPhoneFrame';
import { HomeScreen } from './components/HomeScreen';
import { ClientScreen } from './components/ClientScreen';
import { TechnicianScreen } from './components/TechnicianScreen';
import { KotlinCodeViewerModal } from './components/KotlinCodeViewerModal';

const STORAGE_KEY = 'soporte_tecnico_tickets_v1';

export default function App() {
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore JSON parse error
    }
    return INITIAL_TICKETS;
  });

  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [isExpandedView, setIsExpandedView] = useState(false);
  const [isKotlinModalOpen, setIsKotlinModalOpen] = useState(false);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
    } catch {
      // ignore
    }
  }, [tickets]);

  // Handle Client submit new problem
  const handleSubmitTicket = (
    category: ProblemCategory,
    description: string,
    clientName: string,
    device: string
  ) => {
    const newTicket: Ticket = {
      id: `TICK-${Math.floor(100 + Math.random() * 900)}`,
      clientName: clientName || 'Cliente',
      clientDevice: device || 'Computador',
      category,
      description,
      createdAt: 'Hace un momento',
      status: 'Pendiente',
      solutions: [],
    };

    setTickets((prev) => [newTicket, ...prev]);
    setSelectedTicketId(newTicket.id);
    setCurrentScreen('client');
  };

  // Handle Client provide feedback on solution
  const handleProvideFeedback = (
    ticketId: string,
    solutionId: string,
    feedback: SolutionFeedback,
    comment?: string
  ) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        const updatedSolutions = t.solutions.map((s) => {
          if (s.id !== solutionId) return s;
          return { ...s, feedback, feedbackComment: comment || s.feedbackComment };
        });

        // If client confirmed solution worked, automatically suggest or mark as 'Solucionado'
        const newStatus: TicketStatus =
          feedback === 'worked' ? 'Solucionado' : t.status;

        return {
          ...t,
          solutions: updatedSolutions,
          status: newStatus,
        };
      })
    );
  };

  // Handle Technician add a new solution
  const handleAddSolution = (
    ticketId: string,
    technicianResponse: string,
    solutionTitle: string,
    solutionDesc: string,
    steps: string[]
  ) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        const newSolution = {
          id: `SOL-${Date.now().toString().slice(-4)}`,
          title: solutionTitle,
          description: solutionDesc,
          steps: steps.filter((s) => s.trim().length > 0),
          createdAt: 'Hace un momento',
          feedback: 'none' as SolutionFeedback,
        };

        return {
          ...t,
          technicianResponse: technicianResponse || t.technicianResponse,
          status: t.status === 'Pendiente' ? 'En diagnóstico' : t.status,
          solutions: [...t.solutions, newSolution],
        };
      })
    );
  };

  // Handle Technician update status
  const handleUpdateStatus = (ticketId: string, newStatus: TicketStatus) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
    );
  };

  // Reset to initial mock data
  const handleResetData = () => {
    if (window.confirm('¿Deseas restablecer los datos de prueba iniciales?')) {
      setTickets(INITIAL_TICKETS);
      setSelectedTicketId(null);
      setCurrentScreen('home');
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }
  };

  // Navigation handlers
  const handleNavigateHome = () => {
    setCurrentScreen('home');
    setSelectedTicketId(null);
  };

  const handleNavigateBack = () => {
    if (currentScreen === 'client_detail') {
      setCurrentScreen('client');
    } else if (currentScreen === 'technician_detail') {
      setSelectedTicketId(null);
      setCurrentScreen('technician');
    } else {
      setCurrentScreen('home');
      setSelectedTicketId(null);
    }
  };

  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'home':
        return 'Soporte Técnico';
      case 'client':
        return 'Modo Cliente';
      case 'client_detail':
        return 'Detalle del Reporte';
      case 'technician':
        return 'Modo Técnico';
      case 'technician_detail':
        return 'Atención Técnica';
      default:
        return 'Soporte Técnico';
    }
  };

  const pendingCount = tickets.filter((t) => t.status === 'Pendiente').length;

  return (
    <AndroidPhoneFrame
      currentScreen={currentScreen}
      onNavigateHome={handleNavigateHome}
      onNavigateBack={handleNavigateBack}
      title={getScreenTitle()}
      isExpandedView={isExpandedView}
      onToggleExpandedView={() => setIsExpandedView(!isExpandedView)}
      onResetData={handleResetData}
      onOpenKotlinModal={() => setIsKotlinModalOpen(true)}
    >
      {/* SCREEN 1: Home Screen */}
      {currentScreen === 'home' && (
        <HomeScreen
          onSelectClient={() => {
            setCurrentScreen('client');
            setSelectedTicketId(null);
          }}
          onSelectTechnician={() => {
            setCurrentScreen('technician');
            setSelectedTicketId(null);
          }}
          totalTickets={tickets.length}
          pendingCount={pendingCount}
        />
      )}

      {/* SCREEN 2: Modo Cliente */}
      {(currentScreen === 'client' || currentScreen === 'client_detail') && (
        <ClientScreen
          tickets={tickets}
          selectedTicketId={selectedTicketId}
          onSelectTicket={(id) => {
            setSelectedTicketId(id);
            setCurrentScreen('client_detail');
          }}
          onSubmitTicket={handleSubmitTicket}
          onProvideFeedback={handleProvideFeedback}
          onBackToHome={handleNavigateHome}
        />
      )}

      {/* SCREEN 3: Modo Técnico */}
      {(currentScreen === 'technician' || currentScreen === 'technician_detail') && (
        <TechnicianScreen
          tickets={tickets}
          selectedTicketId={selectedTicketId}
          onSelectTicket={(id) => {
            setSelectedTicketId(id || null);
            setCurrentScreen(id ? 'technician_detail' : 'technician');
          }}
          onAddSolution={handleAddSolution}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {/* Kotlin Code Viewer Modal */}
      <KotlinCodeViewerModal
        isOpen={isKotlinModalOpen}
        onClose={() => setIsKotlinModalOpen(false)}
      />
    </AndroidPhoneFrame>
  );
}
