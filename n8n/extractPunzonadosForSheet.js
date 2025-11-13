// ============================================
// Extracción de Punzonados para Sheet
// Extrae los punzonados de un objeto y los formatea para una hoja de cálculo
// Formato de salida: cada fila tiene {hash: "GMB3_PZ-1", medida: "PZ-1", valor: 82}
// ============================================

/**
 * Extrae los punzonados de un objeto y los convierte en un array de objetos
 * con formato {medida: "PZ-1", valor: 82} ordenados por número
 * @param {Object} punzonadosObj - Objeto con formato { "PZ-1": 82, "PZ-2": 168, ... }
 * @returns {Array} - Array de objetos [{medida: "PZ-1", valor: 82}, ...]
 */
function extraerPunzonadosParaSheet(punzonadosObj) {
  if (!punzonadosObj || typeof punzonadosObj !== 'object') {
    return [];
  }

  // Convertir el objeto a un array de pares [clave, valor]
  const punzonadosArray = Object.entries(punzonadosObj)
    // Filtrar solo las claves que empiezan con "PZ-"
    .filter(([clave]) => clave.startsWith('PZ-'))
    // Ordenar por número (PZ-1, PZ-2, PZ-10, etc.)
    .sort(([claveA], [claveB]) => {
      const numA = parseInt(claveA.replace('PZ-', ''));
      const numB = parseInt(claveB.replace('PZ-', ''));
      return numA - numB;
    })
    // Transformar a formato {medida, valor}
    .map(([medida, valor]) => ({
      medida: medida,
      valor: typeof valor === 'number' ? valor : parseFloat(valor) || 0,
    }));

  return punzonadosArray;
}

// ============================================
// Código principal para n8n
// ============================================

// Obtener todos los items de entrada desde n8n
const items = $input.all();

// Array para almacenar los resultados (cada fila de la sheet)
const resultados = [];

// Iterar sobre cada item de entrada
for (const item of items) {
  let datos = item.json;

  // Si los datos están dentro de un array, extraer el primer elemento
  if (Array.isArray(datos)) {
    if (datos.length === 0) {
      continue; // Saltar arrays vacíos
    }
    datos = datos[0];
  }

  // Si hay una propiedad "json" anidada, usarla
  if (datos.json && typeof datos.json === 'object') {
    datos = datos.json;
  }

  // Verificar que existe el campo punzonados
  if (!datos.punzonados) {
    // Si no hay punzonados, crear una fila vacía o saltar
    // Opcional: puedes agregar una fila con valores vacíos si lo necesitas
    continue;
  }

  // Extraer los punzonados y convertirlos al formato para la sheet
  const punzonadosParaSheet = extraerPunzonadosParaSheet(datos.punzonados);

  // Obtener el plano para generar el hash
  const plano = datos.plano || '';

  // Crear un item por cada punzonado (cada fila de la sheet)
  for (const punzonado of punzonadosParaSheet) {
    // Generar hash formado por plano y medida
    const hash = plano ? `${plano}_${punzonado.medida}` : punzonado.medida;

    resultados.push({
      json: {
        hash: hash,
        plano: plano,
        medida: punzonado.medida,
        valor: punzonado.valor,
        // Opcional: descomentar para incluir información adicional
        // estaciones: datos.estaciones || '',
      },
    });
  }
}

// Retornar todos los resultados (cada uno es una fila de la sheet)
return resultados;
