// Serializa los datos de planos para enviarlos a Google Sheets
// Este código está diseñado para ejecutarse en un nodo Code de n8n
//
// Input esperado (del nodo 'AI Agent'):
// - Items con estructura { json: { output: [...] } } donde cada elemento del array tiene:
//   - plano, estaciones, almaPerfil, tipoPerfil, longitud
//   - punzonados como ARRAY (ej: [35, 7045, 7131, 7353])
//   - observaciones como ARRAY de objetos con { severidad, campo, descripcion }
//
// Procesamiento:
// 1. Obtiene todos los items del nodo 'AI Agent'
// 2. Itera sobre cada item extrayendo el campo "output" (que es un array)
// 3. Transforma cada elemento extraído al formato esperado por Google Sheets:
//    - plano: usado como Id y Plano
//    - estaciones: Estaciones
//    - almaPerfil: Alma Perfil
//    - tipoPerfil: Tipo Perfil
//    - longitud: Longitud
//    - punzonados: se mantiene como array para calcular la cantidad en Google Sheets
//    - observaciones: convierte el array de observaciones a string legible
// 4. Retorna los elementos transformados en formato n8n { json: {...} }
//
// Output: Array de objetos con estructura { json: {...} } donde cada json contiene
// los campos formateados para Google Sheets

// Función auxiliar para convertir observaciones a string
function formatObservaciones(observaciones) {
  if (
    !observaciones ||
    !Array.isArray(observaciones) ||
    observaciones.length === 0
  ) {
    return '';
  }

  // Formatear cada observación como: "[severidad] campo: descripcion"
  const observacionesFormateadas = observaciones.map((obs) => {
    const severidad = obs.severidad || 'info';
    const campo = obs.campo || 'general';
    const descripcion = obs.descripcion || '';
    return `[${severidad.toUpperCase()}] ${campo}: ${descripcion}`;
  });

  // Unir todas las observaciones con punto y coma
  return observacionesFormateadas.join('; ');
}

// Obtener todos los items de entrada desde el nodo 'AI Agent'
const items = $('AI Agent').all();

// Array para almacenar todos los objetos JSON transformados
const resultados = [];

// Iterar sobre cada item del nodo 'AI Agent'
for (const item of items) {
  const json = item.json;

  // Verificar si existe la propiedad "output" y si es un array
  if (json.output && Array.isArray(json.output)) {
    // Si el output tiene elementos, procesarlos
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

        // Asegurar que punzonados sea un array
        if (!Array.isArray(elementoTransformado.punzonados)) {
          elementoTransformado.punzonados = [];
        }

        // Convertir observaciones a string legible
        elementoTransformado.observaciones = formatObservaciones(
          elementoTransformado.observaciones
        );

        // Envolver el elemento transformado en la estructura esperada por n8n
        resultados.push({
          json: elementoTransformado,
        });
      }
    }
    // Si output está vacío, simplemente lo ignoramos
  }
}

// Retornar un array con todos los objetos JSON transformados
// Cada objeto tiene la estructura { json: {...} } como espera n8n
return resultados;
