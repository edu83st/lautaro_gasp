// ============================================
// Nodo n8n: Generador de Número Aleatorio y Nombre de Carpeta
// Devuelve un número aleatorio y un nombre de carpeta con fecha/hora
// ============================================

/**
 * Genera un nombre de carpeta con formato: YYYY-MM-DDTHH:MM:SS - randomId
 */
function generarFolderName(randomId) {
  const ahora = new Date();

  const año = ahora.getFullYear();
  const mes = String(ahora.getMonth() + 1).padStart(2, '0');
  const dia = String(ahora.getDate()).padStart(2, '0');
  const horas = String(ahora.getHours()).padStart(2, '0');
  const minutos = String(ahora.getMinutes()).padStart(2, '0');
  const segundos = String(ahora.getSeconds()).padStart(2, '0');

  const fechaHora = `${año}-${mes}-${dia}T${horas}:${minutos}:${segundos}`;

  return `${fechaHora} - ${randomId}`;
}

try {
  // Obtener todos los items de entrada (si existen)
  const items = $input.all();

  // Si hay items de entrada, generar un número aleatorio para cada uno
  // Si no hay items, generar un solo número aleatorio
  if (items && items.length > 0) {
    // Procesar cada item y agregar un número aleatorio
    const resultados = items.map((item) => {
      const numeroAleatorio = Math.random();
      const randomInteger = Math.floor(numeroAleatorio * 1000000); // Número entero aleatorio de 0 a 999999
      const folderName = generarFolderName(randomInteger);

      return {
        json: {
          ...item.json,
          randomNumber: numeroAleatorio,
          randomInteger: randomInteger,
          folderName: folderName,
        },
      };
    });

    return resultados;
  } else {
    // Si no hay entrada, devolver un solo número aleatorio
    const numeroAleatorio = Math.random();
    const randomInteger = Math.floor(numeroAleatorio * 1000000); // Número entero aleatorio de 0 a 999999
    const folderName = generarFolderName(randomInteger);

    return [
      {
        json: {
          randomNumber: numeroAleatorio,
          randomInteger: randomInteger,
          folderName: folderName,
        },
      },
    ];
  }
} catch (error) {
  throw new Error(`Error generando número aleatorio: ${error.message}`);
}
