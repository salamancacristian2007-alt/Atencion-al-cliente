export type ProblemCategory =
  | 'Internet'
  | 'Computador lento'
  | 'Sin sonido'
  | 'Pantalla'
  | 'Virus'
  | 'Windows'
  | 'Otro';

export type TicketStatus = 'Pendiente' | 'En diagnóstico' | 'Solucionado';

export type SolutionFeedback = 'none' | 'worked' | 'did_not_work';

export interface Solution {
  id: string;
  title: string;
  description: string;
  steps: string[];
  createdAt: string;
  feedback: SolutionFeedback;
  feedbackComment?: string;
}

export interface Ticket {
  id: string;
  clientName: string;
  clientDevice?: string;
  category: ProblemCategory;
  description: string;
  createdAt: string;
  status: TicketStatus;
  technicianResponse?: string;
  solutions: Solution[];
}

export type AppScreen =
  | 'home'
  | 'client'
  | 'client_detail'
  | 'technician'
  | 'technician_detail';
