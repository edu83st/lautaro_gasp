# Identificación de Cotas en Planos Técnicos de Correas Galvanizadas

## Objetivo

Identificar correctamente las cotas de punzonados y distancias en planos técnicos de correas galvanizadas mediante el análisis de la orientación de las cotas.

## ⚠️ IDENTIFICACIÓN DE ROTURAS EN PLANOS LARGOS

**CRÍTICO**: Antes de comenzar a identificar punzonados y distancias, DEBES identificar si existe una rotura en el plano.

### ¿Qué es una rotura?

Cuando una pieza es muy larga para caber completamente en el plano, se representa mediante una **rotura** (también llamada "corte" o "break"). Esta es una representación visual que indica que hay una parte de la pieza que ha sido omitida del dibujo para que el plano quepa en el formato.

### Características visuales de una rotura:

- **Línea vertical** que atraviesa el perfil completo de la pieza (de arriba a abajo)
- La pieza se extiende a lo largo del **eje X** (horizontalmente), por lo que la rotura es **vertical** (perpendicular al eje X)
- Generalmente aparece como una **línea vertical continua** o con un patrón de zigzag vertical
- Se encuentra **dentro del dibujo de la pieza**, no en las cotas superiores
- Atraviesa el perfil completo **de arriba a abajo** (conecta la parte superior e inferior del perfil)
- Generalmente aparece **en la parte media o final** del dibujo
- Puede aparecer **más de una vez** si la pieza es extremadamente larga
- **Orientación vertical**: La rotura corre verticalmente a través del dibujo, perpendicular a la dirección de la pieza (que es horizontal)

### Ejemplo visual de rotura:

```
Dibujo de la pieza (extendida horizontalmente a lo largo del eje X):
┌─────────────────┐
│  [punzonados]   │ ← Parte inicial
│        │        │
│        │        │ ← ROTURA (línea vertical)
│   ╱╲   │   ╱╲   │   (puede ser línea continua o zigzag vertical)
│   ╲╱   │   ╲╱   │   Corta perpendicularmente al eje X
│        │        │
│  [punzonados]   │ ← Parte final
└─────────────────┘
```

### ⚠️ IMPORTANTE - NO confundir roturas con punzonados:

- **Rotura**: Línea **vertical** que atraviesa el perfil completo de la pieza (de arriba a abajo, perpendicular al eje X). La pieza se extiende horizontalmente, por lo que la rotura es vertical
- **Punzonados**: Círculos o perforaciones que aparecen en pares (arriba y abajo) pero NO están conectados por una línea vertical continua

### Cómo manejar roturas:

1. **Identifica la rotura PRIMERO** antes de buscar punzonados
2. **Ignora la rotura** al contar punzonados - NO es un punzonado
3. **Las cotas superiores NO se ven afectadas** por la rotura - continúan la secuencia normalmente
4. **La rotura es solo visual** - todas las cotas (punzonados y distancias) siguen siendo válidas y deben leerse en secuencia

### Ejemplo con rotura:

Si ves un plano con rotura, las cotas superiores siguen siendo válidas:

```
Cotas superiores (continuas a pesar de la rotura):
0 → 82 → 82 → 86 → 168 → [ROTURA] → 7010 → 7178 → 35 → 7213
    ↓    ↑    ↓    ↑                    ↓      ↑      ↓    ↑
   dist vert dist vert                  dist   vert   dist vert
```

**Las cotas se leen normalmente**, ignorando la rotura en el dibujo.

---

## Ubicación de las Cotas

Las cotas se encuentran en la **parte superior del plano**, por encima del dibujo técnico de la pieza. Forman una secuencia organizada que describe las posiciones de los punzonados.

**Nota**: Las cotas superiores NO se ven afectadas por roturas en el dibujo. Si identificas una rotura, ignórala al leer las cotas - la secuencia continúa normalmente.

## Tipos de Cotas

### 1. Cotas Verticales (Rotadas 90°) → PUNZONADOS

**Características visuales:**

- Texto rotado 90 grados (se lee girando la cabeza hacia la izquierda)
- Están alineadas verticalmente
- Representan posiciones ABSOLUTAS desde el origen (punto 0)

**Qué representan:**

- Son las coordenadas X de cada punzonado medidas desde el inicio de la pieza
- Valores acumulativos que aumentan de izquierda a derecha
- El último valor siempre coincide con la longitud total de la pieza

**Ejemplo visual:**

```
        82    168   7178  7213
        |     |     |     |
        ↓     ↓     ↓     ↓
    (texto rotado 90°)
```

**En el JSON van en:**

```json
"punzonados": [82, 168, 7178, 7213]
```

---

### 2. Cotas Horizontales (Orientación Normal) → DISTANCIAS

**Características visuales:**

- Texto en orientación horizontal normal (se lee sin girar la cabeza)
- Representan distancias ENTRE punzonados consecutivos

**Qué representan:**

- Distancia desde el punto anterior hasta el punto actual
- Son valores incrementales (deltas)
- La suma de todas las distancias debe igualar la longitud total de la pieza

**Ejemplo visual:**

```
    82      86      7010     35
   ←→      ←→      ←→       ←→
(texto horizontal normal)
```

**En el JSON van en:**

```json
"distancias": [82, 86, 7010, 35]
```

---

## Secuencia de Lectura

La secuencia típica de cotas de izquierda a derecha es:

```
0 → Δx₁ → P₁ → Δx₂ → P₂ → Δx₃ → P₃ → Δxₙ → Pₙ
    ↓     ↓     ↓     ↓     ↓     ↓     ↓     ↓
  dist  punz  dist  punz  dist  punz  dist  punz
 (horiz)(vert)(horiz)(vert)(horiz)(vert)(horiz)(vert)
```

Donde:

- **Δx** = Distancias (cotas horizontales)
- **P** = Punzonados (cotas verticales rotadas)
- **0** = Origen (puede estar implícito o explícito)
- **Pₙ** = Longitud total de la pieza

---

## Proceso de Extracción

### Paso 0: Identificar roturas (CRÍTICO - HACER PRIMERO)

**ANTES de buscar punzonados o distancias**, identifica si existe una rotura en el plano:

1. **Examina el dibujo de la pieza** buscando líneas **verticales** que atraviesen el perfil completo
2. **Busca patrones visuales** de rotura:
   - Líneas verticales continuas que cruzan el perfil de arriba a abajo
   - Líneas verticales con patrón de zigzag orientadas verticalmente
   - Líneas que corren de arriba a abajo atravesando todo el perfil (perpendicular al eje X)
   - Recuerda: La pieza se extiende horizontalmente (eje X), por lo que la rotura es vertical
3. **Confirma que es una rotura** (no punzonados):
   - La rotura es una línea **vertical** que atraviesa el perfil completo (arriba y abajo conectados)
   - Los punzonados son círculos/perforaciones separados (no conectados por una línea vertical continua)
4. **Marca mentalmente la ubicación** de la rotura para ignorarla al contar punzonados
5. **Recuerda**: La rotura NO afecta las cotas superiores - se leen normalmente

**⚠️ Si identificas una rotura, NO la cuentes como punzonado. Es solo una representación visual de una parte omitida del dibujo.**

### Paso 1: Localizar la zona de cotas

Identifica la parte superior del plano, encima del dibujo de la pieza.

### Paso 2: Separar por orientación

**Para PUNZONADOS:**

1. Busca todas las cotas con texto rotado 90° (verticales)
2. Léelas de izquierda a derecha
3. Incluye todos los valores encontrados
4. Verifica que el último valor coincida con la longitud total

**Para DISTANCIAS:**

1. Busca todas las cotas con texto horizontal normal
2. Léelas de izquierda a derecha
3. Incluye todos los valores encontrados
4. Verifica que la suma de distancias = longitud total

### Paso 3: Validación de coherencia

Aplica estas fórmulas para verificar:

```
P₁ = Δx₁
P₂ = P₁ + Δx₂
P₃ = P₂ + Δx₃
...
Pₙ = Pₙ₋₁ + Δxₙ = Longitud Total
```

También:

```
Suma(distancias) = Longitud Total
```

---

## Reglas Importantes

1. **⚠️ Identifica roturas PRIMERO**: Antes de buscar punzonados, identifica si hay roturas en el dibujo para no confundirlas con punzonados
2. **NO inventes valores**: Solo extrae cotas que estén dibujadas explícitamente
3. **Ignora el punto de origen (0)**: Generalmente no se incluye en las listas, aunque puede aparecer en el plano
4. **NO cuentes roturas como punzonados**: Las roturas son líneas que atraviesan el perfil completo, NO son punzonados
5. **Correlación con círculos**: El número de punzonados debe corresponder con los grupos de círculos de perforación dibujados (considerando que vienen en pares: arriba y abajo), EXCLUYENDO las roturas
6. **Longitud total**: Siempre debe aparecer como último punzonado
7. **Orden estricto**: Mantén el orden de izquierda a derecha tal como aparece en el plano
8. **Roturas no afectan cotas**: Las cotas superiores se leen normalmente incluso si hay roturas en el dibujo

---

## Ejemplo Completo

Dado un plano con estas cotas visibles:

```
Cotas superiores (de izquierda a derecha):
0 → 82 → 82 → 86 → 168 → 7010 → 7178 → 35 → 7213
    ↓    ↑    ↓    ↑     ↓      ↑      ↓    ↑
   dist vert dist vert  dist   vert   dist vert
```

**Extracción:**

Punzonados (verticales): `82, 168, 7178, 7213`
Distancias (horizontales): `82, 86, 7010, 35`

**JSON resultante:**

```json
{
  "punzonados": [82, 168, 7178, 7213],
  "distancias": [82, 86, 7010, 35],
  "longitud": 7213
}
```

**Validación:**

- 82 + 86 = 168 ✓
- 168 + 7010 = 7178 ✓
- 7178 + 35 = 7213 ✓
- 82 + 86 + 7010 + 35 = 7213 ✓

---

## Casos Especiales

### Si hay rotura en el plano

- **Identifica la rotura primero** antes de contar punzonados
- **Ignora la rotura** al contar grupos de punzonados
- **Lee las cotas normalmente** - la rotura no afecta la secuencia de cotas superiores
- **No incluyas la rotura** en el conteo de punzonados
- Ejemplo: Si hay 5 grupos de punzonados visibles + 1 rotura, el total es 5 punzonados (no 6)

### Si no hay cotas visibles

- `"punzonados": []`
- `"distancias": []`

### Si solo hay longitud total

- `"punzonados": [longitud]`
- `"distancias": []`

### Si las cotas están en otra ubicación

- Busca en los laterales o debajo del dibujo
- Aplica el mismo criterio de orientación (vertical = punzonados, horizontal = distancias)
- **Recuerda identificar roturas** incluso si las cotas están en otra ubicación

---

## Resumen Visual Rápido

**⚠️ ROTURA = Línea vertical que atraviesa el perfil completo**

- Línea **vertical** (de arriba a abajo)
- La pieza se extiende horizontalmente (eje X), por lo que la rotura es vertical (perpendicular al eje X)
- Puede ser línea continua o con patrón de zigzag vertical
- Atraviesa el perfil completo conectando arriba y abajo
- **NO es un punzonado** - ignórala al contar
- Identifícala PRIMERO antes de buscar punzonados

**✓ PUNZONADOS = Cotas VERTICALES (rotadas 90°)**

- Texto que se lee girando la cabeza
- Posiciones absolutas desde el origen
- Valores acumulativos crecientes
- **NO confundir con roturas** - los punzonados son círculos/perforaciones separados

**✓ DISTANCIAS = Cotas HORIZONTALES (normales)**

- Texto que se lee normalmente
- Distancias entre puntos consecutivos
- Valores incrementales (deltas)

---

## Nota Final

Este método de identificación por orientación de texto es el criterio más confiable para distinguir entre punzonados y distancias en planos técnicos de correas galvanizadas. Siempre prioriza la orientación visual del texto sobre cualquier otra consideración.

**⚠️ RECORDATORIO CRÍTICO**: Antes de identificar punzonados, SIEMPRE identifica primero si existe una rotura en el plano. Las roturas son representaciones visuales de partes omitidas del dibujo y NO deben contarse como punzonados. Confundir una rotura con un punzonado resultará en conteos incorrectos y datos erróneos.
