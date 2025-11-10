// Transforma el input eliminando la estructura "output" y devolviendo solo el listado de JSONs
// Este código está diseñado para ejecutarse en un nodo Code de n8n

// Obtener todos los items de entrada desde n8n
const items = $input.all();

// Array para almacenar todos los objetos JSON encontrados
const resultados = [];

// Iterar sobre cada item
for (const item of items) {
  const json = item.json;

  // Verificar si existe la propiedad "output" y si es un array
  if (json.output && Array.isArray(json.output)) {
    // Si el output tiene elementos, agregarlos al resultado final
    if (json.output.length > 0) {
      // Iterar sobre cada elemento del array output
      for (const elemento of json.output) {
        // Si el elemento ya tiene estructura { json: {...} }, mantenerla
        // Si el elemento tiene los datos directamente, envolverlos en { json: {...} }
        if (elemento.json) {
          resultados.push(elemento);
        } else {
          // El elemento tiene los datos directamente, envolverlos en la estructura esperada por n8n
          resultados.push({
            json: elemento,
          });
        }
      }
    }
    // Si output está vacío, simplemente lo ignoramos
  }
}

// Retornar un array con todos los objetos JSON encontrados
// Cada objeto tiene la estructura { json: {...} } como espera n8n
return resultados;
