// Script de prueba para extractPunzonadosForSheet.js
// Ejecutar con: node test-extractPunzonados.js

const fs = require('fs');
const path = require('path');

// Función extraída del script principal
function extraerPunzonadosParaSheet(punzonadosObj) {
  if (!punzonadosObj || typeof punzonadosObj !== 'object') {
    return [];
  }

  const punzonadosArray = Object.entries(punzonadosObj)
    .filter(([clave]) => clave.startsWith('PZ-'))
    .sort(([claveA], [claveB]) => {
      const numA = parseInt(claveA.replace('PZ-', ''));
      const numB = parseInt(claveB.replace('PZ-', ''));
      return numA - numB;
    })
    .map(([medida, valor]) => ({
      medida: medida,
      valor: typeof valor === 'number' ? valor : parseFloat(valor) || 0,
    }));

  return punzonadosArray;
}

// Datos de prueba basados en el input proporcionado
const inputData = [
  {
    estaciones: '5-6',
    almaPerfil: 220,
    tipoPerfil: 'C',
    plano: 'GMB3',
    longitud: 7213,
    punzonados: {
      'PZ-1': 82,
      'PZ-2': 168,
      'PZ-3': 7178,
      'PZ-4': 7213,
    },
    distancias: [82, 86, 7010, 35],
    observaciones: [
      {
        tipo: 'info',
        campo: 'general',
        mensaje: 'Extracción completada exitosamente. Todas las validaciones pasaron.',
      },
    ],
    requiere_revision: false,
    diferencias: [
      {
        campo: 'estaciones',
        tipo: 'diferencia',
        valor1: '5-6',
        valor2: '',
      },
    ],
    requiereCorreccion: true,
  },
];

console.log('=== Prueba de Extracción de Punzonados para Sheet ===\n');
console.log('Input:', JSON.stringify(inputData, null, 2));

// Simular el procesamiento del script
const resultados = [];

for (const item of inputData) {
  let datos = item;

  if (!datos.punzonados) {
    continue;
  }

  const punzonadosParaSheet = extraerPunzonadosParaSheet(datos.punzonados);

  // Obtener el plano para generar el hash
  const plano = datos.plano || '';

  for (const punzonado of punzonadosParaSheet) {
    // Generar hash formado por plano y medida
    const hash = plano ? `${plano}_${punzonado.medida}` : punzonado.medida;

    resultados.push({
      json: {
        hash: hash,
        plano: plano,
        medida: punzonado.medida,
        valor: punzonado.valor,
        // Opcional: descomentar para incluir información adicional
        // estaciones: datos.estaciones || '',
      },
    });
  }
}

console.log('\n=== Resultado (Formato para Sheet) ===\n');
console.log('Total de filas:', resultados.length);
console.log('\nFilas generadas:');
resultados.forEach((resultado, index) => {
  console.log(`Fila ${index + 1}:`, JSON.stringify(resultado.json, null, 2));
});

console.log('\n=== Formato Tabular (para Sheet) ===\n');
console.log('Hash | Plano | Medida | Valor');
console.log('-----|-------|--------|------');
resultados.forEach((resultado) => {
  console.log(
    `${resultado.json.hash.padEnd(10)} | ${(resultado.json.plano || '').padEnd(5)} | ${resultado.json.medida.padEnd(6)} | ${resultado.json.valor}`
  );
});

// Verificación
console.log('\n=== Verificación ===');
if (resultados.length === 4) {
  console.log('✅ Se generaron 4 filas correctamente');
} else {
  console.log(`❌ Se esperaban 4 filas, se generaron ${resultados.length}`);
}

const medidasEsperadas = ['PZ-1', 'PZ-2', 'PZ-3', 'PZ-4'];
const medidasObtenidas = resultados.map((r) => r.json.medida);
if (JSON.stringify(medidasEsperadas) === JSON.stringify(medidasObtenidas)) {
  console.log('✅ Las medidas están en el orden correcto');
} else {
  console.log('❌ Las medidas no están en el orden correcto');
  console.log('   Esperadas:', medidasEsperadas);
  console.log('   Obtenidas:', medidasObtenidas);
}

const valoresEsperados = [82, 168, 7178, 7213];
const valoresObtenidos = resultados.map((r) => r.json.valor);
if (JSON.stringify(valoresEsperados) === JSON.stringify(valoresObtenidos)) {
  console.log('✅ Los valores son correctos');
} else {
  console.log('❌ Los valores no coinciden');
  console.log('   Esperados:', valoresEsperados);
  console.log('   Obtenidos:', valoresObtenidos);
}

