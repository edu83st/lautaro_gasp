// Transforma el input eliminando la estructura "output" y devolviendo solo el listado de JSONs
// Este código está diseñado para ejecutarse en un nodo Code de n8n
//
// Input esperado (del nodo 'AI Agent'):
// - Items con estructura { json: { output: [...] } } donde cada elemento del array tiene:
//   - punzonados como ARRAY (ej: [35, 7045, 7131, 7353])
//   - longitud y almaPerfil pueden venir como string o número
//
// Procesamiento:
// 1. Obtiene todos los items del nodo 'AI Agent'
// 2. Itera sobre cada item extrayendo el campo "output" (que es un array)
// 3. Extrae cada elemento del array "output" y los "aplana" eliminando la estructura anidada
// 4. Transforma cada elemento extraído:
//    - Convierte longitud y almaPerfil de string a número si es necesario
//    - Los punzonados se mantienen como array (no se transforman)
// 5. Retorna todos los elementos transformados en formato n8n { json: {...} }
//
// Output: Array de objetos con estructura { json: {...} } donde cada json contiene
// todos los campos del elemento original con las transformaciones aplicadas
// (punzonados se mantienen como array)

// Obtener todos los items de entrada desde el nodo 'AI Agent'
const items = $('AI Agent').all();

// Array para almacenar todos los objetos JSON encontrados
const resultados = [];

// Iterar sobre cada item del nodo 'AI Agent'
for (const item of items) {
  const json = item.json;

  // Verificar si existe la propiedad "output" y si es un array
  if (json.output && Array.isArray(json.output)) {
    // Si el output tiene elementos, agregarlos al resultado final
    if (json.output.length > 0) {
      // Iterar sobre cada elemento del array output
      for (const elemento of json.output) {
        // Crear una copia del elemento para no modificar el original
        const elementoTransformado = { ...elemento };

        // Asegurar que longitud sea un número si viene como string
        if (typeof elementoTransformado.longitud === 'string') {
          elementoTransformado.longitud =
            parseFloat(elementoTransformado.longitud) || 0;
        }

        // Asegurar que almaPerfil sea un número si viene como string
        if (typeof elementoTransformado.almaPerfil === 'string') {
          elementoTransformado.almaPerfil =
            parseFloat(elementoTransformado.almaPerfil) || 0;
        }

        // Envolver el elemento transformado en la estructura esperada por n8n
        resultados.push({
          json: elementoTransformado,
        });
      }
    }
    // Si output está vacío, simplemente lo ignoramos
  }
}

// Retornar un array con todos los objetos JSON encontrados
// Cada objeto tiene la estructura { json: {...} } como espera n8n
return resultados;
