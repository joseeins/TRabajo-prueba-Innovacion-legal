/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ExpedienteForm } from './components/ExpedienteForm';
import { ExpedienteFichaResumen } from './components/ExpedienteFichaResumen';
import { ExpedienteList } from './components/ExpedienteList';
import type { Expediente, UserSession } from './types';
import { generateInternalUUID, formatFechaApertura } from './lib/caseFile';

const STORAGE_KEY = 'iurisfile_expedientes_mvp';

// Datos semilla de demostración profesional para inicio inmediato
const SEED_EXPEDIENTES: Expediente[] = [
  {
    id: generateInternalUUID(),
    titulo: 'Demanda por Despido Injustificado y Cobro de Prestaciones Sociales',
    cliente: 'Julián Alberto Restrepo',
    materia: 'laboral',
    tipoAsunto: 'Despido incausado con fuero sindical',
    numeroProceso: '05001-31-05-003-2026-00412-00',
    responsable: 'Abg. Carolina Méndez',
    bitacora:
      'Trabajador desvinculado sin previa autorización judicial contando con fuero de salud y sindical. Se radicó demanda ordinaria laboral de primera instancia solicitando reintegro y salarios caídos.',
    estado: 'Abierto',
    fechaApertura: formatFechaApertura(new Date(Date.now() - 86400000 * 2)),
    fechaAperturaISO: new Date(Date.now() - 86400000 * 2).toISOString(),
    creador: 'Abg. Carolina Méndez',
    creadorEmail: 'c.mendez@iurisfile.law',
  },
  {
    id: generateInternalUUID(),
    titulo: 'Asesoría y Negociación Extrajudicial de Acuerdo Societario',
    cliente: 'Tecnologías Globales del Pacífico S.A.S.',
    materia: 'civil',
    tipoAsunto: 'Disolución y liquidación parcial de sociedad',
    numeroProceso: null, // Dejado vacío conforme a Regla 5.2
    responsable: 'Dr. Alejandro Sarmiento',
    bitacora:
      'Etapa previa de mediación y acuerdo directo entre socios fundadores para la cesión de cuotas sociales y valoración de activos intangibles. Aún no se ha radicado litigio judicial.',
    estado: 'Abierto',
    fechaApertura: formatFechaApertura(new Date(Date.now() - 86400000)),
    fechaAperturaISO: new Date(Date.now() - 86400000).toISOString(),
    creador: null, // Sin sesión autenticada
    creadorEmail: null,
  },
];

const DEFAULT_SESSION: UserSession = {
  id: 'usr-lex-101',
  nombre: 'Abg. Carolina Méndez',
  email: 'c.mendez@iurisfile.law',
  cargo: 'Abogada Senior de Litigios',
  colegiatura: 'Col. Abogados Matr. 184920',
};

export default function App() {
  const [currentView, setCurrentView] = useState<'list' | 'new' | 'summary'>('list');
  const [expedientes, setExpedientes] = useState<Expediente[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return SEED_EXPEDIENTES;
  });

  const [activeExpediente, setActiveExpediente] = useState<Expediente | null>(null);
  const [session, setSession] = useState<UserSession | null>(DEFAULT_SESSION);

  // Persistir expedientes en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expedientes));
    } catch {
      // Ignorar quota
    }
  }, [expedientes]);

  // Manejo de creación exitosa de un expediente
  const handleExpedienteCreated = (nuevoExpediente: Expediente) => {
    setExpedientes((prev) => [nuevoExpediente, ...prev]);
    setActiveExpediente(nuevoExpediente);
    setCurrentView('summary');
  };

  // Alternar sesión autenticada para probar Regla 5.2 (con sesión vs sin sesión)
  const handleToggleSession = () => {
    setSession((prev) => (prev ? null : DEFAULT_SESSION));
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      <Header
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          if (view === 'new') {
            setActiveExpediente(null);
          }
        }}
        session={session}
        onToggleSession={handleToggleSession}
        expedientesCount={expedientes.length}
      />

      <main className="flex-1 pb-16">
        {currentView === 'new' && (
          <ExpedienteForm
            session={session}
            onSuccess={handleExpedienteCreated}
            onCancel={() => setCurrentView('list')}
          />
        )}

        {currentView === 'summary' && activeExpediente && (
          <ExpedienteFichaResumen
            expediente={activeExpediente}
            onNewExpediente={() => {
              setActiveExpediente(null);
              setCurrentView('new');
            }}
            onGoToList={() => setCurrentView('list')}
          />
        )}

        {currentView === 'list' && (
          <ExpedienteList
            expedientes={expedientes}
            onSelectExpediente={(exp) => {
              setActiveExpediente(exp);
              setCurrentView('summary');
            }}
            onNewExpediente={() => {
              setActiveExpediente(null);
              setCurrentView('new');
            }}
          />
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            <span className="font-semibold text-slate-700">IurisFile Legaltech MVP</span> — Sistema de Creación de Expediente Digital
          </p>
          <p className="text-slate-400">
            Reglas de negocio 5.1 a 5.4 implementadas y verificadas
          </p>
        </div>
      </footer>
    </div>
  );
}
