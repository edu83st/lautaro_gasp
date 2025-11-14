// Valida que cada item cumpla con la checklist de validación de planos
// Este código está diseñado para ejecutarse en un nodo Code de n8n
//
// Checklist:
// 1. El último punzonado debe ser igual a la longitud de las piezas
// 2. La cantidad de grupos de punzonados debe ser igual a las medidas obtenidas - 1
//    (exceptuando la correspondiente a la de la longitud)

// Obtener todos los items de entrada desde n8n
const items = $input.all();

// Array para almacenar los resultados validados
const resultados = [];

/**
 * Extrae los valores de punzonados de un objeto o array y los retorna ordenados
 * @param {Object|Array} punzonados - Objeto con formato { "PZ-1": valor, ... } o array
 * @returns {Array} - Array de valores numéricos ordenados
 */
function extraerValoresPunzonados(punzonados) {
  if (Array.isArray(punzonados)) {
    return punzonados.map((p) => (typeof p === 'string' ? parseFloat(p) : p));
  }

  if (typeof punzonados === 'object' && punzonados !== null) {
    // Extraer valores del objeto y ordenarlos por la clave numérica
    const valores = Object.entries(punzonados)
      .map(([clave, valor]) => ({
        indice: parseInt(clave.replace('PZ-', '')) || 0,
        valor: typeof valor === 'string' ? parseFloat(valor) : valor,
      }))
      .sort((a, b) => a.indice - b.indice)
      .map((item) => item.valor);
    return valores;
  }

  return [];
}

/**
 * Obtiene la cantidad de punzonados desde un objeto o array
 * @param {Object|Array} punzonados - Objeto con formato { "PZ-1": valor, ... } o array
 * @returns {number} - Cantidad de punzonados
 */
function obtenerCantidadPunzonados(punzonados) {
  if (Array.isArray(punzonados)) {
    return punzonados.length;
  }

  if (typeof punzonados === 'object' && punzonados !== null) {
    return Object.keys(punzonados).length;
  }

  return 0;
}

// Iterar sobre cada item
for (const item of items) {
  const json = item.json;

  // Crear una copia del elemento para no modificar el original
  const elementoValidado = { ...json };

  // Inicializar observaciones si no existen
  if (!Array.isArray(elementoValidado.observaciones)) {
    elementoValidado.observaciones = [];
  }

  // Asegurar que los valores numéricos sean números
  const longitud =
    typeof elementoValidado.longitud === 'string'
      ? parseFloat(elementoValidado.longitud)
      : elementoValidado.longitud;

  // Extraer valores de punzonados (maneja tanto objeto como array)
  const valoresPunzonados = extraerValoresPunzonados(
    elementoValidado.punzonados
  );

  const distancias = Array.isArray(elementoValidado.distancias)
    ? elementoValidado.distancias.map((d) =>
        typeof d === 'string' ? parseFloat(d) : d
      )
    : [];

  // Validación 1: El último punzonado debe ser igual a la longitud
  if (valoresPunzonados.length > 0) {
    const ultimoPunzonado = valoresPunzonados[valoresPunzonados.length - 1];
    if (ultimoPunzonado !== longitud) {
      elementoValidado.observaciones.push({
        severidad: 'error',
        campo: 'punzonados',
        descripcion: `El último punzonado (${ultimoPunzonado}) no coincide con la longitud de la pieza (${longitud}). Diferencia: ${Math.abs(
          ultimoPunzonado - longitud
        )}`,
      });
      elementoValidado.requiere_revision = true;
    }
  } else {
    elementoValidado.observaciones.push({
      severidad: 'warning',
      campo: 'punzonados',
      descripcion: 'No se encontraron punzonados para validar.',
    });
  }

  // Validación 2: La cantidad de grupos de punzonados debe ser igual a las medidas obtenidas - 1
  // (exceptuando la correspondiente a la de la longitud)
  // Esto significa: cantidadPunzonados === distancias.length - 1
  if (distancias.length > 0) {
    const cantidadPunzonados = obtenerCantidadPunzonados(
      elementoValidado.punzonados
    );
    const cantidadDistanciasSinLongitud = distancias.length - 1;

    if (cantidadPunzonados !== cantidadDistanciasSinLongitud) {
      elementoValidado.observaciones.push({
        severidad: 'error',
        campo: 'punzonados',
        descripcion: `La cantidad de punzonados (${cantidadPunzonados}) no coincide con la cantidad de distancias menos 1 (${cantidadDistanciasSinLongitud}). Se esperaban ${cantidadDistanciasSinLongitud} punzonados.`,
      });
      elementoValidado.requiere_revision = true;
    }
  } else {
    elementoValidado.observaciones.push({
      severidad: 'warning',
      campo: 'distancias',
      descripcion: 'No se encontraron distancias para validar.',
    });
  }

  // Actualizar el elemento con los valores numéricos convertidos
  elementoValidado.longitud = longitud;
  elementoValidado.distancias = distancias;
  // Mantener el formato original de punzonados (objeto o array)

  // Envolver el elemento validado en la estructura esperada por n8n
  resultados.push({
    json: elementoValidado,
  });
}

// Retornar un array con todos los objetos validados
// Cada objeto tiene la estructura { json: {...} } como espera n8n
return resultados;
