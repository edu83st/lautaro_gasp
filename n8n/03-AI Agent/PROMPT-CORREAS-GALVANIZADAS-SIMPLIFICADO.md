# Extracción Simplificada de Cotas en Planos Técnicos de Correas Galvanizadas

## Objetivo

Extraer las **cotas verticales (punzonados)**, las **cotas horizontales (distancias)** y contar los **grupos de punzonados** visibles en planos técnicos de correas galvanizadas. El control de medidas será realizado por un humano posteriormente.

---

## ⚠️ PASO 1: IDENTIFICAR ROTURAS (CRÍTICO - HACER PRIMERO)

**ANTES de contar punzonados o extraer distancias**, DEBES identificar si existe una rotura en el plano.

### ¿Qué es una rotura?

Una **rotura** es una representación visual de una parte omitida del dibujo cuando la pieza es muy larga. Se muestra como una línea que atraviesa el perfil completo.

### Características visuales de una rotura:

- **Línea vertical** que atraviesa el perfil completo de la pieza (de arriba a abajo)
- La pieza se extiende horizontalmente (eje X), por lo que la rotura es **vertical** (perpendicular al eje X)
- Puede aparecer como línea vertical continua o con patrón de zigzag vertical
- Atraviesa el perfil completo conectando la parte superior e inferior
- **NO es un punzonado** - es solo una representación visual

### ⚠️ NO confundir roturas con punzonados:

- **Rotura**: Línea **vertical** que atraviesa el perfil completo (arriba y abajo conectados)
- **Punzonados**: Círculos o perforaciones que aparecen en pares (arriba y abajo) pero **NO están conectados** por una línea vertical continua

### Cómo identificar roturas:

1. Examina el dibujo de la pieza buscando líneas **verticales** que atraviesen el perfil completo
2. Confirma que es una rotura (no punzonados):
   - La rotura conecta arriba y abajo del perfil
   - Los punzonados son círculos separados, no conectados
3. **Marca mentalmente** la ubicación de la rotura para ignorarla al contar punzonados

**⚠️ IMPORTANTE**: Si identificas una rotura, NO la cuentes como grupo de punzonados.

---

## PASO 2: CONTAR GRUPOS DE PUNZONADOS

Después de identificar y excluir las roturas:

1. **Cuenta los grupos de punzonados visibles** en el dibujo
2. Los punzonados aparecen como **círculos o perforaciones en pares** (arriba y abajo)
3. Cada par de círculos (arriba y abajo) cuenta como **1 grupo de punzonados**
4. **NO cuentes las roturas** como grupos de punzonados
5. El resultado debe ser un número entero: `cantidadGruposPunzonados`

**Ejemplo**: Si ves 3 pares de círculos de perforación y 1 rotura, entonces `cantidadGruposPunzonados = 3` (no 4).

---

## PASO 3: EXTRAER COTAS VERTICALES (PUNZONADOS)

### Ubicación de las cotas:

Las cotas se encuentran en la **parte superior del plano**, por encima del dibujo técnico de la pieza.

### Identificación de cotas verticales (punzonados):

- **Texto rotado 90 grados** (se lee girando la cabeza hacia la izquierda)
- Están alineadas verticalmente
- Representan posiciones ABSOLUTAS desde el origen (punto 0)
- Son las coordenadas X de cada punzonado medidas desde el inicio de la pieza
- Valores acumulativos que aumentan de izquierda a derecha
- El último valor siempre coincide con la longitud total de la pieza

### Proceso de extracción:

1. Localiza la zona de cotas en la parte superior del plano
2. Identifica todas las cotas con **texto rotado 90°** (verticales)
3. Léelas de **izquierda a derecha** en el orden que aparecen
4. Extrae todos los valores numéricos encontrados
5. Inclúyelos en un array: `punzonados`

**Nota**: Las roturas NO afectan las cotas superiores - se leen normalmente.

---

## PASO 4: EXTRAER COTAS HORIZONTALES (DISTANCIAS)

### Ubicación de las cotas:

Las cotas se encuentran en la **parte superior del plano**, por encima del dibujo técnico de la pieza.

### Identificación de cotas horizontales:

- **Texto en orientación horizontal normal** (se lee sin girar la cabeza)
- Representan distancias entre puntos consecutivos
- Aparecen como valores numéricos en la parte superior del plano

### Proceso de extracción:

1. Localiza la zona de cotas en la parte superior del plano
2. Identifica todas las cotas con **texto horizontal** (no rotado)
3. Léelas de **izquierda a derecha** en el orden que aparecen
4. Extrae todos los valores numéricos encontrados
5. Inclúyelos en un array: `distancias`

**Nota**: Las roturas NO afectan las cotas superiores - se leen normalmente.

---

## Formato de Salida JSON

```json
{
  "punzonados": [35, 7046, 7131, 7353],
  "cantidadGruposPunzonados": 3,
  "distancias": [35, 7011, 85, 222]
}
```

### Campos requeridos:

- **punzonados**: Array de números que representa las cotas verticales (rotadas 90°) leídas de izquierda a derecha. Son posiciones absolutas desde el origen. El último valor debe coincidir con la longitud total.
- **cantidadGruposPunzonados**: Número entero que representa la cantidad de grupos de punzonados visibles (excluyendo roturas)
- **distancias**: Array de números que representa las cotas horizontales leídas de izquierda a derecha

---

## Ejemplo Completo

**Plano con rotura:**

```
Dibujo:
┌─────────────────┐
│  [punzonados]   │ ← Grupo 1
│        │        │
│        │        │ ← ROTURA (ignorar al contar)
│   ╱╲   │   ╱╲   │
│   ╲╱   │   ╲╱   │
│        │        │
│  [punzonados]   │ ← Grupo 2
│  [punzonados]   │ ← Grupo 3
└─────────────────┘

Cotas superiores:
35    7011    85    222
←→    ←→     ←→    ←→
```

**Resultado:**

```json
{
  "punzonados": [35, 7046, 7131, 7353],
  "cantidadGruposPunzonados": 3,
  "distancias": [35, 7011, 85, 222]
}
```

**Explicación:**

- Se identificó 1 rotura (ignorada)
- Se contaron 3 grupos de punzonados visibles
- Se extrajeron 4 cotas verticales (punzonados) de izquierda a derecha
- Se extrajeron 4 cotas horizontales (distancias) de izquierda a derecha

---

## Reglas Importantes

1. **⚠️ Identifica roturas PRIMERO**: Antes de contar punzonados, identifica si hay roturas para no confundirlas con punzonados
2. **NO inventes valores**: Solo extrae cotas que estén dibujadas explícitamente
3. **NO cuentes roturas**: Las roturas NO son grupos de punzonados
4. **Orden estricto**: Mantén el orden de izquierda a derecha para punzonados y distancias
5. **Cotas verticales = Punzonados**: Extrae las cotas con texto rotado 90° (verticales)
6. **Cotas horizontales = Distancias**: Extrae las cotas con texto horizontal (no rotado)

---

## Casos Especiales

### Si no hay punzonados visibles:

```json
{
  "punzonados": [],
  "cantidadGruposPunzonados": 0,
  "distancias": []
}
```

### Si no hay cotas horizontales visibles:

```json
{
  "punzonados": [35, 7046, 7131, 7353],
  "cantidadGruposPunzonados": 3,
  "distancias": []
}
```

### Si hay múltiples roturas:

- Identifica todas las roturas
- Cuenta solo los grupos de punzonados (excluyendo todas las roturas)
- Extrae las distancias normalmente (las roturas no afectan las cotas)

---

## Resumen Visual Rápido

**⚠️ ROTURA = Línea vertical que atraviesa el perfil completo**

- Línea vertical (de arriba a abajo)
- Conecta arriba y abajo del perfil
- **NO es un punzonado** - ignórala al contar

**✓ PUNZONADOS = Cotas VERTICALES (rotadas 90°)**

- Texto que se lee girando la cabeza hacia la izquierda
- Posiciones absolutas desde el origen
- Valores acumulativos crecientes
- El último valor coincide con la longitud total

**✓ GRUPO DE PUNZONADOS = Par de círculos/perforaciones (arriba y abajo)**

- Círculos separados, no conectados por línea vertical
- Cada par cuenta como 1 grupo

**✓ DISTANCIAS = Cotas HORIZONTALES (texto normal)**

- Texto que se lee sin girar la cabeza
- Valores numéricos en la parte superior del plano

---

## Nota Final

Este proceso simplificado se enfoca en:

1. Identificar roturas para evitar confusiones
2. Contar grupos de punzonados visibles
3. Extraer cotas verticales (punzonados)
4. Extraer cotas horizontales (distancias)

**El control de medidas y validaciones será realizado por un humano posteriormente.**
