// ============================================
// Generador de Archivos GASP para n8n
// Basado en generador.js y punzonesDisponibles.js
// ============================================

// Tabla de Punzonados Disponibles
const PUNZONES_DISPONIBLES = {
  punzonados: [
    { codigo: 'S/PZ', descripcion: 'Sin Punzonado' },
    { codigo: 'Ø10', descripcion: 'Diámetro 10' },
    { codigo: 'Ø12', descripcion: 'Diámetro 12' },
    { codigo: 'Ø14', descripcion: 'Diámetro 14' },
    { codigo: 'Ø16', descripcion: 'Diámetro 16' },
    { codigo: 'Ø18', descripcion: 'Diámetro 18' },
    { codigo: 'Ø20', descripcion: 'Diámetro 20' },
    { codigo: '14x28 L', descripcion: '14x28 L' },
    { codigo: '14x28 T', descripcion: '14x28 T' },
    { codigo: '11x25 L', descripcion: '11x25 L' },
    { codigo: '11x25 T', descripcion: '11x25 T' },
  ],

  tiposPerfiles: [
    { codigo: 'C', descripcion: 'Perfil C' },
    { codigo: 'U', descripcion: 'Perfil U' },
    { codigo: 'Z', descripcion: 'Perfil Z' },
    { codigo: 'NRV', descripcion: 'Perfil NRV' },
    { codigo: 'SIGMA', descripcion: 'Perfil SIGMA' },
  ],

  esPunzonadoValido(codigo) {
    return this.punzonados.some((p) => p.codigo === codigo);
  },

  esPerfilValido(codigo) {
    return this.tiposPerfiles.some((p) => p.codigo === codigo);
  },
};

// Funciones auxiliares
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

function determinarPerfilesActivos(tipoPerfil) {
  return {
    'Perf C': tipoPerfil === 'C',
    'Perf NRV': tipoPerfil === 'NRV',
    'Perf Z': tipoPerfil === 'Z',
    'Perf SIGMA': tipoPerfil === 'SIGMA',
    'Perf U': tipoPerfil === 'U',
  };
}

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
 * Genera el contenido del archivo de texto
 * @param {Object} datos - Datos del formulario
 * @param {string} datos.estaciones - Estaciones (ej: "5-6", "5-7", "7")
 * @param {number} datos.almaPerfil - Alma de perfil (ej: 140, 200)
 * @param {string} datos.tipoPerfil - Tipo de perfil (ej: "C", "U", "Z", "NRV", "SIGMA")
 * @param {string} datos.plano - Número de plano (ej: "GCV86")
 * @param {number} datos.longitud - Longitud del perfil
 * @param {Object} datos.punzones - Objeto con los valores de punzones (ej: { "PZ-1": 35, "PZ-2": 1385 })
 * @returns {string} - Contenido del archivo en formato texto plano
 */
function generarArchivo(datos) {
  // Validar datos de entrada
  validarDatos(datos);

  // Determinar qué perfiles están activos según el tipo de perfil
  const perfilesActivos = determinarPerfilesActivos(datos.tipoPerfil);

  // Generar sección [DATA]
  const seccionData = generarSeccionData(datos, perfilesActivos);

  // Generar sección [BANCO1]
  const seccionBanco1 = generarSeccionBanco1(datos);

  // Combinar secciones en texto plano
  const texto = [...seccionData, '', ...seccionBanco1].join('\n');

  return texto;
}

// ============================================
// Código principal para n8n
// ============================================

/**
 * Normaliza los datos de entrada a un formato estándar
 */
function normalizarDatosEntrada(datos) {
  // Si los datos ya tienen la estructura correcta, devolverlos tal cual
  if (
    datos.estaciones &&
    datos.almaPerfil &&
    datos.tipoPerfil &&
    datos.plano &&
    datos.longitud &&
    datos.punzones
  ) {
    return datos;
  }

  // Si los datos vienen en formato diferente (campos separados o mayúsculas)
  const datosNormalizados = {
    estaciones: datos.estaciones || datos.ESTACIONES || '',
    almaPerfil: parseFloat(datos.almaPerfil || datos['ALMA DE PERFIL'] || 0),
    tipoPerfil: datos.tipoPerfil || datos['TIPO DE PERFIL'] || '',
    plano: datos.plano || datos.PLANO || '',
    longitud: parseFloat(datos.longitud || datos.LONGITUD || 0),
    punzones: datos.punzones || {},
  };

  // Extraer punzones si vienen como campos separados (PZ-1, PZ-2, etc.)
  if (
    !datosNormalizados.punzones ||
    Object.keys(datosNormalizados.punzones).length === 0
  ) {
    datosNormalizados.punzones = {};
    for (const key in datos) {
      if (key.startsWith('PZ-') || key.startsWith('pz-')) {
        datosNormalizados.punzones[key] = parseFloat(datos[key]) || 0;
      }
    }
  }

  return datosNormalizados;
}

// Obtener todos los items de entrada desde n8n
const items = $input.all();

// Array para almacenar los resultados
const resultados = [];

// Procesar cada item
for (const item of items) {
  try {
    // Obtener los datos del item
    let datosEntrada = item.json;

    // Si el item tiene una propiedad "json" anidada, usarla
    if (datosEntrada.json && typeof datosEntrada.json === 'object') {
      datosEntrada = datosEntrada.json;
    }

    // Normalizar los datos de entrada
    const datosNormalizados = normalizarDatosEntrada(datosEntrada);

    // Generar el contenido del archivo
    const contenidoTxt = generarArchivo(datosNormalizados);

    // Agregar el resultado al array
    resultados.push({
      json: {
        contenido: contenidoTxt,
        plano: datosNormalizados.plano,
      },
    });
  } catch (error) {
    // En caso de error, agregar el error al resultado
    resultados.push({
      json: {
        error: true,
        mensaje: error.message,
        datosRecibidos: item.json,
      },
    });
  }
}

// Retornar todos los resultados
return resultados;
