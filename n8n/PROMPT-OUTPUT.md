# Sistema de Observaciones para Extracción de Datos de Planos Técnicos

## Propósito

Este sistema permite documentar dudas, advertencias y errores durante la extracción automática de datos de planos técnicos, facilitando la revisión humana cuando sea necesario.

---

## Formato de Salida con Observaciones

### Estructura JSON

```json
[
  {
    "estaciones": "5-6",
    "almaPerfil": 140,
    "tipoPerfil": "C",
    "plano": "GCV86",
    "longitud": 1245,
    "punzonados": [10, 90, 210],
    "distancias": [10, 80, 120],
    "observaciones": [
      {
        "severidad": "advertencia",
        "campo": "punzonados",
        "descripcion": "La suma de distancias (220) no coincide con la longitud total (1245). Verificar cotas en el plano."
      },
      {
        "severidad": "duda",
        "campo": "tipoPerfil",
        "descripcion": "Tipo de perfil inferido del código 'C140', no visible claramente en el cajetín."
      }
    ],
    "requiere_revision": true
  }
]
```

### Campos del Sistema

#### Campo `observaciones` (Array de Objetos)

Cada observación contiene:

- **`severidad`** (string): Nivel de importancia de la observación
- **`campo`** (string): Campo específico al que se refiere la observación
- **`descripcion`** (string): Explicación clara y detallada del problema o duda

#### Campo `requiere_revision` (Boolean)

- `true`: El plano necesita revisión humana obligatoria
- `false`: El plano fue procesado exitosamente sin dudas críticas

---

## Niveles de Severidad

### 1. **error** (Crítico)

**Cuándo usar:**

- Validación matemática fallida que bloquea la extracción
- Campo obligatorio completamente ausente o ilegible
- Datos incoherentes que invalidan el resultado
- Imposibilidad de determinar el tipo de plano

**Ejemplos:**

```json
{
  "severidad": "error",
  "campo": "longitud",
  "descripcion": "No se encontró la longitud total en ninguna parte del plano. Extracción bloqueada."
}
```

```json
{
  "severidad": "error",
  "campo": "punzonados",
  "descripcion": "Suma de distancias (5230) excede la longitud total (4500). Datos inválidos."
}
```

```json
{
  "severidad": "error",
  "campo": "plano",
  "descripcion": "El número de plano no es visible en el cajetín. No se puede identificar la pieza."
}
```

**Acción requerida:** Revisión humana OBLIGATORIA antes de usar los datos

---

### 2. **advertencia** (Importante)

**Cuándo usar:**

- Validación matemática con discrepancia menor
- Número de punzonados no coincide con círculos dibujados
- Cotas ambiguas pero valores extraíbles
- Calidad de imagen deficiente que dificulta la lectura

**Ejemplos:**

```json
{
  "severidad": "advertencia",
  "campo": "distancias",
  "descripcion": "Suma de distancias (7210) difiere por 3mm de la longitud total (7213). Posible error de redondeo o lectura."
}
```

```json
{
  "severidad": "advertencia",
  "campo": "punzonados",
  "descripcion": "Se detectaron 6 círculos de perforación pero solo 3 cotas verticales. Verificar si faltan punzonados."
}
```

```json
{
  "severidad": "advertencia",
  "campo": "almaPerfil",
  "descripcion": "Calidad de imagen baja. El valor 220 puede confundirse con 200. Confirmar visualmente."
}
```

**Acción requerida:** Revisión humana RECOMENDADA

---

### 3. **duda** (Menor)

**Cuándo usar:**

- Campo inferido por contexto (no visible directamente)
- Valor estimado basado en patrones comunes
- Información parcialmente legible pero con confianza razonable
- Uso de valores por defecto

**Ejemplos:**

```json
{
  "severidad": "duda",
  "campo": "estaciones",
  "descripcion": "Campo 'estaciones' no visible en el plano. Se usó valor por defecto '5-6' según configuración estándar."
}
```

```json
{
  "severidad": "duda",
  "campo": "tipoPerfil",
  "descripcion": "Tipo de perfil inferido de 'CC220-2-20-80'. Primera letra 'C' tomada como tipo. Confirmar si es correcto."
}
```

```json
{
  "severidad": "duda",
  "campo": "punzonados",
  "descripcion": "Algunas cotas verticales están parcialmente ocultas. Se extrajeron 4 punzonados visibles, pueden existir más."
}
```

**Acción requerida:** Revisión humana OPCIONAL (según criterio)

---

### 4. **info** (Informativo)

**Cuándo usar:**

- Notas sobre la calidad del procesamiento
- Comentarios sobre características especiales del plano
- Información contextual relevante
- Confirmaciones de validaciones exitosas

**Ejemplos:**

```json
{
  "severidad": "info",
  "campo": "general",
  "descripcion": "Plano procesado exitosamente. Todas las validaciones matemáticas pasaron correctamente."
}
```

```json
{
  "severidad": "info",
  "campo": "punzonados",
  "descripcion": "El plano contiene punzonados adicionales en la dirección Y que no fueron incluidos según las instrucciones."
}
```

```json
{
  "severidad": "info",
  "campo": "general",
  "descripcion": "Plano con alta calidad de imagen. Extracción realizada con alta confianza."
}
```

**Acción requerida:** Solo informativo, no requiere revisión

---

## Reglas para Generar Observaciones

### 1. Validaciones Matemáticas

**SIEMPRE verificar:**

```javascript
// Coherencia de punzonados y distancias
suma_distancias = distancias.reduce((a, b) => a + b, 0)
if (suma_distancias !== longitud) {
  → Generar observación de "advertencia" o "error"
}

// Relación incremental
for (i = 1; i < punzonados.length; i++) {
  calculado = punzonados[i-1] + distancias[i-1]
  if (calculado !== punzonados[i]) {
    → Generar observación de "advertencia"
  }
}

// Último punzonado = longitud total
if (punzonados[punzonados.length - 1] !== longitud) {
  → Generar observación de "error"
}
```

### 2. Coherencia Visual

**Verificar:**

- Número de círculos de perforación vs. número de punzonados
- Presencia de cotas verticales para cada círculo visible
- Correspondencia entre cotas horizontales y verticales

### 3. Campos Obligatorios

**Si falta alguno de estos campos, generar observación de "error":**

- `plano`
- `tipoPerfil`
- `longitud`

**Si falta alguno de estos campos, generar observación de "duda":**

- `estaciones` (se puede usar valor por defecto)
- `almaPerfil` (si se puede inferir del código del perfil)

### 4. Arrays Vacíos

**Si `punzonados` o `distancias` están vacíos:**

- Verificar si es correcto (plano sin punzonados)
- Si debería haber datos, generar observación de "advertencia"

---

## Criterios para `requiere_revision`

### `requiere_revision: true`

Cuando hay AL MENOS UNA de estas condiciones:

- ✓ Cualquier observación con severidad `"error"`
- ✓ Dos o más observaciones con severidad `"advertencia"`
- ✓ Validación matemática fallida (suma de distancias ≠ longitud)
- ✓ Campo obligatorio inferido o con valor por defecto

### `requiere_revision: false`

Cuando TODAS estas condiciones se cumplen:

- ✓ No hay observaciones de severidad `"error"`
- ✓ Máximo una observación de severidad `"advertencia"`
- ✓ Todas las validaciones matemáticas pasaron
- ✓ Todos los campos obligatorios se extrajeron directamente del plano

---

## Ejemplos Completos

### Ejemplo 1: Extracción Exitosa (Sin Revisión)

```json
[
  {
    "estaciones": "5-6",
    "almaPerfil": 220,
    "tipoPerfil": "C",
    "plano": "GMB3",
    "longitud": 7213,
    "punzonados": [82, 168, 7178, 7213],
    "distancias": [82, 86, 7010, 35],
    "observaciones": [
      {
        "severidad": "info",
        "campo": "general",
        "descripcion": "Extracción completada exitosamente. Todas las validaciones pasaron."
      }
    ],
    "requiere_revision": false
  }
]
```

### Ejemplo 2: Extracción con Dudas Menores (Revisión Opcional)

```json
[
  {
    "estaciones": "5-6",
    "almaPerfil": 140,
    "tipoPerfil": "C",
    "plano": "GCV86",
    "longitud": 1245,
    "punzonados": [82, 164, 250, 1245],
    "distancias": [82, 82, 86, 995],
    "observaciones": [
      {
        "severidad": "duda",
        "campo": "estaciones",
        "descripcion": "Campo 'estaciones' no visible. Valor por defecto '5-6' asignado."
      },
      {
        "severidad": "info",
        "campo": "validacion",
        "descripcion": "Validación matemática correcta: 82+82+86+995 = 1245"
      }
    ],
    "requiere_revision": false
  }
]
```

### Ejemplo 3: Extracción con Advertencias (Revisión Recomendada)

```json
[
  {
    "estaciones": "5-6",
    "almaPerfil": 220,
    "tipoPerfil": "C",
    "plano": "GMB5",
    "longitud": 7213,
    "punzonados": [82, 168, 7178, 7213],
    "distancias": [82, 86, 7010, 35],
    "observaciones": [
      {
        "severidad": "advertencia",
        "campo": "punzonados",
        "descripcion": "Se observan 8 círculos de perforación en el dibujo pero solo 4 cotas verticales. Verificar si faltan punzonados."
      },
      {
        "severidad": "advertencia",
        "campo": "imagen",
        "descripcion": "Calidad de imagen deficiente en la zona de cotas. Confirmar valores extraídos."
      }
    ],
    "requiere_revision": true
  }
]
```

### Ejemplo 4: Extracción con Errores (Revisión Obligatoria)

```json
[
  {
    "estaciones": "5-6",
    "almaPerfil": 140,
    "tipoPerfil": "C",
    "plano": "GCV87",
    "longitud": 1245,
    "punzonados": [82, 164, 250, 1245],
    "distancias": [82, 82, 86],
    "observaciones": [
      {
        "severidad": "error",
        "campo": "distancias",
        "descripcion": "Suma de distancias (250) no coincide con longitud total (1245). Faltan 995mm. Verificar cotas en el plano."
      },
      {
        "severidad": "error",
        "campo": "coherencia",
        "descripcion": "Número de distancias (3) no coincide con número de punzonados (4). Debería haber 4 distancias."
      }
    ],
    "requiere_revision": true
  }
]
```

### Ejemplo 5: Plano Sin Punzonados (Válido)

```json
[
  {
    "estaciones": "5-6",
    "almaPerfil": 180,
    "tipoPerfil": "U",
    "plano": "GUV12",
    "longitud": 3500,
    "punzonados": [],
    "distancias": [],
    "observaciones": [
      {
        "severidad": "info",
        "campo": "punzonados",
        "descripcion": "Plano sin punzonados. Arrays vacíos son correctos para este caso."
      }
    ],
    "requiere_revision": false
  }
]
```

---

## Mensajes de Observación: Mejores Prácticas

### ✅ Buenos Mensajes

- **Específicos**: "La suma de distancias (7210) difiere por 3mm de la longitud total (7213)"
- **Accionables**: "Verificar cota vertical en posición 7178mm. Puede estar parcialmente oculta"
- **Informativos**: "Se encontraron 4 cotas verticales: 82, 168, 7178, 7213"

### ❌ Malos Mensajes

- **Vagos**: "Hay un problema con las cotas"
- **No accionables**: "Algo no se ve bien"
- **Genéricos**: "Error en el procesamiento"

### Estructura Recomendada

```
[QUÉ] + [POR QUÉ] + [ACCIÓN]

Ejemplos:
- "Campo 'estaciones' no visible en el plano [QUÉ].
   Se usó valor por defecto '5-6' [POR QUÉ].
   Confirmar si la configuración es correcta [ACCIÓN]"

- "Suma de distancias (250) no coincide con longitud total (1245) [QUÉ].
   Faltan 995mm en las cotas [POR QUÉ].
   Verificar cotas horizontales en el plano [ACCIÓN]"
```

---

## Integración con el Flujo de Trabajo

### Paso 1: Durante la Extracción

```javascript
// Mientras extraes cada campo
observaciones = [];

if (campo_no_encontrado) {
  observaciones.push({
    severidad: 'duda',
    campo: 'nombre_campo',
    descripcion: 'Mensaje descriptivo',
  });
}
```

### Paso 2: Validaciones Post-Extracción

```javascript
// Después de extraer todos los campos
if (suma_distancias !== longitud) {
  observaciones.push({
    severidad: 'advertencia',
    campo: 'distancias',
    descripcion: `Suma de distancias (${suma_distancias}) ≠ longitud total (${longitud})`,
  });
}
```

### Paso 3: Determinar Flag de Revisión

```javascript
requiere_revision = observaciones.some(
  (obs) =>
    obs.severidad === 'error' ||
    observaciones.filter((o) => o.severidad === 'advertencia').length >= 2
);
```

### Paso 4: Generar Output Final

```javascript
return {
  ...datos_extraidos,
  observaciones: observaciones,
  requiere_revision: requiere_revision,
};
```

---

## Resumen de Decisiones

| Situación                                        | Severidad     | requiere_revision             |
| ------------------------------------------------ | ------------- | ----------------------------- |
| Campo obligatorio faltante                       | `error`       | `true`                        |
| Validación matemática fallida (>5% diferencia)   | `error`       | `true`                        |
| Validación matemática con diferencia menor (<5%) | `advertencia` | `true` si hay 2+ advertencias |
| Campo inferido del contexto                      | `duda`        | `false`                       |
| Calidad de imagen deficiente                     | `advertencia` | `true` si hay 2+ advertencias |
| Extracción exitosa                               | `info`        | `false`                       |
| Arrays vacíos válidos                            | `info`        | `false`                       |
| Cotas ambiguas pero legibles                     | `duda`        | `false`                       |

---

## Notas Finales

- **Siempre incluye el array `observaciones`**, aunque esté vacío o solo tenga mensajes informativos
- **Sé conservador con `requiere_revision`**: Es mejor revisar de más que pasar por alto errores
- **Mensajes claros y accionables**: El humano revisor debe entender inmediatamente qué verificar
- **Documenta las inferencias**: Si asumiste algo, explícalo en las observaciones
- **Prioriza la trazabilidad**: Cada decisión importante debe estar documentada
