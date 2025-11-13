# Generador de Archivos GASP

Programa simplificado para generar archivos de texto GASP desde datos del formulario.

## Estructura

- `punzonesDisponibles.js` - Tabla de referencia con punzonados y tipos de perfiles disponibles
- `generador.js` - Lógica principal para generar el archivo de texto
- `ejemplo.js` - Ejemplo de uso con datos de prueba

## Uso

### Como módulo:

```javascript
import { generarArchivo } from './generador.js';

const datos = {
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

const resultado = generarArchivo(datos);

// resultado.texto contiene el contenido del archivo en formato texto plano
// resultado.json contiene el contenido parseado en formato JSON
console.log(resultado.texto);
console.log(JSON.stringify(resultado.json, null, 2));
```

### Ejecutar ejemplo:

```bash
node ejemplo.js
```

## Formato de Datos de Entrada

```javascript
{
  estaciones: string,      // "5-6", "5-7", o "7"
  almaPerfil: number,      // Número positivo (ej: 140, 200)
  tipoPerfil: string,      // "C", "U", "Z", "NRV", o "SIGMA"
  plano: string,           // Número de plano (ej: "GCV86")
  longitud: number,        // Longitud del perfil en mm
  punzonados: {              // Objeto con valores de punzonados
    'PZ-1': number,        // Valor del punzonado 1 (posición en mm)
    'PZ-2': number,        // Valor del punzonado 2
    // ... más punzonados según sea necesario
  }
}
```

## Formato de Salida

El generador retorna un objeto con dos formatos:

1. **texto**: Contenido del archivo en formato texto plano (como el archivo C200-.txt original)
2. **json**: Contenido parseado en formato JSON con estructura:
   ```json
   {
     "DATA": {
       "DATA000": "...",
       "DATA003": "0",
       ...
     },
     "BANCO1": {
       "puntos": [
         {
           "indice": "001",
           "ind_pv": "1",
           "val_x": "0",
           "val_y": "0",
           ...
         }
       ]
     }
   }
   ```

## Validaciones

- ESTACIONES es requerido
- ALMA DE PERFIL debe ser un número positivo
- TIPO DE PERFIL debe ser uno de: C, U, Z, NRV, SIGMA
- PLANO es requerido
- LONGITUD debe ser un número positivo
- PUNZONADOS debe ser un objeto con al menos un punzonado definido
