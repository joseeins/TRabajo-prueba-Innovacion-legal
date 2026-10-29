import React, { useState } from 'react';
import {
  FileText,
  AlertCircle,
  CheckCircle2,
  Lock,
  Calendar,
  User,
  Shield,
  HelpCircle,
  Briefcase,
  Scale,
  Sparkles,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import {
  MATERIAS_LEGALES,
  validateExpedienteForm,
  createExpediente,
  type ExpedienteFormData,
  type MateriaLegal,
  type ValidationErrors,
} from '../lib/caseFile';
import type { Expediente, UserSession } from '../types';

interface ExpedienteFormProps {
  session: UserSession | null;
  onSuccess: (expediente: Expediente) => void;
  onCancel: () => void;
}

export const ExpedienteForm: React.FC<ExpedienteFormProps> = ({
  session,
  onSuccess,
  onCancel,
}) => {
  // Estado de los datos del formulario
  const [formData, setFormData] = useState<ExpedienteFormData>({
    titulo: '',
    cliente: '',
    materia: '',
    tipoAsunto: '',
    numeroProceso: '',
    responsable: '',
    bitacora: '',
  });

  // Estado de errores de validación
  const [errors, setErrors] = useState<ValidationErrors>({});
  
  // Estado de procesamiento y error general
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Switch de prueba para verificar Regla 5: "Si la creación falla, se conservan los datos escritos y se muestra el error"
  const [simulateFailure, setSimulateFailure] = useState<boolean>(false);

  // Manejo de cambios en los inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error del campo modificado si existía
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name as keyof ValidationErrors];
        return updated;
      });
    }
    if (submitError) {
      setSubmitError(null);
    }
  };

  // Selección directa de materia
  const handleSelectMateria = (materia: MateriaLegal) => {
    setFormData((prev) => ({ ...prev, materia }));
    if (errors.materia) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated.materia;
        return updated;
      });
    }
  };

  // Rellenar con un caso típico para facilitar pruebas rápidas
  const handleFillSample = () => {
    setFormData({
      titulo: 'Demanda por Incumplimiento de Contrato de Obra',
      cliente: 'Constructora del Norte S.A.C.',
      materia: 'civil',
      tipoAsunto: 'Resolución contractual y cobro de indemnización por vicios ocultos',
      numeroProceso: '2026-08192-J-CIV-04',
      responsable: 'Abg. Roberto Carlos Pizarro',
      bitacora:
        'El cliente solicita iniciar acciones legales por entregas con defectos estructurales y penalidades devengadas. Se adjuntan copias de pólizas y actas de recepción observadas.',
    });
    setErrors({});
    setSubmitError(null);
  };

  // Envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // 1. Validar reglas de negocio
    const validation = validateExpedienteForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 2. Procesar creación con estado de carga (Regla 6: botón deshabilitado para evitar envíos repetidos)
    setIsSubmitting(true);

    try {
      // Simular latencia de red de 600ms para probar feedback visual
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Crear expediente con lógica de dominio
      const nuevoExpediente = createExpediente(formData, session, simulateFailure);

      // Limpiar errores y notificar al padre
      setErrors({});
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      onSuccess(nuevoExpediente);
    } catch (err: any) {
      // Regla 5: Si la creación falla, se conservan los datos escritos y se muestra el error
      setIsSubmitting(false);
      setSubmitError(
        err?.message || 'Ocurrió un error inesperado al procesar el expediente. Sus datos se han conservado intactos.'
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Encabezado del Formulario */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                Paso 1 de 2: Registro Inicial
              </span>
              <span className="text-xs text-slate-500 font-medium">Historia 5.1 MVP</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
              Crear Nuevo Expediente Digital
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Registre y centralice la información inicial del caso jurídico. Los campos con{' '}
              <span className="text-rose-600 font-bold">*</span> son obligatorios.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleFillSample}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 transition-colors"
              title="Cargar automáticamente datos de un caso para pruebas rápidas"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Ejemplo rápido</span>
            </button>
          </div>
        </div>
      </div>

      {/* Banner de error general si la creación falla (Regla 5) */}
      {submitError && (
        <div
          role="alert"
          className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start space-x-3 shadow-xs animate-shake"
        >
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-bold text-rose-950">No se pudo guardar el expediente</p>
            <p className="mt-0.5 text-rose-800">{submitError}</p>
            <p className="mt-2 text-xs text-rose-700 bg-rose-100/70 p-2 rounded border border-rose-200">
              ✓ <span className="font-semibold">Regla 5 garantizada:</span> Todos los datos ingresados en el formulario
              se conservan para que pueda corregir o reintentar sin perder su trabajo.
            </p>
          </div>
        </div>
      )}

      {/* Alerta si hay campos inválidos */}
      {Object.keys(errors).length > 0 && !submitError && (
        <div
          role="alert"
          className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start space-x-3 shadow-xs"
        >
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-bold text-amber-950">Por favor complete los campos obligatorios requeridos</p>
            <ul className="list-disc list-inside mt-1 space-y-0.5 text-amber-800">
              {errors.titulo && <li>{errors.titulo}</li>}
              {errors.cliente && <li>{errors.cliente}</li>}
              {errors.materia && <li>{errors.materia}</li>}
              {errors.responsable && <li>{errors.responsable}</li>}
            </ul>
          </div>
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Sección: Identificación y Parámetros del Sistema (Regla 3 & 5.2) */}
        <div className="bg-slate-50/80 rounded-xl p-4 sm:p-5 border border-slate-200">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center space-x-2">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Parámetros de Auditoría y Estado Inicial (Regla 5.2)</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
            {/* Identificador Interno */}
            <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
              <span className="font-semibold text-slate-500 block mb-1">Identificador interno:</span>
              <div className="flex items-center space-x-1.5 text-slate-700 font-mono">
                <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[11px] font-semibold text-slate-800">
                  UUID Automático
                </span>
              </div>
              <p className="text-[10px] text-slate-600 mt-1">
                Generado por el sistema. Independiente del número judicial y sin contador manual.
              </p>
            </div>

            {/* Estado Inicial */}
            <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
              <span className="font-semibold text-slate-500 block mb-1">Estado inicial:</span>
              <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-xs border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Abierto</span>
              </div>
              <p className="text-[10px] text-slate-600 mt-1">
                Valor inicial estándar para toda nueva causa.
              </p>
            </div>

            {/* Creador de la sesión */}
            <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
              <span className="font-semibold text-slate-500 block mb-1">Creador registrado:</span>
              {session ? (
                <div className="text-emerald-700 font-medium truncate">
                  <span className="font-bold">{session.nombre}</span>
                  <span className="block text-[10px] text-emerald-800">{session.cargo}</span>
                </div>
              ) : (
                <div className="text-slate-600">
                  <span className="italic">No registrado</span>
                  <span className="block text-[10px] text-slate-600 font-sans">
                    (Sin sesión autenticada activa)
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sección: Información Principal del Caso */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
            <FileText className="w-4 h-4 text-amber-600" />
            <span>Datos Básicos Obligatorios</span>
          </h2>

          {/* Nombre o Título del Caso */}
          <div>
            <label
              htmlFor="field-titulo"
              className="block text-sm font-semibold text-slate-800 mb-1"
            >
              Nombre o título del caso <span className="text-rose-600 font-bold">*</span>
            </label>
            <input
              type="text"
              id="field-titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              placeholder="Ej.: Reclamación de indemnización por incumplimiento de obra"
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-colors focus:outline-hidden focus:ring-2 ${
                errors.titulo
                  ? 'border-rose-400 bg-rose-50/30 text-rose-950 focus:ring-rose-500 focus:border-rose-500'
                  : 'border-slate-300 focus:ring-slate-900 focus:border-slate-900'
              }`}
              aria-invalid={errors.titulo ? 'true' : 'false'}
              aria-describedby={errors.titulo ? 'error-titulo' : 'desc-titulo'}
              required
            />
            {errors.titulo ? (
              <p id="error-titulo" className="text-xs text-rose-600 mt-1 flex items-center space-x-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.titulo}</span>
              </p>
            ) : (
              <p id="desc-titulo" className="text-xs text-slate-500 mt-1">
                Texto breve y descriptivo que permita reconocer el asunto legal en el despacho.
              </p>
            )}
          </div>

          {/* Fila: Cliente y Responsable */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Cliente */}
            <div>
              <label
                htmlFor="field-cliente"
                className="block text-sm font-semibold text-slate-800 mb-1"
              >
                Cliente <span className="text-rose-600 font-bold">*</span>
              </label>
              <input
                type="text"
                id="field-cliente"
                name="cliente"
                value={formData.cliente}
                onChange={handleChange}
                placeholder="Ej.: María Elena Domínguez o Inversiones Los Pinos S.A."
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-colors focus:outline-hidden focus:ring-2 ${
                  errors.cliente
                    ? 'border-rose-400 bg-rose-50/30 text-rose-950 focus:ring-rose-500 focus:border-rose-500'
                    : 'border-slate-300 focus:ring-slate-900 focus:border-slate-900'
                }`}
                aria-invalid={errors.cliente ? 'true' : 'false'}
                aria-describedby={errors.cliente ? 'error-cliente' : 'desc-cliente'}
                required
              />
              {errors.cliente ? (
                <p id="error-cliente" className="text-xs text-rose-600 mt-1 flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.cliente}</span>
                </p>
              ) : (
                <p id="desc-cliente" className="text-xs text-slate-500 mt-1">
                  Nombre de la persona natural o jurídica representada.
                </p>
              )}
            </div>

            {/* Responsable */}
            <div>
              <label
                htmlFor="field-responsable"
                className="block text-sm font-semibold text-slate-800 mb-1"
              >
                Abogado o Profesional Responsable <span className="text-rose-600 font-bold">*</span>
              </label>
              <input
                type="text"
                id="field-responsable"
                name="responsable"
                value={formData.responsable}
                onChange={handleChange}
                placeholder="Ej.: Abg. Fernando Morales"
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-colors focus:outline-hidden focus:ring-2 ${
                  errors.responsable
                    ? 'border-rose-400 bg-rose-50/30 text-rose-950 focus:ring-rose-500 focus:border-rose-500'
                    : 'border-slate-300 focus:ring-slate-900 focus:border-slate-900'
                }`}
                aria-invalid={errors.responsable ? 'true' : 'false'}
                aria-describedby={errors.responsable ? 'error-responsable' : 'desc-responsable'}
                required
              />
              {errors.responsable ? (
                <p id="error-responsable" className="text-xs text-rose-600 mt-1 flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.responsable}</span>
                </p>
              ) : (
                <p id="desc-responsable" className="text-xs text-slate-500 mt-1">
                  Se ingresa directamente en el formulario sin precargar catálogo.
                </p>
              )}
            </div>
          </div>

          {/* Materia Legal (Selección de botones/tarjetas accesibles) */}
          <div id="field-materia">
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Materia jurídica <span className="text-rose-600 font-bold">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {MATERIAS_LEGALES.map((item) => {
                const isSelected = formData.materia === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => handleSelectMateria(item.value)}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs font-semibold'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-sm font-bold capitalize">{item.label}</span>
                    <span
                      className={`text-[10px] mt-0.5 line-clamp-1 ${
                        isSelected ? 'text-amber-300' : 'text-slate-400'
                      }`}
                    >
                      {item.value}
                    </span>
                  </button>
                );
              })}
            </div>
            {errors.materia && (
              <p className="text-xs text-rose-600 mt-1.5 flex items-center space-x-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.materia}</span>
              </p>
            )}
          </div>
        </div>

        {/* Sección: Detalles Procesales y Bitácora Inicial */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
            <Briefcase className="w-4 h-4 text-slate-700" />
            <span>Detalles Procesales y Antecedentes (Opcionales)</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Tipo de Asunto */}
            <div>
              <label
                htmlFor="field-tipoAsunto"
                className="block text-sm font-semibold text-slate-800 mb-1"
              >
                Tipo de asunto <span className="text-xs font-normal text-slate-600">(Opcional)</span>
              </label>
              <input
                type="text"
                id="field-tipoAsunto"
                name="tipoAsunto"
                value={formData.tipoAsunto}
                onChange={handleChange}
                placeholder="Ej.: Despido nulo, Juicio ordinario, Medida cautelar"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
              />
              <p className="text-xs text-slate-500 mt-1">
                Texto breve para precisar la naturaleza del caso sin catálogo cerrado.
              </p>
            </div>

            {/* Número de Proceso Judicial (Opcional - Regla 4) */}
            <div>
              <label
                htmlFor="field-numeroProceso"
                className="block text-sm font-semibold text-slate-800 mb-1"
              >
                Número de proceso judicial <span className="text-xs font-normal text-slate-600">(Opcional)</span>
              </label>
              <input
                type="text"
                id="field-numeroProceso"
                name="numeroProceso"
                value={formData.numeroProceso}
                onChange={handleChange}
                placeholder="Ej.: 11001-31-03-010-2026-00123-00"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
              />
              <p className="text-xs text-slate-500 mt-1">
                Puede quedar vacío si todavía no existe un proceso judicial radicado.
              </p>
            </div>
          </div>

          {/* Bitácora Inicial */}
          <div>
            <label
              htmlFor="field-bitacora"
              className="block text-sm font-semibold text-slate-800 mb-1"
            >
              Bitácora / Resumen inicial del caso{' '}
              <span className="text-xs font-normal text-slate-600">(Opcional)</span>
            </label>
            <textarea
              id="field-bitacora"
              name="bitacora"
              rows={4}
              value={formData.bitacora}
              onChange={handleChange}
              placeholder="Describa los antecedentes principales del asunto, hechos relevantes o instrucciones iniciales del cliente..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
            />
            <p className="text-xs text-slate-500 mt-1">
              Registro histórico inicial que quedará registrado en el expediente.
            </p>
          </div>
        </div>

        {/* Panel de prueba para la regla 5: simular fallo */}
        <div className="bg-amber-50/50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 flex items-center justify-between">
          <label className="flex items-center space-x-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={simulateFailure}
              onChange={(e) => setSimulateFailure(e.target.checked)}
              className="w-4 h-4 text-rose-600 rounded border-amber-300 focus:ring-rose-500"
            />
            <span className="font-semibold text-slate-700">
              Modo de prueba: Simular error de guardado
            </span>
          </label>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            (Verifica que ante fallo no se pierden los datos escritos)
          </span>
        </div>

        {/* Botones de Acción (Regla 6) */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 border border-slate-300 transition-colors disabled:opacity-50"
          >
            Cancelar y volver
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white shadow-xs transition-all ${
              isSubmitting
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-slate-900 hover:bg-slate-800 active:scale-98'
            }`}
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Validando y creando expediente...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Crear expediente digital</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
