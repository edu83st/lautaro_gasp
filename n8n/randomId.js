// ============================================
// Nodo n8n: Generador de Número Aleatorio
// Devuelve un número aleatorio
// ============================================

try {
  // Obtener todos los items de entrada (si existen)
  const items = $input.all();

  // Si hay items de entrada, generar un número aleatorio para cada uno
  // Si no hay items, generar un solo número aleatorio
  if (items && items.length > 0) {
    // Procesar cada item y agregar un número aleatorio
    const resultados = items.map((item) => {
      const numeroAleatorio = Math.random();

      return {
        json: {
          ...item.json,
          randomNumber: numeroAleatorio,
          randomInteger: Math.floor(numeroAleatorio * 1000000), // Número entero aleatorio de 0 a 999999
        },
      };
    });

    return resultados;
  } else {
    // Si no hay entrada, devolver un solo número aleatorio
    const numeroAleatorio = Math.random();

    return [
      {
        json: {
          randomNumber: numeroAleatorio,
          randomInteger: Math.floor(numeroAleatorio * 1000000), // Número entero aleatorio de 0 a 999999
        },
      },
    ];
  }
} catch (error) {
  throw new Error(`Error generando número aleatorio: ${error.message}`);
}
