// Transforma el input eliminando la estructura "output" y devolviendo solo el listado de JSONs
// Este código está diseñado para ejecutarse en un nodo Code de n8n
// También transforma el array de punzonados en un objeto con formato PZ-1, PZ-2, etc.

// Obtener todos los items de entrada desde n8n
const items = $('AI Agent').first().json;
return { items };

// Array para almacenar todos los objetos JSON encontrados
const resultados = [];

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

// Iterar sobre cada item
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

        // Convertir el array de punzonados a objeto si existe
        if (Array.isArray(elementoTransformado.punzonados)) {
          elementoTransformado.punzonados = convertirPunzonadosArrayAObjeto(
            elementoTransformado.punzonados
          );
        }

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
