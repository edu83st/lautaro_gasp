/**
 * Ejemplo de uso del generador
 */

import { generarArchivo } from './generador.js';

// Datos de ejemplo según los valores proporcionados
const datosEjemplo = {
  estaciones: '5-6',
  almaPerfil: 140,
  tipoPerfil: 'C',
  plano: 'GCV86',
  longitud: 5630,
  punzonados: {
    'PZ-1': 35,
    'PZ-2': 1385,
    'PZ-3': 2775,
    'PZ-4': 4165,
    'PZ-5': 5515,
    'PZ-6': 5550,
  },
};

try {
  console.log('Generando archivo con los siguientes datos:');
  console.log(JSON.stringify(datosEjemplo, null, 2));
  console.log('\n' + '='.repeat(50) + '\n');

  const resultado = generarArchivo(datosEjemplo);

  console.log('CONTENIDO DEL ARCHIVO (TEXTO):');
  console.log(resultado.texto);

  console.log('\n' + '='.repeat(50) + '\n');

  console.log('CONTENIDO DEL ARCHIVO (JSON):');
  console.log(JSON.stringify(resultado.json, null, 2));
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
