# Comparador y Merge de Respuestas de Agentes

Este script compara dos respuestas de agentes, detecta diferencias (excluyendo el campo `observaciones`) y mergea las observaciones de ambas respuestas.

## Propósito

Permite detectar discrepancias entre las respuestas de dos agentes que procesan el mismo plano técnico, facilitando la detección de errores y la necesidad de revisión manual.

## Funcionalidades

1. **Comparación profunda**: Compara todos los campos de ambas respuestas (excepto `observaciones`)
2. **Detección de diferencias**: Identifica campos con valores diferentes, campos faltantes, etc.
3. **Merge de observaciones**: Combina las observaciones de ambas respuestas eliminando duplicados
4. **Flag de corrección**: Proporciona un flag `requiereCorreccion` para facilitar el routing en n8n

## Formato de Entrada

El script espera recibir exactamente **2 items** desde n8n, cada uno conteniendo una respuesta de agente.

### Estructura esperada de cada respuesta:

```json
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
  "observaciones": [
    {
      "severidad": "info",
      "campo": "general",
      "descripcion": "Extracción completada exitosamente."
    }
  ],
  "requiere_revision": false
}
```

**Nota**: El script también acepta el formato alternativo con `tipo` y `mensaje` en lugar de `severidad` y `descripcion`, pero el formato estándar según `PROMPT-OUTPUT.md` usa `severidad` y `descripcion`.

## Formato de Salida

El script retorna un **único objeto** con los datos mergeados y las diferencias en una key separada:

```json
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
  "observaciones": [
    {
      "tipo": "info",
      "campo": "general",
      "mensaje": "Extracción completada exitosamente."
    }
  ],
  "requiere_revision": false,
  "diferencias": [
    {
      "campo": "estaciones",
      "tipo": "diferencia",
      "valor1": "5-6",
      "valor2": ""
    }
  ],
  "requiereCorreccion": true
}
```

### Campos del resultado:

**Campos de datos** (del objeto mergeado):
- Todos los campos de la respuesta original (`estaciones`, `almaPerfil`, `tipoPerfil`, `plano`, `longitud`, `punzonados`, `distancias`, `observaciones`, `requiere_revision`)

**Campos de comparación**:
- **`diferencias`** (array): Lista de objetos con información sobre cada diferencia encontrada
  - `campo`: Nombre del campo con diferencia
  - `tipo`: Tipo de diferencia (`diferencia`, `faltante_en_respuesta_1`, `faltante_en_respuesta_2`)
  - `valor1`: Valor en la primera respuesta
  - `valor2`: Valor en la segunda respuesta
- **`requiereCorreccion`** (boolean): `true` si hay diferencias, `false` si no hay diferencias. Facilita el routing en n8n

**Nota**: El objeto retornado usa la primera respuesta como base y solo agrega las keys `diferencias` y `requiereCorreccion`. Las observaciones están mergeadas de ambas respuestas.

## Uso en n8n

### Configuración del Nodo Code

1. **Agregar un nodo Code** después de recibir las dos respuestas de los agentes
2. **Copiar el contenido** del archivo `compareAndMerge.js` en el editor del nodo
3. **Configurar las entradas**: Asegúrate de que el nodo reciba exactamente 2 items

### Ejemplo de Flujo en n8n

```
[Agente 1] ──┐
             ├──> [Merge Items] ──> [Code: compareAndMerge] ──> [IF Node]
[Agente 2] ──┘                                                      │
                                                                     ├─> [requiereCorreccion = true] ──> [Notificar Usuario]
                                                                     │
                                                                     └─> [requiereCorreccion = false] ──> [Continuar Procesamiento]
```

### Configuración del Nodo IF para Routing

En el nodo IF, configura la condición:

```
{{ $json.requiereCorreccion }} === true
```

### Notificación al Usuario

Cuando `requiereCorreccion` es `true`, puedes usar un nodo de notificación (Email, Slack, etc.) con un mensaje como:

```
Se detectaron diferencias entre las respuestas de los agentes:

{{ $json.diferencias.length }} diferencia(s) encontrada(s):

{{ $json.diferencias.map(d => `- Campo "${d.campo}": "${JSON.stringify(d.valor1)}" vs "${JSON.stringify(d.valor2)}"`).join('\n') }}

Por favor, revise las respuestas y corrija las discrepancias.

Datos del resultado mergeado:
- Plano: {{ $json.plano }}
- Estaciones: {{ $json.estaciones }}
- Longitud: {{ $json.longitud }}
```

## Ejemplo de Uso

Ver el archivo `mock-2-responses.json` para un ejemplo de entrada y ejecutar `test-compareAndMerge.js` para ver el resultado:

```bash
node test-compareAndMerge.js
```

## Notas Importantes

1. **Campo observaciones**: Este campo NO se compara, solo se mergea. Las diferencias en observaciones no se consideran como discrepancias.

2. **Estrategia de merge**: El script usa la primera respuesta como base y solo mergea las observaciones. Si necesitas una estrategia diferente (por ejemplo, resolver conflictos eligiendo el valor más completo), puedes modificar la función `compararYMergear`.

3. **Comparación profunda**: El script realiza una comparación profunda (deep comparison) de objetos y arrays, por lo que detectará diferencias incluso en estructuras anidadas.

4. **Campos faltantes**: Si un campo existe en una respuesta pero no en la otra, se considera una diferencia.

5. **Valores vacíos**: Un string vacío (`""`) se considera diferente de un valor con contenido, por lo que se detectará como diferencia.

## Solución de Problemas

### Error: "Se esperaban exactamente 2 respuestas"

- Verifica que el nodo anterior esté enviando exactamente 2 items
- Si tienes un array con 2 elementos, considera usar un nodo "Split in Batches" o modificar el script para manejar arrays

### No se detectan diferencias esperadas

- Verifica que los valores sean realmente diferentes (incluyendo tipos de datos)
- Revisa que no estés comparando el campo `observaciones` (que se excluye automáticamente)
- Usa `console.log` en el script para depurar los valores que se están comparando

### Observaciones duplicadas

- El script elimina duplicados basándose en el contenido completo del objeto de observación
- Si dos observaciones tienen el mismo contenido pero diferentes referencias de objeto, se considerarán duplicadas y solo se mantendrá una

