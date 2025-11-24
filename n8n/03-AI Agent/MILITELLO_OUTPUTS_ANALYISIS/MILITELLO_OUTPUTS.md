# Análisis de Resultados - Planos MILITELLO

Este documento presenta un análisis comparativo de los resultados obtenidos por diferentes modelos de IA al procesar los planos MILITELLO, comparándolos con los valores esperados (`militello_expected.json`).

## Resumen Ejecutivo

Se evaluaron 4 modelos/versiones de IA procesando 4 planos (1055-GM21, 1055-GM22, 1055-GM23, 1055-GM24).

**GPT 4.1 Mini** obtuvo la mejor precisión con 87.5% (3 de 4 planos completamente correctos), seguido de **Gemini 2.5 Pro v2** con 62.5% (2 planos correctos), **Claude Sonnet 4.5** con 50% y **Gemini 2.5 Pro v1** con 25%.

## Resumen por Modelo

### GPT 4.1 Mini

**Precisión**: 87.5% (3 de 4 planos completamente correctos)

**Resumen**: El mejor rendimiento general con solo errores menores en formato y un plano (GM23) con datos incompletos. Los valores técnicos (punzonados y distancias) son correctos en GM21, GM22 y GM24. El único error significativo es en GM23 donde falta un valor de punzonado (6405) y su distancia correspondiente.

**Errores principales**:

- Campo `obra` incluye "1055 - " antes de "MILITELLO"
- Campo `estaciones` devuelve código de estación en lugar de "N/A"
- GM23: falta un punzonado y su distancia correspondiente

---

### Claude Sonnet 4.5

**Precisión**: 50% (todos los planos tienen errores menores)

**Resumen**: Los valores técnicos de punzonados y distancias son correctos en todos los planos, pero tiene problemas sistemáticos con el conteo de grupos punzonados y el formato del campo `plano`. Todos los planos tienen el conteo incorrecto (cuenta 6 en lugar de 5, o 5 en lugar de 4).

**Errores principales**:

- Campo `obra` incluye "1055 - " antes de "MILITELLO"
- Campo `plano` omite el prefijo "1055-" (devuelve solo "GM21", etc.)
- Conteo incorrecto de `cantidadGruposPunzonados` en todos los planos
- GM21: diferencia de 1mm en una distancia (5831 vs 5830)

---

### Gemini 2.5 Pro v1

**Precisión**: 25% (todos los planos tienen errores significativos)

**Resumen**: Tiene problemas graves en la extracción de punzonados, extrayendo valores adicionales al inicio de cada plano que no existen. Esto genera arrays de punzonados y distancias completamente incorrectos. Aunque los campos de formato son correctos, los datos técnicos son erróneos.

**Errores principales**:

- Extracción de punzonados adicionales al inicio de todos los planos
- Arrays de punzonados y distancias completamente incorrectos
- Conteo incorrecto de grupos punzonados

---

### Gemini 2.5 Pro v2

**Precisión**: 62.5% (2 planos completamente correctos)

**Resumen**: Mejora significativa respecto a v1 (+37.5% de precisión). GM23 y GM24 están completamente correctos. GM21 y GM22 tienen errores menores (valores faltantes o extra en punzonados). Incluye validaciones automáticas que detectan discrepancias en suma de distancias y marca `requiere_revision: true` cuando detecta errores.

**Errores principales**:

- Campo `obra` incluye "1055 - " antes de "MILITELLO"
- GM21: falta valor 243 en punzonados
- GM22: valor extra (70) en punzonados
- Conteo incorrecto de `cantidadGruposPunzonados` en GM23 y GM24 (aunque los valores son correctos)

**Fortalezas**:

- Validaciones automáticas que detectan errores
- Mejora significativa respecto a v1

---

## Comparativa de Precisión

| Modelo                  | Precisión | Errores Críticos | Errores Menores             | Validaciones Automáticas |
| ----------------------- | --------- | ---------------- | --------------------------- | ------------------------ |
| **GPT 4.1 Mini**        | 87.5%     | 0                | 1 plano (GM23)              | No                       |
| **Claude Sonnet 4.5**   | 50%       | 0                | 4 planos (formato y conteo) | No                       |
| **Gemini 2.5 Pro (v1)** | 25%       | 4 planos         | 0                           | No                       |
| **Gemini 2.5 Pro (v2)** | 62.5%     | 0                | 2 planos (GM21, GM22)       | Sí                       |

## Conclusión

**GPT 4.1 Mini** es el modelo más adecuado para este tipo de extracción con una precisión del 87.5%, aunque requiere post-procesamiento para normalizar campos de formato.

**Gemini 2.5 Pro v2** muestra una mejora significativa respecto a v1 (+37.5% de precisión), alcanzando 62.5% de precisión. Su principal fortaleza es la inclusión de validaciones automáticas que detectan discrepancias en los datos, lo cual es muy valioso para identificar errores. Con correcciones en la extracción de punzonados y el conteo de grupos, podría alcanzar niveles similares a GPT 4.1 Mini.

**Claude Sonnet 4.5** necesita mejoras en el formato de campo `plano` y en la lógica de conteo de grupos punzonados.

**Gemini 2.5 Pro v1** requiere mejoras significativas en su lógica de extracción de punzonados.
