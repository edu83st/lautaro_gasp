# Análisis de Resultados - Planos MILITELLO

Este documento presenta un análisis comparativo de los resultados obtenidos por diferentes modelos de IA al procesar los planos MILITELLO, comparándolos con los valores esperados (`militello_expected.json`). El análisis se enfoca únicamente en la precisión de los arrays `punzonados` y el campo `cantidadGruposPunzonados`.

## Resumen Ejecutivo

Se evaluaron 5 modelos/versiones de IA procesando 4 planos (1055-GM21, 1055-GM22, 1055-GM23, 1055-GM24).

**Gemini 3 Pro** y **Claude Sonnet 4.5** obtuvieron la mejor precisión en punzonados con 100% (todos los planos correctos), seguido de **GPT 4.1 Mini** con 87.5% (3 de 4 planos completamente correctos), **Gemini 2.5 Pro v2** con 62.5% (2 planos correctos) y **Gemini 2.5 Pro v1** con 25%.

## Resumen por Modelo

### GPT 4.1 Mini

**Precisión en punzonados**: 87.5% (3 de 4 planos completamente correctos)

**Resumen**: El mejor rendimiento general con solo un error en GM23 donde falta un valor de punzonado. Los arrays de punzonados son correctos en GM21, GM22 y GM24.

**Errores en punzonados**:

- **GM23**: Falta valor 6405 → `[173, 243, 6074, 6144, 6440]` (esperado: `[173, 243, 6074, 6144, 6405, 6440]`)

**Errores en cantidadGruposPunzonados**:

- **GM23**: 4 (esperado: 5) - debido al valor faltante en punzonados

---

### Claude Sonnet 4.5

**Precisión en punzonados**: 100% (todos los planos tienen punzonados correctos)

**Resumen**: Los arrays de punzonados son correctos en todos los planos, pero tiene problemas sistemáticos con el conteo de grupos punzonados. Todos los planos tienen el conteo incorrecto.

**Errores en punzonados**:

- Ninguno (todos los arrays son correctos)

**Errores en cantidadGruposPunzonados**:

- **GM21**: 6 (esperado: 5)
- **GM22**: 6 (esperado: 5)
- **GM23**: 6 (esperado: 5)
- **GM24**: 5 (esperado: 4)

---

### Gemini 2.5 Pro v1

**Precisión en punzonados**: 0% (todos los planos tienen errores críticos)

**Resumen**: Problemas graves en la extracción de punzonados, extrayendo valores adicionales al inicio de cada plano que no existen. Todos los arrays de punzonados son incorrectos.

**Errores en punzonados**:

- **GM21**: Valores incorrectos → `[70, 170, 240, 6074, 6144, 6385, 6420]` (esperado: `[173, 243, 6074, 6144, 6385, 6420]`)
- **GM22**: Valores incorrectos → `[35, 70, 105, 5671, 5741, 6002, 6037]` (esperado: `[35, 105, 5671, 5741, 6002, 6037]`)
- **GM23**: Valores incorrectos → `[70, 173, 243, 6074, 6144, 6405, 6440]` (esperado: `[173, 243, 6074, 6144, 6405, 6440]`)
- **GM24**: Valores incorrectos → `[35, 70, 105, 5515, 5585, 5620]` (esperado: `[35, 105, 5515, 5585, 5620]`)

**Errores en cantidadGruposPunzonados**:

- Todos los planos tienen conteo incorrecto debido a los valores extra en punzonados

---

### Gemini 2.5 Pro v2

**Precisión en punzonados**: 62.5% (2 de 4 planos completamente correctos)

**Resumen**: Mejora significativa respecto a v1. GM23 y GM24 están completamente correctos. GM21 y GM22 tienen errores menores (valores faltantes o extra en punzonados).

**Errores en punzonados**:

- **GM21**: Falta valor 243 → `[173, 6074, 6144, 6385, 6420]` (esperado: `[173, 243, 6074, 6144, 6385, 6420]`)
- **GM22**: Valor extra 70 → `[35, 70, 105, 5671, 5741, 6002, 6037]` (esperado: `[35, 105, 5671, 5741, 6002, 6037]`)

**Errores en cantidadGruposPunzonados**:

- **GM21**: 5 (correcto, pero falta valor en punzonados)
- **GM22**: 7 (esperado: 5) - debido al valor extra en punzonados
- **GM23**: 6 (esperado: 5) - aunque los punzonados son correctos
- **GM24**: 5 (esperado: 4) - aunque los punzonados son correctos

---

### Gemini 3 Pro

**Precisión en punzonados**: 100% (todos los planos tienen punzonados correctos)

**Resumen**: Excelente rendimiento con todos los arrays de punzonados completamente correctos en los 4 planos. Similar a Claude Sonnet 4.5, pero con el mismo problema sistemático en el conteo de grupos punzonados, contando +1 en todos los planos.

**Errores en punzonados**:

- Ninguno (todos los arrays son correctos)

**Errores en cantidadGruposPunzonados**:

- **GM21**: 6 (esperado: 5)
- **GM22**: 6 (esperado: 5)
- **GM23**: 6 (esperado: 5)
- **GM24**: 5 (esperado: 4)

---

## Comparativa de Precisión

| Modelo                  | Precisión Punzonados | Errores Críticos | Errores Menores              |
| ----------------------- | -------------------- | ---------------- | ---------------------------- |
| **GPT 4.1 Mini**        | 87.5%                | 0                | 1 plano (GM23)               |
| **Claude Sonnet 4.5**   | 100%                 | 0                | 4 planos (conteo incorrecto) |
| **Gemini 2.5 Pro (v1)** | 0%                   | 4 planos         | 0                            |
| **Gemini 2.5 Pro (v2)** | 62.5%                | 0                | 2 planos (GM21, GM22)        |
| **Gemini 3 Pro**        | 100%                 | 0                | 4 planos (conteo incorrecto) |

## Conclusión

**Gemini 3 Pro** y **Claude Sonnet 4.5** son los modelos más adecuados para la extracción de punzonados con 100% de precisión, extrayendo correctamente todos los arrays en los 4 planos. Sin embargo, ambos tienen problemas sistemáticos con el conteo de grupos punzonados, contando +1 en todos los planos.

**GPT 4.1 Mini** muestra una precisión del 87.5% en punzonados, con solo un error menor en GM23 donde falta un valor.

**Gemini 2.5 Pro v2** muestra una mejora significativa respecto a v1, alcanzando 62.5% de precisión con 2 planos completamente correctos y errores menores en los otros 2.

**Gemini 2.5 Pro v1** tiene problemas graves en la extracción de punzonados, con todos los planos incorrectos debido a valores adicionales al inicio de cada array.
