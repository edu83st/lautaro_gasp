// Valida que cada item cumpla con la checklist de validación de planos
// Este código está diseñado para ejecutarse en un nodo Code de n8n
// También realiza transformaciones de datos (conversión de tipos, formato de punzonados)
//
// Transformaciones:
// 1. Convierte array de punzonados a objeto con formato PZ-1, PZ-2, etc.
// 2. Convierte valores string a números (longitud, almaPerfil)
//
// Checklist de validación:
// 1. El último punzonado debe ser igual a la longitud de las piezas
// 2. La cantidad de grupos de punzonados debe ser igual a las medidas obtenidas - 1
//    (exceptuando la correspondiente a la de la longitud)

// Obtener todos los items de entrada desde n8n
const items = $input.all();

// Array para almacenar los resultados validados
const resultados = [];

/**
 * Extrae los elementos del input, manejando tanto el formato con "output" como sin él
 * @param {Array} items - Items de entrada desde n8n
 * @returns {Array} - Array de elementos a procesar
 */
function extraerElementos(items) {
  const elementos = [];

  for (const item of items) {
    const json = item.json;

    // Si el item tiene un campo "output" con un array, extraer los elementos de ese array
    if (json.output && Array.isArray(json.output)) {
      for (const elemento of json.output) {
        elementos.push({ json: elemento });
      }
    } else {
      // Si no tiene "output", usar el item directamente
      elementos.push(item);
    }
  }

  return elementos;
}

// Extraer elementos del input (maneja formato con "output" o sin él)
const elementosAProcesar = extraerElementos(items);

/**
 * Convierte un array de punzonados en un objeto con formato { "PZ-1": valor1, "PZ-2": valor2, ... }
 * @param {Array} punzonadosArray - Array de valores de punzonados
 * @returns {Object} - Objeto con formato { "PZ-1": valor1, "PZ-2": valor2, ... }
 */
function convertirPunzonadosArrayAObjeto(punzonadosArray) {
  if (!Array.isArray(punzonadosArray)) {
    return {};
  }

  const punzonadosObjeto = {};
  punzonadosArray.forEach((valor, index) => {
    const clave = `PZ-${index + 1}`;
    punzonadosObjeto[clave] = valor;
  });

  return punzonadosObjeto;
}

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

// Iterar sobre cada elemento a procesar
for (const item of elementosAProcesar) {
  const json = item.json;

  // Crear una copia del elemento para no modificar el original
  const elementoValidado = { ...json };

  // Inicializar observaciones si no existen
  if (!Array.isArray(elementoValidado.observaciones)) {
    elementoValidado.observaciones = [];
  }

  // TRANSFORMACIONES: Convertir array de punzonados a objeto si es necesario
  if (Array.isArray(elementoValidado.punzonados)) {
    elementoValidado.punzonados = convertirPunzonadosArrayAObjeto(
      elementoValidado.punzonados
    );
  }

  // TRANSFORMACIONES: Asegurar que los valores numéricos sean números
  // Longitud
  const longitud =
    typeof elementoValidado.longitud === 'string'
      ? parseFloat(elementoValidado.longitud) || 0
      : elementoValidado.longitud;

  // AlmaPerfil
  if (typeof elementoValidado.almaPerfil === 'string') {
    elementoValidado.almaPerfil = parseFloat(elementoValidado.almaPerfil) || 0;
  }

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
  // Esto significa: cantidadGruposPunzonados === distancias.length - 1
  if (distancias.length > 0) {
    // Obtener cantidadGruposPunzonados del elemento o calcularlo si no existe
    let cantidadGruposPunzonados = elementoValidado.cantidadGruposPunzonados;

    // Si no existe el campo, calcularlo desde los punzonados
    if (
      cantidadGruposPunzonados === undefined ||
      cantidadGruposPunzonados === null
    ) {
      if (Array.isArray(elementoValidado.punzonados)) {
        cantidadGruposPunzonados = elementoValidado.punzonados.length;
      } else if (
        typeof elementoValidado.punzonados === 'object' &&
        elementoValidado.punzonados !== null
      ) {
        cantidadGruposPunzonados = Object.keys(
          elementoValidado.punzonados
        ).length;
      } else {
        cantidadGruposPunzonados = 0;
      }
    }

    // Asegurar que sea un número
    cantidadGruposPunzonados =
      typeof cantidadGruposPunzonados === 'string'
        ? parseFloat(cantidadGruposPunzonados)
        : cantidadGruposPunzonados;

    const cantidadDistanciasSinLongitud = distancias.length - 1;

    if (cantidadGruposPunzonados !== cantidadDistanciasSinLongitud) {
      elementoValidado.observaciones.push({
        severidad: 'error',
        campo: 'cantidadGruposPunzonados',
        descripcion: `La cantidad de grupos de punzonados (${cantidadGruposPunzonados}) no coincide con la cantidad de distancias menos 1 (${cantidadDistanciasSinLongitud}). Se esperaban ${cantidadDistanciasSinLongitud} grupos de punzonados.`,
      });
      elementoValidado.requiere_revision = true;
    }

    // Asegurar que el campo cantidadGruposPunzonados esté presente en el output
    elementoValidado.cantidadGruposPunzonados = cantidadGruposPunzonados;
  } else {
    elementoValidado.observaciones.push({
      severidad: 'warning',
      campo: 'distancias',
      descripcion: 'No se encontraron distancias para validar.',
    });
  }

  // Asegurar que requiere_revision esté definido (por defecto false)
  if (elementoValidado.requiere_revision === undefined) {
    elementoValidado.requiere_revision = false;
  }

  // Convertir observaciones a formato string con prefijo del plano
  const planoNombre = elementoValidado.plano || 'Sin identificar';
  const observacionesFormateadas = elementoValidado.observaciones.map(
    (obs) => `plano ${planoNombre} ${obs.descripcion}`
  );

  // OUTPUT: Formato simplificado con numeroChequeos, observaciones como strings y necesitaCorreccion
  resultados.push({
    json: {
      numeroChequeos: elementoValidado.numeroChequeos,
      observaciones: observacionesFormateadas,
      necesitaCorreccion: elementoValidado.requiere_revision,
    },
  });
}

// Retornar un array con todos los objetos validados
// Cada objeto tiene la estructura { json: {...} } como espera n8n
return resultados;
