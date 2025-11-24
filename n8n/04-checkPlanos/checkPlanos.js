// Valida que cada item cumpla con la checklist de validación de planos
//
// Checklist de validación:
// 1. Todos los campos requeridos han sido completados (estaciones, almaPerfil, tipoPerfil, plano, longitud, cantidadGruposPunzonados)
// 2. La sumatoria de las distancias corresponde al largo de la pieza
// 3. El último punzonado coincide con el largo de la pieza
// 4. La cantidad de grupos de punzonados equivale al número de punzonados - 1 (siendo el último asociado al largo de la pieza)
//
// Output:
// Retorna un array con objetos que contienen:
// - plano: nombre del plano
// - numeroChequeos: valor del input (se conserva tal cual)
// - checks: objeto con los resultados de cada validación (boolean)
// - necesitaRevision: boolean (true si algún check falla)

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

// Iterar sobre cada elemento a procesar
for (const item of elementosAProcesar) {
  const json = item.json;

  // Obtener valores del elemento
  const plano = json.plano || null;
  const numeroChequeos =
    json.numeroChequeos !== undefined ? json.numeroChequeos : 0;

  // Campos requeridos
  const estaciones = json.estaciones;
  const almaPerfil = json.almaPerfil;
  const tipoPerfil = json.tipoPerfil;
  const longitud =
    typeof json.longitud === 'string'
      ? parseFloat(json.longitud)
      : json.longitud;
  const cantidadGruposPunzonados = json.cantidadGruposPunzonados;

  // Arrays
  const punzonados = Array.isArray(json.punzonados)
    ? json.punzonados.map((p) => (typeof p === 'string' ? parseFloat(p) : p))
    : [];
  const distancias = Array.isArray(json.distancias)
    ? json.distancias.map((d) => (typeof d === 'string' ? parseFloat(d) : d))
    : [];

  // CHECK 1: Todos los campos requeridos han sido completados
  const campos_completos =
    estaciones !== undefined &&
    estaciones !== null &&
    estaciones !== '' &&
    almaPerfil !== undefined &&
    almaPerfil !== null &&
    tipoPerfil !== undefined &&
    tipoPerfil !== null &&
    tipoPerfil !== '' &&
    plano !== undefined &&
    plano !== null &&
    plano !== '' &&
    longitud !== undefined &&
    longitud !== null &&
    !isNaN(longitud) &&
    longitud > 0 &&
    cantidadGruposPunzonados !== undefined &&
    cantidadGruposPunzonados !== null &&
    !isNaN(cantidadGruposPunzonados);

  // CHECK 2: La sumatoria de las distancias corresponde al largo de la pieza
  const sumaDistancias = distancias.reduce((sum, d) => sum + d, 0);
  const sumataria_distancias =
    distancias.length > 0 && Math.abs(sumaDistancias - longitud) < 0.01; // tolerancia para errores de punto flotante

  // CHECK 3: El último punzonado coincide con el largo de la pieza
  const ultimoPunzonado =
    punzonados.length > 0 ? punzonados[punzonados.length - 1] : null;
  const ultimo_punzonado =
    ultimoPunzonado !== null && ultimoPunzonado === longitud;

  // CHECK 4: La cantidad de grupos de punzonados equivale al número de punzonados - 1
  // (siendo el último asociado al largo de la pieza)
  const cantidad_punzonados =
    punzonados.length > 0 && cantidadGruposPunzonados === punzonados.length - 1;

  // Determinar si necesita revisión (si algún check falla)
  const necesitaRevision =
    !campos_completos ||
    !sumataria_distancias ||
    !ultimo_punzonado ||
    !cantidad_punzonados;

  // Construir el resultado
  resultados.push({
    json: {
      plano: plano,
      numeroChequeos: numeroChequeos,
      checks: {
        campos_completos: campos_completos,
        sumataria_distancias: sumataria_distancias,
        ultimo_punzonado: ultimo_punzonado,
        cantidad_punzonados: cantidad_punzonados,
      },
      necesitaRevision: necesitaRevision,
    },
  });
}

// Retornar un array con todos los objetos validados
// Cada objeto tiene la estructura { json: {...} } como espera n8n
return resultados;
