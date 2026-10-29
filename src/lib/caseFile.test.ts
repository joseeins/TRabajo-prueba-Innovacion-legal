import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateExpedienteForm,
  createExpediente,
  generateInternalUUID,
  type ExpedienteFormData,
  type UserSession,
} from './caseFile.ts';

test('Regla 1 y 2: Falla la validación si faltan título, cliente, materia o responsable', () => {
  const invalidData: ExpedienteFormData = {
    titulo: '',
    cliente: '   ',
    materia: '',
    tipoAsunto: 'Despido incausado',
    numeroProceso: '',
    responsable: '',
    bitacora: 'Resumen inicial',
  };

  const result = validateExpedienteForm(invalidData);
  assert.equal(result.isValid, false);
  assert.ok(result.errors.titulo, 'Debe indicar error en título');
  assert.ok(result.errors.cliente, 'Debe indicar error en cliente por espacios en blanco');
  assert.ok(result.errors.materia, 'Debe indicar error en materia');
  assert.ok(result.errors.responsable, 'Debe indicar error en responsable');
});

test('Regla 4: Número de proceso es opcional y permite creación cuando está vacío', () => {
  const validDataWithoutProcessNum: ExpedienteFormData = {
    titulo: 'Reclamación de daños por filtración',
    cliente: 'Inversiones Los Olivos S.A.',
    materia: 'civil',
    tipoAsunto: 'Responsabilidad extracontractual',
    numeroProceso: '', // Vacío
    responsable: 'Abg. Carlos Méndez',
    bitacora: 'Cliente solicita indemnización de perjuicios materiales.',
  };

  const result = validateExpedienteForm(validDataWithoutProcessNum);
  assert.equal(result.isValid, true);
  assert.equal(Object.keys(result.errors).length, 0);

  const exp = createExpediente(validDataWithoutProcessNum, null);
  assert.equal(exp.numeroProceso, null, 'El número de proceso debe almacenarse como null');
  assert.equal(exp.estado, 'Abierto', 'El estado inicial debe ser Abierto');
});

test('Regla 3: El identificador interno se genera automáticamente como UUID independiente', () => {
  const data: ExpedienteFormData = {
    titulo: 'Querella penal por estafa',
    cliente: 'Banco de Finanzas',
    materia: 'penal',
    tipoAsunto: 'Fraude informático',
    numeroProceso: '2026-00452-J01',
    responsable: 'Dra. Elena Ramos',
    bitacora: 'Investigación preliminar ante fiscalía.',
  };

  const exp1 = createExpediente(data, null);
  const exp2 = createExpediente(data, null);

  assert.ok(exp1.id, 'Debe tener un identificador interno');
  assert.notEqual(exp1.id, exp2.id, 'Cada expediente debe tener un UUID independiente y único');
  assert.notEqual(exp1.id, exp1.numeroProceso, 'El id interno no debe confundirse con el número judicial');
  assert.equal(exp1.numeroProceso, '2026-00452-J01');
});

test('Regla Creador: Se registra únicamente si existe sesión autenticada; sin sesión queda null', () => {
  const data: ExpedienteFormData = {
    titulo: 'Impugnación de sanción tributaria',
    cliente: 'Transportes Rápidos Ltda.',
    materia: 'administrativa',
    tipoAsunto: 'Recurso de alzada',
    numeroProceso: '',
    responsable: 'Lic. Andrés Valenzuela',
    bitacora: 'Revisión de pliegos y descargos.',
  };

  // Caso 1: Sin sesión autenticada
  const expSinSesion = createExpediente(data, null);
  assert.equal(expSinSesion.creador, null, 'Sin sesión autenticada no se inventa identidad');
  assert.equal(expSinSesion.creadorEmail, null);

  // Caso 2: Con sesión autenticada
  const sesion: UserSession = {
    id: 'usr-999',
    nombre: 'Dra. María Fernanda López',
    email: 'm.lopez@bufetejuridico.com',
    cargo: 'Socia de Litigios',
  };
  const expConSesion = createExpediente(data, sesion);
  assert.equal(expConSesion.creador, 'Dra. María Fernanda López', 'Debe registrar al usuario autenticado');
  assert.equal(expConSesion.creadorEmail, 'm.lopez@bufetejuridico.com');
  // Confirmar que el responsable sigue siendo el que se digitó en el formulario
  assert.equal(expConSesion.responsable, 'Lic. Andrés Valenzuela');
});

test('Regla 5: Lanzar error al simular fallo para probar conservación de datos', () => {
  const data: ExpedienteFormData = {
    titulo: 'Litigio contractual',
    cliente: 'Corporación Alpha',
    materia: 'civil',
    tipoAsunto: 'Incumplimiento de entrega',
    numeroProceso: '',
    responsable: 'Abg. Roberto Gómez',
    bitacora: 'Negociaciones extrajudiciales previas.',
  };

  assert.throws(
    () => {
      createExpediente(data, null, true);
    },
    /Error al conectar con la base de datos/,
    'Debe arrojar la excepción simulada para verificar manejo en UI'
  );
});
