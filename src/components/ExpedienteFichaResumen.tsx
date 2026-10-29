import React, { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Check,
  PlusCircle,
  FolderOpen,
  Calendar,
  User,
  Shield,
  FileText,
  Briefcase,
  Scale,
  Hash,
  Share2,
  ExternalLink,
  ShieldAlert,
  Info,
} from 'lucide-react';
import type { Expediente } from '../types';

interface ExpedienteFichaResumenProps {
  expediente: Expediente;
  onNewExpediente: () => void;
  onGoToList: () => void;
}

export const ExpedienteFichaResumen: React.FC<ExpedienteFichaResumenProps> = ({
  expediente,
  onNewExpediente,
  onGoToList,
}) => {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(expediente.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCopySummary = () => {
    const text = `
=== FICHA DE RESUMEN DE EXPEDIENTE DIGITAL ===
Identificador Interno (UUID): ${expediente.id}
Título del Caso: ${expediente.titulo}
Cliente: ${expediente.cliente}
Materia: ${expediente.materia.toUpperCase()}
Tipo de Asunto: ${expediente.tipoAsunto || 'No especificado'}
Número de Proceso Judicial: ${expediente.numeroProceso || 'Sin proceso judicial aún'}
Responsable Asignado: ${expediente.responsable}
Estado: ${expediente.estado}
Fecha de Apertura: ${expediente.fechaApertura}
Creador Registrado: ${expediente.creador ? `${expediente.creador} (${expediente.creadorEmail || ''})` : 'Sin sesión autenticada (No registrado)'}
Bitácora Inicial: ${expediente.bitacora || 'Sin antecedentes iniciales registrados'}
===============================================
    `.trim();

    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto pt-6 pb-12 px-4 sm:px-6">
      {/* Banner de Confirmación Exitosa */}
      <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-fade-in">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-emerald-950">
              ¡Expediente digital creado y validado exitosamente!
            </h2>
            <p className="text-sm text-emerald-800">
              Se ha generado el identificador único del sistema y se ha registrado la fecha de apertura oficial.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            onClick={handleCopySummary}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-50 transition-colors shadow-2xs"
          >
            {copiedAll ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copiado</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar ficha completa</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Ficha de Resumen Legal */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
        {/* Cabecera de la Ficha */}
        <div className="bg-slate-900 text-white p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold uppercase tracking-wider">
                Ficha de Resumen Legal
              </span>
              <span className="text-xs text-slate-400">Requisito 5.1 / 5.2</span>
            </div>

            {/* Estado Inicial: Abierto */}
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Estado: {expediente.estado}</span>
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-3">
            {expediente.titulo}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs text-slate-300">
            {/* Identificador Interno UUID */}
            <div>
              <span className="text-slate-400 font-mono text-[11px] block uppercase">
                Identificador Interno (UUID del Sistema):
              </span>
              <div className="flex items-center space-x-2 mt-1">
                <code className="px-2.5 py-1 rounded bg-slate-800 font-mono text-amber-300 text-xs select-all border border-slate-700">
                  {expediente.id}
                </code>
                <button
                  type="button"
                  onClick={handleCopyId}
                  title="Copiar UUID"
                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Fecha de Apertura */}
            <div>
              <span className="text-slate-400 font-mono text-[11px] block uppercase">
                Fecha Oficial de Apertura:
              </span>
              <div className="flex items-center space-x-1.5 mt-1 text-slate-200 font-medium">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>{expediente.fechaApertura}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cuerpo de la Ficha: Comparativa y Atributos */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Destacado: Comparativa entre Identificador Interno y Proceso Judicial (Regla 3 y 4) */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-amber-950">
                <p className="font-bold">
                  Independencia del Identificador Interno vs. Número Judicial (Regla 3 & 4)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 text-xs">
                  <div className="bg-white p-2.5 rounded-lg border border-amber-200">
                    <span className="font-semibold text-slate-500 block">Identificador del Sistema:</span>
                    <span className="font-mono text-slate-900 font-semibold">{expediente.id}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-amber-200">
                    <span className="font-semibold text-slate-500 block">Número de Proceso Judicial:</span>
                    {expediente.numeroProceso ? (
                      <span className="font-mono text-slate-900 font-bold">{expediente.numeroProceso}</span>
                    ) : (
                      <span className="text-slate-500 italic">
                        Sin radicar / Vacío (No existe proceso judicial todavía)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grilla de Datos Clave */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Cliente */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Cliente
              </span>
              <p className="text-base font-bold text-slate-900">{expediente.cliente}</p>
              <span className="text-xs text-slate-500 mt-0.5 block">
                Ingresado como texto directo sin módulo adicional.
              </span>
            </div>

            {/* Responsable */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Abogado Responsable
              </span>
              <p className="text-base font-bold text-slate-900">{expediente.responsable}</p>
              <span className="text-xs text-slate-500 mt-0.5 block">
                Profesional a cargo del trámite del expediente.
              </span>
            </div>

            {/* Materia y Tipo de Asunto */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Materia y Tipo de Asunto
              </span>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-md bg-slate-900 text-white font-semibold text-xs capitalize">
                  {expediente.materia}
                </span>
                <span className="text-sm font-medium text-slate-800">
                  {expediente.tipoAsunto || 'Sin tipo específico'}
                </span>
              </div>
            </div>

            {/* Creador del Expediente (Regla de Autenticación 5.2) */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Creador Registrado
              </span>
              {expediente.creador ? (
                <div>
                  <div className="flex items-center space-x-1.5 text-emerald-800 font-bold text-sm">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <span>{expediente.creador}</span>
                  </div>
                  {expediente.creadorEmail && (
                    <span className="text-xs text-emerald-700 block mt-0.5 font-mono">
                      {expediente.creadorEmail}
                    </span>
                  )}
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Registrado a partir de la sesión autenticada activa.
                  </span>
                </div>
              ) : (
                <div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-200 text-slate-800">
                    No registrado (Sin sesión autenticada)
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Conforme a la regla 5.2, sin sesión no se inventa una identidad ni se presenta al responsable como creador verificado.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Bitácora Inicial */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Bitácora / Resumen Inicial del Caso
            </span>
            {expediente.bitacora ? (
              <p className="text-sm text-slate-800 whitespace-pre-line leading-relaxed bg-white p-3.5 rounded-lg border border-slate-200">
                {expediente.bitacora}
              </p>
            ) : (
              <p className="text-xs text-slate-500 italic bg-white p-3 rounded-lg border border-slate-200">
                No se registraron antecedentes iniciales en la apertura de este caso.
              </p>
            )}
          </div>
        </div>

        {/* Barra de Acciones Finales */}
        <div className="bg-slate-50 p-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={onGoToList}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <FolderOpen className="w-4 h-4 text-slate-500" />
            <span>Ver todos los expedientes</span>
          </button>

          <button
            type="button"
            onClick={onNewExpediente}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-sm font-semibold text-white transition-all shadow-xs"
          >
            <PlusCircle className="w-4 h-4 text-amber-400" />
            <span>Crear otro expediente</span>
          </button>
        </div>
      </div>
    </div>
  );
};
