// Script de prueba para compareAndMerge.js
// Ejecutar con: node test-compareAndMerge.js

const fs = require('fs');
const path = require('path');

// Cargar las funciones del módulo principal
const compareAndMergeCode = fs.readFileSync(
  path.join(__dirname, 'compareAndMerge.js'),
  'utf8'
);

// Extraer las funciones necesarias (simplificado para testing)
function deepEqual(val1, val2) {
  if (val1 === val2) {
    return true;
  }
  if (val1 == null || val2 == null) {
    return val1 === val2;
  }
  if (typeof val1 !== typeof val2) {
    return false;
  }
  if (Array.isArray(val1) && Array.isArray(val2)) {
    if (val1.length !== val2.length) {
      return false;
    }
    for (let i = 0; i < val1.length; i++) {
      if (!deepEqual(val1[i], val2[i])) {
        return false;
      }
    }
    return true;
  }
  if (typeof val1 === 'object' && typeof val2 === 'object') {
    const keys1 = Object.keys(val1).sort();
    const keys2 = Object.keys(val2).sort();
    if (keys1.length !== keys2.length) {
      return false;
    }
    for (const key of keys1) {
      if (!keys2.includes(key)) {
        return false;
      }
      if (!deepEqual(val1[key], val2[key])) {
        return false;
      }
    }
    return true;
  }
  return val1 === val2;
}

function encontrarDiferencias(obj1, obj2) {
  const diferencias = [];
  const todasLasClaves = new Set([
    ...Object.keys(obj1),
    ...Object.keys(obj2),
  ]);

  for (const clave of todasLasClaves) {
    if (clave === 'observaciones') {
      continue;
    }

    const valor1 = obj1[clave];
    const valor2 = obj2[clave];

    if (!(clave in obj1)) {
      diferencias.push({
        campo: clave,
        tipo: 'faltante_en_respuesta_1',
        valor1: undefined,
        valor2: valor2,
      });
      continue;
    }

    if (!(clave in obj2)) {
      diferencias.push({
        campo: clave,
        tipo: 'faltante_en_respuesta_2',
        valor1: valor1,
        valor2: undefined,
      });
      continue;
    }

    if (!deepEqual(valor1, valor2)) {
      diferencias.push({
        campo: clave,
        tipo: 'diferencia',
        valor1: valor1,
        valor2: valor2,
      });
    }
  }

  return diferencias;
}

function mergeObservaciones(obs1, obs2) {
  const observaciones1 = Array.isArray(obs1) ? obs1 : [];
  const observaciones2 = Array.isArray(obs2) ? obs2 : [];
  const todasLasObservaciones = [...observaciones1, ...observaciones2];
  const observacionesUnicas = [];
  const vistas = new Set();

  for (const obs of todasLasObservaciones) {
    const clave = JSON.stringify(obs);
    if (!vistas.has(clave)) {
      vistas.add(clave);
      observacionesUnicas.push(obs);
    }
  }

  return observacionesUnicas;
}

function compararYMergear(respuesta1, respuesta2) {
  const diferencias = encontrarDiferencias(respuesta1, respuesta2);
  const observacionesMergeadas = mergeObservaciones(
    respuesta1.observaciones,
    respuesta2.observaciones
  );
  const tieneDiferencias = diferencias.length > 0;

  const resultado = {
    ...respuesta1,
    observaciones: observacionesMergeadas,
  };

  return {
    tieneDiferencias: tieneDiferencias,
    diferencias: diferencias,
    resultado: resultado,
    respuesta1: respuesta1,
    respuesta2: respuesta2,
  };
}

// Cargar el archivo de prueba
const mockData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'mock-2-responses.json'), 'utf8')
);

const respuesta1 = mockData[0];
const respuesta2 = mockData[1];

console.log('=== Comparación de Respuestas ===\n');
console.log('Respuesta 1:', JSON.stringify(respuesta1, null, 2));
console.log('\nRespuesta 2:', JSON.stringify(respuesta2, null, 2));

const resultado = compararYMergear(respuesta1, respuesta2);

// Crear el objeto resultado final (simulando el formato de salida del script)
const resultadoFinal = {
  ...resultado.resultado,
  diferencias: resultado.diferencias,
  requiereCorreccion: resultado.tieneDiferencias,
};

console.log('\n=== Resultado de la Comparación ===\n');
console.log('Tiene diferencias:', resultado.tieneDiferencias);
console.log('\nDiferencias encontradas:', JSON.stringify(resultado.diferencias, null, 2));
console.log('\nObservaciones mergeadas:', JSON.stringify(resultado.resultado.observaciones, null, 2));
console.log('\nResultado final (formato de salida):', JSON.stringify(resultadoFinal, null, 2));

// Verificación
console.log('\n=== Verificación ===');
if (resultado.tieneDiferencias) {
  console.log('✅ Se detectaron diferencias correctamente');
  console.log(`   - Campo con diferencia: ${resultado.diferencias[0].campo}`);
  console.log(`   - Valor en respuesta 1: ${JSON.stringify(resultado.diferencias[0].valor1)}`);
  console.log(`   - Valor en respuesta 2: ${JSON.stringify(resultado.diferencias[0].valor2)}`);
} else {
  console.log('❌ No se detectaron diferencias (esto sería incorrecto en este caso)');
}

if (resultado.resultado.observaciones.length > 0) {
  console.log('✅ Las observaciones se mergearon correctamente');
  console.log(`   - Total de observaciones: ${resultado.resultado.observaciones.length}`);
} else {
  console.log('⚠️  No hay observaciones en el resultado mergeado');
}

