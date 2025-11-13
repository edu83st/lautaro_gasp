# Identificación de Cotas en Planos Técnicos de Correas Galvanizadas

## Objetivo

Identificar correctamente las cotas de punzonados y distancias en planos técnicos de correas galvanizadas mediante el análisis de la orientación de las cotas.

## Ubicación de las Cotas

Las cotas se encuentran en la **parte superior del plano**, por encima del dibujo técnico de la pieza. Forman una secuencia organizada que describe las posiciones de los punzonados.

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

1. **NO inventes valores**: Solo extrae cotas que estén dibujadas explícitamente
2. **Ignora el punto de origen (0)**: Generalmente no se incluye en las listas, aunque puede aparecer en el plano
3. **Correlación con círculos**: El número de punzonados debe corresponder con los grupos de círculos de perforación dibujados (considerando que vienen en pares: arriba y abajo)
4. **Longitud total**: Siempre debe aparecer como último punzonado
5. **Orden estricto**: Mantén el orden de izquierda a derecha tal como aparece en el plano

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

### Si no hay cotas visibles

- `"punzonados": []`
- `"distancias": []`

### Si solo hay longitud total

- `"punzonados": [longitud]`
- `"distancias": []`

### Si las cotas están en otra ubicación

- Busca en los laterales o debajo del dibujo
- Aplica el mismo criterio de orientación (vertical = punzonados, horizontal = distancias)

---

## Resumen Visual Rápido

**✓ PUNZONADOS = Cotas VERTICALES (rotadas 90°)**

- Texto que se lee girando la cabeza
- Posiciones absolutas desde el origen
- Valores acumulativos crecientes

**✓ DISTANCIAS = Cotas HORIZONTALES (normales)**

- Texto que se lee normalmente
- Distancias entre puntos consecutivos
- Valores incrementales (deltas)

---

## Nota Final

Este método de identificación por orientación de texto es el criterio más confiable para distinguir entre punzonados y distancias en planos técnicos de correas galvanizadas. Siempre prioriza la orientación visual del texto sobre cualquier otra consideración.
