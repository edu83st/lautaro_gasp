/**
 * Generador de Archivos GASP
 * Procesa los datos del formulario y genera el contenido del archivo de texto
 */

import { PUNZONES_DISPONIBLES } from './punzonesDisponibles.js';

/**
 * Genera el contenido del archivo de texto en formato JSON
 * @param {Object} datos - Datos del formulario
 * @param {string} datos.estaciones - Estaciones (ej: "5-6", "5-7", "7")
 * @param {number} datos.almaPerfil - Alma de perfil (ej: 140, 200)
 * @param {string} datos.tipoPerfil - Tipo de perfil (ej: "C", "U", "Z", "NRV", "SIGMA")
 * @param {string} datos.plano - Número de plano (ej: "GCV86")
 * @param {number} datos.longitud - Longitud del perfil
 * @param {Object} datos.punzones - Objeto con los valores de punzones (ej: { "PZ-1": 35, "PZ-2": 1385 })
 * @returns {Object} - Contenido del archivo en formato JSON con estructura de texto plano
 */
export function generarArchivo(datos) {
  // Validar datos de entrada
  validarDatos(datos);

  // Determinar qué perfiles están activos según el tipo de perfil
  const perfilesActivos = determinarPerfilesActivos(datos.tipoPerfil);

  // Generar sección [DATA]
  const seccionData = generarSeccionData(datos, perfilesActivos);

  // Generar sección [BANCO1]
  const seccionBanco1 = generarSeccionBanco1(datos);

  // Combinar secciones
  const contenido = {
    texto: [...seccionData, '', ...seccionBanco1].join('\n'),
    json: {
      DATA: parsearSeccionData(seccionData),
      BANCO1: parsearSeccionBanco1(seccionBanco1),
    },
  };

  return contenido;
}

/**
 * Valida los datos de entrada
 */
function validarDatos(datos) {
  if (!datos.estaciones) {
    throw new Error('ESTACIONES es requerido');
  }

  if (!datos.almaPerfil || datos.almaPerfil <= 0) {
    throw new Error('ALMA DE PERFIL debe ser un número positivo');
  }

  if (
    !datos.tipoPerfil ||
    !PUNZONES_DISPONIBLES.esPerfilValido(datos.tipoPerfil)
  ) {
    throw new Error(
      `TIPO DE PERFIL inválido. Debe ser uno de: ${PUNZONES_DISPONIBLES.tiposPerfiles
        .map((p) => p.codigo)
        .join(', ')}`
    );
  }

  if (!datos.plano) {
    throw new Error('PLANO es requerido');
  }

  if (!datos.longitud || datos.longitud <= 0) {
    throw new Error('LONGITUD debe ser un número positivo');
  }

  if (!datos.punzones || typeof datos.punzones !== 'object') {
    throw new Error('PUNZONES es requerido y debe ser un objeto');
  }
}

/**
 * Determina qué perfiles están activos según el tipo de perfil
 */
function determinarPerfilesActivos(tipoPerfil) {
  const activos = {
    'Perf C': tipoPerfil === 'C',
    'Perf NRV': tipoPerfil === 'NRV',
    'Perf Z': tipoPerfil === 'Z',
    'Perf SIGMA': tipoPerfil === 'SIGMA',
    'Perf U': tipoPerfil === 'U',
  };

  return activos;
}

/**
 * Genera la sección [DATA] del archivo
 */
function generarSeccionData(datos, perfilesActivos) {
  const lineas = ['[DATA]'];

  // DATA000 = PLANO (formato: PLANO + " - " + número, pero en el archivo original aparece como " 0")
  // Basado en el archivo original, DATA000 parece ser 0
  lineas.push('DATA000= 0');

  // DATA003 = 0 (generalmente 0)
  lineas.push('DATA003= 0');

  // DATA004 = 0 (generalmente 0)
  lineas.push('DATA004= 0');

  // DATA005-DATA008 = Perfiles (1 si está activo, 0 si no)
  lineas.push(`DATA005= ${perfilesActivos['Perf C'] ? 1 : 0}`);
  lineas.push(`DATA006= ${perfilesActivos['Perf NRV'] ? 1 : 0}`);
  lineas.push(`DATA007= ${perfilesActivos['Perf Z'] ? 1 : 0}`);
  lineas.push(`DATA008= ${perfilesActivos['Perf SIGMA'] ? 1 : 0}`);

  // BOOL000-BOOL004 = Perfiles (1 si está activo, 0 si no)
  lineas.push(`BOOL000=${perfilesActivos['Perf C'] ? 1 : 0}`);
  lineas.push(`BOOL001=${perfilesActivos['Perf NRV'] ? 1 : 0}`);
  lineas.push(`BOOL002=${perfilesActivos['Perf Z'] ? 1 : 0}`);
  lineas.push(`BOOL003=${perfilesActivos['Perf SIGMA'] ? 1 : 0}`);
  lineas.push(`BOOL004=${perfilesActivos['Perf U'] ? 1 : 0}`);

  // BOOL005-BOOL009 = 0
  for (let i = 5; i <= 9; i++) {
    lineas.push(`BOOL00${i}=0`);
  }

  // DATA012-DATA031 = 0
  for (let i = 12; i <= 31; i++) {
    const num = i.toString().padStart(3, '0');
    lineas.push(`DATA${num}= 0`);
  }

  // DATA009 = longitud (formato decimal con espacios)
  lineas.push(`DATA009=${datos.longitud.toFixed(3)}`);

  // BOOL010 = 0
  lineas.push('BOOL010=0');

  // STEP25 = 0
  lineas.push('STEP25=0');

  return lineas;
}

/**
 * Genera la sección [BANCO1] del archivo
 */
function generarSeccionBanco1(datos) {
  const lineas = ['[BANCO1]'];

  // IND_PV001 siempre es 1
  lineas.push('IND_PV001= 1');
  lineas.push('VAL_X001= 0');
  lineas.push('VAL_Y001= 0');
  lineas.push('ABILIT001= ');
  lineas.push('NOTE001= ');
  lineas.push('Error 2029');

  // Procesar punzones ingresados
  const punzonesOrdenados = ordenarPunzones(datos.punzones);

  // Crear un mapa de punzones por índice para acceso rápido
  const punzonesMap = new Map();
  let maxPunzonIndex = 0;

  for (const [pzNombre, valor] of punzonesOrdenados) {
    if (valor !== null && valor !== undefined && valor !== '') {
      const numPunzon = parseInt(pzNombre.replace('PZ-', ''));
      punzonesMap.set(numPunzon, valor);
      maxPunzonIndex = Math.max(maxPunzonIndex, numPunzon);
    }
  }

  // Generar hasta IND_PV191 (o hasta el último punzón + algunos más)
  const maxIndice = Math.max(191, maxPunzonIndex + 1);

  // Índices que tienen ABILIT (basado en el patrón del archivo result.txt)
  const indicesConAbilit = new Set([
    1, 77, 79, 81, 83, 85, 87, 89, 91, 93, 95, 97, 99, 101, 103, 105, 107, 109,
    111, 113, 115, 117, 119, 121, 123, 125, 127, 129, 131, 133, 135, 137, 139,
    141, 143, 145, 147, 149, 151, 153, 155, 157, 159, 161, 163, 165, 167, 169,
    171, 173, 175, 177, 179, 181, 183, 185, 187, 189, 191,
  ]);

  for (let indicePV = 2; indicePV <= maxIndice; indicePV++) {
    // VAL_X = valor del punzón si existe, sino 0
    // El "Error 2029" antes de VAL_X ya fue agregado después del NOTE anterior
    const numPunzon = indicePV - 1; // PZ-1 corresponde a IND_PV002
    const valorPunzon = punzonesMap.get(numPunzon) || 0;
    lineas.push(`VAL_X${indicePV.toString().padStart(3, '0')}=${valorPunzon}`);

    // VAL_Y = 0 (sin espacio después del =)
    lineas.push(`VAL_Y${indicePV.toString().padStart(3, '0')}=0`);

    // Si tiene ABILIT: Error 2029, luego ABILIT, luego NOTE, luego Error 2029
    if (indicesConAbilit.has(indicePV)) {
      lineas.push('Error 2029');
      lineas.push(`ABILIT${indicePV.toString().padStart(3, '0')}= `);
      lineas.push(`NOTE${indicePV.toString().padStart(3, '0')}= `);
      lineas.push('Error 2029');
    } else {
      // Si no tiene ABILIT: Error 2029, luego NOTE, luego Error 2029
      lineas.push('Error 2029');
      lineas.push(`NOTE${indicePV.toString().padStart(3, '0')}= `);
      lineas.push('Error 2029');
    }
  }

  // Agregar IND_PV192-198 (sin Error 2029, con formato diferente)
  for (let indicePV = 192; indicePV <= 198; indicePV++) {
    lineas.push(`IND_PV${indicePV.toString().padStart(3, '0')}=0`);
    lineas.push(`VAL_X${indicePV.toString().padStart(3, '0')}=0`);
    lineas.push(`VAL_Y${indicePV.toString().padStart(3, '0')}=0`);
    lineas.push(`ABILIT${indicePV.toString().padStart(3, '0')}= `);
    lineas.push(`NOTE${indicePV.toString().padStart(3, '0')}= `);
  }

  // IND_PV199 tiene formato especial (con espacios)
  lineas.push('IND_PV199= 0');
  lineas.push('VAL_X199= 0');
  lineas.push('VAL_Y199= 0');
  lineas.push('ABILIT199= ');
  lineas.push('NOTE199= ');

  // IND_PV200-220 tienen formato sin valores
  for (let indicePV = 200; indicePV <= 220; indicePV++) {
    lineas.push(`IND_PV${indicePV.toString().padStart(3, '0')}= `);
    lineas.push(`VAL_X${indicePV.toString().padStart(3, '0')}=`);
    lineas.push(`VAL_Y${indicePV.toString().padStart(3, '0')}= 0`);
    lineas.push(`ABILIT${indicePV.toString().padStart(3, '0')}= `);
    lineas.push(`NOTE${indicePV.toString().padStart(3, '0')}= `);
  }

  return lineas;
}

/**
 * Ordena los punzones por número (PZ-1, PZ-2, etc.)
 */
function ordenarPunzones(punzones) {
  return Object.entries(punzones)
    .filter(([nombre]) => nombre.startsWith('PZ-'))
    .sort(([a], [b]) => {
      const numA = parseInt(a.replace('PZ-', ''));
      const numB = parseInt(b.replace('PZ-', ''));
      return numA - numB;
    });
}

/**
 * Parsea la sección DATA a formato JSON
 */
function parsearSeccionData(lineas) {
  const resultado = {};

  for (const linea of lineas) {
    if (linea.startsWith('[') || !linea.trim()) continue;

    const match = linea.match(/([A-Z_]+)(\d+)\s*=\s*(.*)/);
    if (match) {
      const nombre = match[1] + match[2];
      const valor = match[3].trim();
      resultado[nombre] = valor;
    }
  }

  return resultado;
}

/**
 * Parsea la sección BANCO1 a formato JSON
 */
function parsearSeccionBanco1(lineas) {
  const resultado = {
    puntos: [],
  };

  let puntoActual = null;

  for (const linea of lineas) {
    if (linea.startsWith('[') || !linea.trim()) continue;

    const match = linea.match(/([A-Z_]+)(\d+)\s*=\s*(.*)/);
    if (match) {
      const tipo = match[1];
      const numero = match[2];
      const valor = match[3].trim();

      if (tipo === 'IND_PV') {
        if (puntoActual) {
          resultado.puntos.push(puntoActual);
        }
        puntoActual = {
          indice: numero,
          ind_pv: valor,
          val_x: null,
          val_y: null,
          abilit: null,
          note: null,
        };
      } else if (puntoActual) {
        puntoActual[tipo.toLowerCase()] = valor;
      }
    }
  }

  if (puntoActual) {
    resultado.puntos.push(puntoActual);
  }

  return resultado;
}
