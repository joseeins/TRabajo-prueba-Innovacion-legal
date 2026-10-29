export type MateriaLegal = 'civil' | 'laboral' | 'penal' | 'administrativa' | 'otra';

export interface UserSession {
  id: string;
  nombre: string;
  email: string;
  cargo: string;
  colegiatura?: string;
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
  id: string;
  titulo: string;
  cliente: string;
  materia: MateriaLegal;
  tipoAsunto: string;
  numeroProceso: string | null;
  responsable: string;
  bitacora: string;
  estado: 'Abierto';
  fechaApertura: string;
  fechaAperturaISO: string;
  creador: string | null;
  creadorEmail: string | null;
}
