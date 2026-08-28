import { Ticket } from '../types';

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'TICK-101',
    clientName: 'Carlos Mendoza',
    clientDevice: 'Laptop Lenovo ThinkPad',
    category: 'Internet',
    description: 'Mi computador no detecta las redes Wi-Fi desde esta mañana después de una actualización. El icono de red muestra un globo terráqueo con una cruz.',
    createdAt: 'Hace 2 horas',
    status: 'En diagnóstico',
    technicianResponse: 'Hola Carlos, hemos revisado el caso. Parece un desajuste en el controlador de red tras el reinicio.',
    solutions: [
      {
        id: 'SOL-1',
        title: 'Reinicio del servicio WLAN y adaptador de red',
        description: 'Vamos a reiniciar los servicios de red de Windows para restablecer la búsqueda de antenas Wi-Fi.',
        steps: [
          'Presiona las teclas Windows + R, escribe "services.msc" y presiona Enter.',
          'Busca el servicio llamado "Configuración automática de WLAN".',
          'Haz clic derecho sobre él y selecciona "Reiniciar".',
          'Verifica si el icono de Wi-Fi vuelve a buscar redes disponibles.'
        ],
        createdAt: 'Hace 1 hora',
        feedback: 'did_not_work',
        feedbackComment: 'El servicio se reinició pero sigue sin aparecer la lista de redes.'
      },
      {
        id: 'SOL-2',
        title: 'Reinstalación del controlador desde el Administrador de Dispositivos',
        description: 'Desinstalar el controlador corrupto para que Windows lo reconozca limpiamente al reiniciar.',
        steps: [
          'Haz clic derecho en el botón de Inicio y selecciona "Administrador de dispositivos".',
          'Despliega la sección "Adaptadores de red".',
          'Haz clic derecho en tu tarjeta Wi-Fi (ej. Intel / Realtek) y pulsa "Desinstalar dispositivo".',
          'Reinicia el computador por completo. Windows reinstalará el driver automáticamente.'
        ],
        createdAt: 'Hace 30 min',
        feedback: 'worked',
        feedbackComment: '¡Excelente! Al reiniciar el equipo reconoció de nuevo mi red Wi-Fi de inmediato.'
      }
    ]
  },
  {
    id: 'TICK-102',
    clientName: 'Mariana Silva',
    clientDevice: 'PC de escritorio Asus',
    category: 'Computador lento',
    description: 'El computador tarda más de 5 minutos en arrancar y al abrir el navegador el disco se queda al 100% de uso en el Administrador de tareas.',
    createdAt: 'Hace 4 horas',
    status: 'Pendiente',
    technicianResponse: '',
    solutions: []
  },
  {
    id: 'TICK-103',
    clientName: 'Alejandro Gómez',
    clientDevice: 'Laptop HP Pavilion',
    category: 'Sin sonido',
    description: 'No sale audio por los altavoces integrados ni por los audífonos. El icono de volumen tiene una "X" roja fija.',
    createdAt: 'Ayer',
    status: 'Solucionado',
    technicianResponse: 'Problema resuelto tras restablecer los servicios de Audio de Windows y habilitar el dispositivo en el panel de control de sonido.',
    solutions: [
      {
        id: 'SOL-3',
        title: 'Habilitar el dispositivo de salida predeterminado',
        description: 'Restaurar la salida de audio deshabilitada en el panel de configuración clásica de sonido.',
        steps: [
          'Presiona Win + R y ejecuta "mmsys.cpl".',
          'En la pestaña Reproducción, haz clic derecho en el fondo blanco y marca "Mostrar dispositivos deshabilitados".',
          'Haz clic derecho en Altavoces y elige "Habilitar" y luego "Establecer como predeterminado".',
          'Aplica los cambios y prueba el audio.'
        ],
        createdAt: 'Ayer',
        feedback: 'worked'
      }
    ]
  }
];

export const PROBLEM_CATEGORIES: {
  category: import('../types').ProblemCategory;
  iconName: string;
  color: string;
  description: string;
}[] = [
  { category: 'Internet', iconName: 'Wifi', color: 'blue', description: 'Problemas de Wi-Fi, Ethernet o conexión' },
  { category: 'Computador lento', iconName: 'Gauge', color: 'amber', description: 'Arranque lento, congelamiento o alto uso de CPU/RAM' },
  { category: 'Sin sonido', iconName: 'VolumeX', color: 'rose', description: 'No hay audio en altavoces o auriculares' },
  { category: 'Pantalla', iconName: 'Monitor', color: 'purple', description: 'Parpadeo, resolución incorrecta o pantalla negra' },
  { category: 'Virus', iconName: 'ShieldAlert', color: 'red', description: 'Publicidad invasiva, malware o archivos bloqueados' },
  { category: 'Windows', iconName: 'Cpu', color: 'indigo', description: 'Actualizaciones fallidas, errores de pantalla azul o licencias' },
  { category: 'Otro', iconName: 'HelpCircle', color: 'slate', description: 'Otros fallos de hardware o periféricos' },
];
