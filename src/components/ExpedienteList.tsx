import React, { useState } from 'react';
import {
  Search,
  Filter,
  PlusCircle,
  FolderOpen,
  Calendar,
  User,
  Shield,
  Scale,
  Briefcase,
  ShieldAlert,
  Landmark,
  FileText,
  ChevronRight,
  Hash,
} from 'lucide-react';
import type { Expediente, MateriaLegal } from '../types';

interface ExpedienteListProps {
  expedientes: Expediente[];
  onSelectExpediente: (expediente: Expediente) => void;
  onNewExpediente: () => void;
}

export const ExpedienteList: React.FC<ExpedienteListProps> = ({
  expedientes,
  onSelectExpediente,
  onNewExpediente,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMateria, setSelectedMateria] = useState<string>('todas');

  const filtered = expedientes.filter((exp) => {
    const matchesSearch =
      exp.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (exp.numeroProceso && exp.numeroProceso.toLowerCase().includes(searchTerm.toLowerCase())) ||
      exp.responsable.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMateria =
      selectedMateria === 'todas' || exp.materia === selectedMateria;

    return matchesSearch && matchesMateria;
  });

  const getMateriaBadge = (materia: MateriaLegal) => {
    switch (materia) {
      case 'civil':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'laboral':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'penal':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'administrativa':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Encabezado y Acción Principal */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
              Despacho Jurídico
            </span>
            <span className="text-xs text-slate-500 font-medium">Gestión Centralizada</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
            Expedientes Digitales
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Consulta y centraliza los expedientes jurídicos registrados en el despacho.
          </p>
        </div>

        <button
          onClick={onNewExpediente}
          className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-all shadow-xs cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-amber-400" />
          <span>Nuevo expediente</span>
        </button>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Buscador */}
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar por título, cliente, responsable, UUID o número de proceso..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
          />
        </div>

        {/* Filtro por Materia */}
        <div className="relative">
          <select
            value={selectedMateria}
            onChange={(e) => setSelectedMateria(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
          >
            <option value="todas">Todas las materias ({expedientes.length})</option>
            <option value="civil">Civil</option>
            <option value="laboral">Laboral</option>
            <option value="penal">Penal</option>
            <option value="administrativa">Administrativa</option>
            <option value="otra">Otra</option>
          </select>
        </div>
      </div>

      {/* Lista de Expedientes */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No se encontraron expedientes</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6">
            {searchTerm || selectedMateria !== 'todas'
              ? 'Prueba modificando los criterios de búsqueda o el filtro de materia.'
              : 'Aún no se ha registrado ningún expediente en el sistema.'}
          </p>
          <button
            onClick={onNewExpediente}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800"
          >
            <PlusCircle className="w-4 h-4 text-amber-400" />
            <span>Crear primer expediente</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((exp) => (
            <div
              key={exp.id}
              onClick={() => onSelectExpediente(exp)}
              className="bg-white hover:bg-slate-50/80 p-5 rounded-xl border border-slate-200 transition-all hover:border-slate-300 hover:shadow-xs cursor-pointer group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-semibold border capitalize ${getMateriaBadge(
                        exp.materia
                      )}`}
                    >
                      {exp.materia}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                      {exp.estado}
                    </span>
                    <span className="text-xs font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                      ID: {exp.id.slice(0, 8)}...
                    </span>
                    {exp.numeroProceso ? (
                      <span className="text-xs font-mono text-slate-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        Proc: {exp.numeroProceso}
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-600 italic">
                        (Sin proceso judicial)
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                    {exp.titulo}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                    <div>
                      <span className="font-semibold text-slate-600">Cliente:</span> {exp.cliente}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-600">Responsable:</span>{' '}
                      {exp.responsable}
                    </div>
                    {exp.tipoAsunto && (
                      <div className="hidden sm:inline">
                        <span className="font-semibold text-slate-600">Asunto:</span> {exp.tipoAsunto}
                      </div>
                    )}
                    <div>
                      <span className="font-semibold text-slate-600">Apertura:</span>{' '}
                      {exp.fechaApertura}
                    </div>
                  </div>
                </div>

                <div className="flex items-center sm:justify-end space-x-2 text-slate-400 group-hover:text-slate-900 transition-colors">
                  <span className="text-xs font-semibold hidden md:inline">Ver Ficha</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
