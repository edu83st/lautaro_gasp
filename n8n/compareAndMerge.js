// ============================================
// Comparador y Merge de Respuestas de Agentes
// Compara dos respuestas de agentes y detecta diferencias
// Merge las observaciones de ambas respuestas
// ============================================

/**
 * Compara dos valores profundamente, considerando objetos y arrays
 * @param {*} val1 - Primer valor a comparar
 * @param {*} val2 - Segundo valor a comparar
 * @returns {boolean} - true si son iguales, false si son diferentes
 */
function deepEqual(val1, val2) {
  // Si son el mismo valor primitivo
  if (val1 === val2) {
    return true;
  }

  // Si alguno es null o undefined
  if (val1 == null || val2 == null) {
    return val1 === val2;
  }

  // Si son de tipos diferentes
  if (typeof val1 !== typeof val2) {
    return false;
  }

  // Si son arrays
  if (Array.isArray(val1) && Array.isArray(val2)) {
    if (val1.length !== val2.length) {
      return false;
    }
    for (let i = 0; i < val1.length; i++) {
      if (!deepEqual(val1[i], val2[i])) {
        return false;
      }
    }
    return true;
  }

  // Si son objetos
  if (typeof val1 === 'object' && typeof val2 === 'object') {
    const keys1 = Object.keys(val1).sort();
    const keys2 = Object.keys(val2).sort();

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (const key of keys1) {
      if (!keys2.includes(key)) {
        return false;
      }
      if (!deepEqual(val1[key], val2[key])) {
        return false;
      }
    }
    return true;
  }

  // Para otros tipos, comparación directa
  return val1 === val2;
}

/**
 * Encuentra las diferencias entre dos objetos (excluyendo observaciones)
 * @param {Object} obj1 - Primer objeto
 * @param {Object} obj2 - Segundo objeto
 * @returns {Array} - Array de objetos con información sobre las diferencias
 */
function encontrarDiferencias(obj1, obj2) {
  const diferencias = [];
  const todasLasClaves = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);

  for (const clave of todasLasClaves) {
    // Saltar el campo observaciones
    if (clave === 'observaciones') {
      continue;
    }

    const valor1 = obj1[clave];
    const valor2 = obj2[clave];

    // Si la clave no existe en uno de los objetos
    if (!(clave in obj1)) {
      diferencias.push({
        campo: clave,
        tipo: 'faltante_en_respuesta_1',
        valor1: undefined,
        valor2: valor2,
      });
      continue;
    }

    if (!(clave in obj2)) {
      diferencias.push({
        campo: clave,
        tipo: 'faltante_en_respuesta_2',
        valor1: valor1,
        valor2: undefined,
      });
      continue;
    }

    // Comparar valores profundamente
    if (!deepEqual(valor1, valor2)) {
      diferencias.push({
        campo: clave,
        tipo: 'diferencia',
        valor1: valor1,
        valor2: valor2,
      });
    }
  }

  return diferencias;
}

/**
 * Merge las observaciones de ambas respuestas
 * Elimina duplicados basándose en el contenido completo del objeto
 * @param {Array} obs1 - Observaciones de la primera respuesta
 * @param {Array} obs2 - Observaciones de la segunda respuesta
 * @returns {Array} - Array con observaciones mergeadas sin duplicados
 */
function mergeObservaciones(obs1, obs2) {
  const observaciones1 = Array.isArray(obs1) ? obs1 : [];
  const observaciones2 = Array.isArray(obs2) ? obs2 : [];

  // Combinar ambas arrays
  const todasLasObservaciones = [...observaciones1, ...observaciones2];

  // Eliminar duplicados comparando el contenido completo
  const observacionesUnicas = [];
  const vistas = new Set();

  for (const obs of todasLasObservaciones) {
    // Crear una clave única basada en el contenido del objeto
    const clave = JSON.stringify(obs);
    if (!vistas.has(clave)) {
      vistas.add(clave);
      observacionesUnicas.push(obs);
    }
  }

  return observacionesUnicas;
}

/**
 * Función principal que compara y mergea las respuestas
 * @param {Object} respuesta1 - Primera respuesta del agente
 * @param {Object} respuesta2 - Segunda respuesta del agente
 * @returns {Object} - Objeto con el resultado de la comparación y merge
 */
function compararYMergear(respuesta1, respuesta2) {
  // Encontrar diferencias (excluyendo observaciones)
  const diferencias = encontrarDiferencias(respuesta1, respuesta2);

  // Mergear observaciones
  const observacionesMergeadas = mergeObservaciones(
    respuesta1.observaciones,
    respuesta2.observaciones
  );

  // Determinar si hay diferencias
  const tieneDiferencias = diferencias.length > 0;

  // Crear objeto resultado con los datos de la primera respuesta como base
  // (o podrías usar la segunda, o una estrategia de resolución de conflictos)
  const resultado = {
    ...respuesta1,
    observaciones: observacionesMergeadas,
  };

  return {
    tieneDiferencias: tieneDiferencias,
    diferencias: diferencias,
    resultado: resultado,
    respuesta1: respuesta1,
    respuesta2: respuesta2,
  };
}

// ============================================
// Código principal para n8n
// ============================================

// Obtener todos los items de entrada desde n8n
const items = $input.all();

// Verificar que hay exactamente 2 items
if (items.length !== 2) {
  throw new Error(
    `Se esperaban exactamente 2 respuestas, pero se recibieron ${items.length}`
  );
}

// Obtener las dos respuestas
const respuesta1 = items[0].json;
const respuesta2 = items[1].json;

// Si las respuestas están dentro de un array, extraer el primer elemento
// (asumiendo que cada respuesta es un array con un objeto)
let resp1 = Array.isArray(respuesta1) ? respuesta1[0] : respuesta1;
let resp2 = Array.isArray(respuesta2) ? respuesta2[0] : respuesta2;

// Si hay una propiedad "json" anidada, usarla
if (resp1.json && typeof resp1.json === 'object') {
  resp1 = resp1.json;
}
if (resp2.json && typeof resp2.json === 'object') {
  resp2 = resp2.json;
}

// Comparar y mergear
const resultado = compararYMergear(resp1, resp2);

// Crear el objeto resultado final con los datos mergeados y las diferencias en una key separada
const resultadoFinal = {
  ...resultado.resultado,
  diferencias: resultado.diferencias,
  requiereCorreccion: resultado.tieneDiferencias,
};

// Retornar el resultado en formato n8n
return [
  {
    json: resultadoFinal,
  },
];
