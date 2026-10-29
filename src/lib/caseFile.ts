/**
 * Dominio y reglas de negocio para el Expediente Digital (Legaltech MVP)
 */

export type MateriaLegal = 'civil' | 'laboral' | 'penal' | 'administrativa' | 'otra';

export interface UserSession {
  id: string;
  nombre: string;
  email: string;
  cargo: string;
}

export interface ExpedienteFormData {
  titulo: string;
  cliente: string;
  materia: MateriaLegal | '';
  tipoAsunto: string;
  numeroProceso: string;
  responsable: string;
  bitacora: string;
}

export interface Expediente {
  id: string; // UUID único interno generado por el sistema
  titulo: string;
  cliente: string;
  materia: MateriaLegal;
  tipoAsunto: string;
  numeroProceso: string | null; // Opcional, puede no existir proceso judicial
  responsable: string;
  bitacora: string;
  estado: 'Abierto';
  fechaApertura: string; // Fecha legible en español
  fechaAperturaISO: string;
  creador: string | null; // Solo si hay sesión autenticada, de lo contrario null
  creadorEmail: string | null;
}

export interface ValidationErrors {
  titulo?: string;
  cliente?: string;
  materia?: string;
  responsable?: string;
  general?: string;
}

export const MATERIAS_LEGALES: { value: MateriaLegal; label: string; icon: string; description: string }[] = [
  { value: 'civil', label: 'Civil', icon: 'Scale', description: 'Contratos, daños, obligaciones y propiedad' },
  { value: 'laboral', label: 'Laboral', icon: 'Briefcase', description: 'Conflictos individuales, despidos y seguridad social' },
  { value: 'penal', label: 'Penal', icon: 'ShieldAlert', description: 'Defensa, querellas e investigación penal' },
  { value: 'administrativa', label: 'Administrativa', icon: 'Landmark', description: 'Procedimientos sancionatorios y contratación pública' },
  { value: 'otra', label: 'Otra', icon: 'FileText', description: 'Constitucional, tributario, familia o arbitraje' },
];

/**
 * Valida los datos del formulario de nuevo expediente conforme a las reglas:
 * 1. No se puede crear sin título, cliente, materia y responsable.
 * 2. Los campos obligatorios deben tener texto real (no solo espacios en blanco).
 * 3. Número de proceso es opcional.
 */
export function validateExpedienteForm(data: ExpedienteFormData): { isValid: boolean; errors: ValidationErrors } {
  const errors: ValidationErrors = {};

  const tituloTrim = (data.titulo || '').trim();
  if (!tituloTrim) {
    errors.titulo = 'El nombre o título del caso es obligatorio para identificar el asunto.';
  } else if (tituloTrim.length < 3) {
    errors.titulo = 'El título debe tener al menos 3 caracteres.';
  }

  const clienteTrim = (data.cliente || '').trim();
  if (!clienteTrim) {
    errors.cliente = 'El nombre del cliente es obligatorio.';
  } else if (clienteTrim.length < 2) {
    errors.cliente = 'Indique un nombre de cliente válido.';
  }

  if (!data.materia) {
    errors.materia = 'Debe seleccionar la materia legal correspondiente.';
  } else {
    const validMaterias: MateriaLegal[] = ['civil', 'laboral', 'penal', 'administrativa', 'otra'];
    if (!validMaterias.includes(data.materia as MateriaLegal)) {
      errors.materia = 'Materia seleccionada no válida.';
    }
  }

  const responsableTrim = (data.responsable || '').trim();
  if (!responsableTrim) {
    errors.responsable = 'Debe ingresar el profesional o abogado responsable del expediente.';
  } else if (responsableTrim.length < 2) {
    errors.responsable = 'Indique un nombre de responsable válido.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Generador de UUID seguro v4 independiente para evitar contadores manuales
 */
export function generateInternalUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback seguro compatible
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Formatea una fecha a representación legal en español
 */
export function formatFechaApertura(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

/**
 * Crea un expediente aplicando todas las reglas de negocio de la historia 5.2 y 5.3:
 * - Identificador interno automático tipo UUID (no editable, no contador manual).
 * - Fecha de apertura registrada al momento de la creación.
 * - Estado inicial 'Abierto'.
 * - Creador: únicamente registrado si existe sesión autenticada. Sin sesión, queda null.
 * - Número de proceso: si está vacío o solo espacios, se almacena como null.
 */
export function createExpediente(
  data: ExpedienteFormData,
  sessionUser: UserSession | null,
  simulatedFailure: boolean = false
): Expediente {
  if (simulatedFailure) {
    throw new Error('Error al conectar con la base de datos o servidor. No se pudo guardar el expediente.');
  }

  const validation = validateExpedienteForm(data);
  if (!validation.isValid) {
    const firstMsg = Object.values(validation.errors)[0] || 'Datos incompletos';
    throw new Error(`Validación fallida: ${firstMsg}`);
  }

  const now = new Date();
  const id = generateInternalUUID();
  const numProcTrim = (data.numeroProceso || '').trim();

  return {
    id,
    titulo: data.titulo.trim(),
    cliente: data.cliente.trim(),
    materia: data.materia as MateriaLegal,
    tipoAsunto: (data.tipoAsunto || '').trim(),
    numeroProceso: numProcTrim.length > 0 ? numProcTrim : null,
    responsable: data.responsable.trim(),
    bitacora: (data.bitacora || '').trim(),
    estado: 'Abierto',
    fechaApertura: formatFechaApertura(now),
    fechaAperturaISO: now.toISOString(),
    creador: sessionUser ? sessionUser.nombre : null,
    creadorEmail: sessionUser ? sessionUser.email : null,
  };
}
