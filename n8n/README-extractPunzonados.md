# Extracción de Punzonados para Sheet

Este script extrae los punzonados de un objeto y los formatea para una hoja de cálculo (Google Sheets, Excel, etc.), donde cada fila representa un punzonado con sus columnas `medida` y `valor`.

## Propósito

Transformar los punzonados que vienen en formato objeto `{"PZ-1": 82, "PZ-2": 168, ...}` en filas de una hoja de cálculo con formato `{medida: "PZ-1", valor: 82}`.

## Formato de Entrada

El script espera recibir uno o más items desde n8n, cada uno conteniendo un objeto con el campo `punzonados`.

### Estructura esperada:

```json
[
  {
    "estaciones": "5-6",
    "almaPerfil": 220,
    "tipoPerfil": "C",
    "plano": "GMB3",
    "longitud": 7213,
    "punzonados": {
      "PZ-1": 82,
      "PZ-2": 168,
      "PZ-3": 7178,
      "PZ-4": 7213
    },
    "distancias": [82, 86, 7010, 35],
    "observaciones": [...],
    "requiere_revision": false,
    "diferencias": [...],
    "requiereCorreccion": true
  }
]
```

## Formato de Salida

El script retorna un array de items, donde cada item es una fila de la hoja de cálculo:

```json
[
  {
    "json": {
      "hash": "GMB3_PZ-1",
      "plano": "GMB3",
      "medida": "PZ-1",
      "valor": 82
    }
  },
  {
    "json": {
      "hash": "GMB3_PZ-2",
      "plano": "GMB3",
      "medida": "PZ-2",
      "valor": 168
    }
  },
  {
    "json": {
      "hash": "GMB3_PZ-3",
      "plano": "GMB3",
      "medida": "PZ-3",
      "valor": 7178
    }
  },
  {
    "json": {
      "hash": "GMB3_PZ-4",
      "plano": "GMB3",
      "medida": "PZ-4",
      "valor": 7213
    }
  }
]
```

### Columnas generadas:

- **`hash`** (string): Identificador único formado por el plano y la medida (ej: "GMB3_PZ-1")
- **`plano`** (string): Número del plano (ej: "GMB3")
- **`medida`** (string): Nombre del punzonado (ej: "PZ-1", "PZ-2", etc.)
- **`valor`** (number): Valor numérico del punzonado en mm

## Características

1. **Ordenamiento automático**: Los punzonados se ordenan numéricamente (PZ-1, PZ-2, PZ-10, etc.)
2. **Filtrado**: Solo procesa claves que empiezan con "PZ-"
3. **Conversión de tipos**: Convierte valores a números si vienen como strings
4. **Manejo de arrays**: Si el input viene como array, extrae el primer elemento
5. **Manejo de objetos anidados**: Si hay una propiedad "json" anidada, la usa automáticamente

## Uso en n8n

### Configuración del Nodo Code

1. **Agregar un nodo Code** después del nodo que genera los datos con punzonados
2. **Copiar el contenido** del archivo `extractPunzonadosForSheet.js` en el editor del nodo
3. **Conectar el nodo** a un nodo de Google Sheets o Excel para escribir los datos

### Ejemplo de Flujo en n8n

```
[Compare and Merge] ──> [Code: extractPunzonadosForSheet] ──> [Google Sheets: Append Row]
```

### Configuración del Nodo Google Sheets

En el nodo de Google Sheets, configura:

- **Operation**: Append Row
- **Columns**: 
  - `hash` (columna A) - Identificador único
  - `plano` (columna B)
  - `medida` (columna C)
  - `valor` (columna D)

### Incluir Columnas Adicionales (Opcional)

Si necesitas incluir información adicional como `estaciones` en cada fila, descomenta las líneas en el script:

```javascript
resultados.push({
  json: {
    hash: hash,
    plano: plano,
    medida: punzonado.medida,
    valor: punzonado.valor,
    estaciones: datos.estaciones || '', // Descomentar
  },
});
```

## Ejemplo de Uso

Ver el archivo `test-extractPunzonados.js` para un ejemplo completo:

```bash
node test-extractPunzonados.js
```

## Resultado Esperado en la Sheet

| hash | plano | medida | valor |
|------|-------|--------|-------|
| GMB3_PZ-1 | GMB3  | PZ-1   | 82    |
| GMB3_PZ-2 | GMB3  | PZ-2   | 168   |
| GMB3_PZ-3 | GMB3  | PZ-3   | 7178  |
| GMB3_PZ-4 | GMB3  | PZ-4   | 7213  |

## Notas Importantes

1. **Hash único**: El hash se genera combinando el plano y la medida con un guion bajo (`_`). Si no hay plano, solo se usa la medida como hash.

2. **Ordenamiento**: Los punzonados se ordenan numéricamente, no alfabéticamente. Esto significa que PZ-10 vendrá después de PZ-9, no después de PZ-1.

3. **Valores vacíos**: Si un punzonado tiene un valor `null`, `undefined` o no numérico, se convertirá a `0`.

4. **Múltiples items**: Si recibes múltiples items (múltiples planos), cada uno generará sus propias filas. Todas las filas se combinarán en el output. El hash garantiza que cada fila sea única incluso si hay múltiples planos.

5. **Sin punzonados**: Si un item no tiene el campo `punzonados` o está vacío, se saltará ese item sin generar filas.

6. **Sin plano**: Si el objeto no tiene el campo `plano`, el hash será solo la medida (ej: "PZ-1" en lugar de "GMB3_PZ-1").

## Solución de Problemas

### No se generan filas

- Verifica que el campo `punzonados` existe en el input
- Verifica que `punzonados` es un objeto (no un array)
- Revisa que las claves empiecen con "PZ-"

### Valores incorrectos

- Verifica que los valores en el objeto `punzonados` sean numéricos
- El script convierte strings a números automáticamente, pero valores inválidos se convertirán a `0`

### Orden incorrecto

- El script ordena por número extraído de la clave (PZ-1 = 1, PZ-2 = 2, etc.)
- Si tienes claves como "PZ-10", se ordenará correctamente después de "PZ-9"

