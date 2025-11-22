// Serializa los datos de planos en múltiples filas de punzonados para Google Sheets
// Este código está diseñado para ejecutarse en un nodo Code de n8n
//
// Input esperado (del nodo 'updatePlanosSerializer'):
// - Items con estructura { json: {...} } donde cada elemento tiene:
//   - plano: identificador del plano (ej: "GMB2")
//   - punzonados: ARRAY de valores (ej: [35, 7045, 7131, 7353])
//
// Procesamiento:
// 1. Obtiene todos los items del nodo 'updatePlanosSerializer'
// 2. Para cada plano, genera múltiples filas de punzonados:
//    - Una fila por cada punzonado (formato: PZ-1, PZ-2, etc.)
// 3. Cada fila contiene: Hash (identificador único), PlanoId, Medida, Valor
// 4. Retorna todas las filas en formato n8n { json: {...} }
//
// Output: Array de objetos con estructura { json: { hash, plano, medida, valor } }
// donde cada objeto representa una fila de punzonado para Google Sheets

// Función auxiliar para generar un hash único de 8 caracteres
function generateHash(input) {
  let hash = 0x811c9dc5; // FNV offset basis
  const str = String(input || '');
  for (let i = 0; i < str.length; i++) {
    hash = Math.imul(hash ^ str.charCodeAt(i), 0x01000193) >>> 0; // 16777619
  }
  const base36 = (hash >>> 0).toString(36).toUpperCase();
  return base36.padStart(8, '0').slice(-8);
}

// Obtener todos los items de entrada desde el nodo 'updatePlanosSerializer'
const items = $('updatePlanosSerializer').all();

// Array para almacenar todas las filas de medidas
const resultados = [];

// Iterar sobre cada item del nodo 'updatePlanosSerializer'
for (const item of items) {
  const json = item.json;
  const plano = json.plano || '';

  if (!plano) {
    continue; // Saltar si no hay plano
  }

  // Procesar solo punzonados
  if (Array.isArray(json.punzonados) && json.punzonados.length > 0) {
    json.punzonados.forEach((valor, index) => {
      const medida = `PZ-${index + 1}`;
      const hashSource = `${plano}_PZ-${index + 1}_${valor}`;
      const hash = generateHash(hashSource);

      resultados.push({
        json: {
          hash: hash,
          plano: plano,
          medida: medida,
          valor: valor,
        },
      });
    });
  }
}

// Retornar un array con todas las filas de punzonados
// Cada objeto tiene la estructura { json: { hash, plano, medida, valor } } como espera n8n
return resultados;
