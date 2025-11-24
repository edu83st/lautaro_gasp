# Análisis de Resultados - Planos MOLINOS BOMBAL

Este documento presenta un análisis comparativo de los resultados obtenidos por diferentes modelos de IA al procesar los planos MOLINOS BOMBAL, comparándolos con los valores esperados (`bombal_expected.json`). El análisis se enfoca únicamente en la precisión de los arrays `punzonados` y el campo `cantidadGruposPunzonados`.

## Resumen Ejecutivo

Se evaluaron 4 modelos de IA procesando 8 planos (GMB2, GMB3, GMB5, GMB10, GMB11, GMB12, GMB13, GMB14).

**Gemini 3 Pro** obtuvo la mejor precisión con 87.5% (7 planos correctos), seguido de **Gemini 2.5 Pro** con 75% (6 planos correctos), **Claude Sonnet 4.5** con 62.5% (5 planos correctos) y **GPT 4.1 Mini** con 12.5% (1 plano correcto).

## Resumen por Modelo

### GPT 4.1 Mini

**Precisión en punzonados**: 12.5% (1 de 8 planos correctos)

**Resumen**: Problemas graves en la extracción de punzonados. Solo GMB11 tiene valores correctos, aunque con conteo incorrecto. En los demás planos (especialmente GMB3, GMB5, GMB10 y GMB13) los arrays de punzonados son completamente incorrectos.

**Errores en punzonados**:

- **GMB2**: Valor extra 7010 → `[35, 7010, 7045, 7131, 7353]` (esperado: `[35, 7045, 7131, 7353]`)
- **GMB3**: Valores completamente incorrectos → `[82, 164, 250, 418, 7178, 7213]` (esperado: `[82, 168, 7178, 7213]`)
- **GMB5**: Valores completamente incorrectos → `[220, 160, 60, 0, 7080]` (esperado: `[35, 7045, 7080]`)
- **GMB10**: Valores completamente incorrectos → `[120, 100, 80, 70, 8056]` (esperado: `[35, 7045, 7131, 8021, 8056]`)
- **GMB11**: Correcto pero con valor extra → `[35, 3079, 3114, 3378]` (esperado: `[35, 3114, 3378]`)
- **GMB12**: Correcto pero con valor extra → `[35, 2738, 2773, 2808]` (esperado: `[35, 2773, 2808]`)
- **GMB13**: Valores completamente incorrectos → `[220, 160, 60, 0, 8189]` (esperado: `[35, 925, 1011, 8021, 8107, 8189]`)
- **GMB14**: Valores incorrectos → `[129, 86, 215, 7225, 7543]` (esperado: `[129, 215, 7225, 7311, 7543]`)

**Errores en cantidadGruposPunzonados**:

- Todos los planos tienen conteo incorrecto excepto GMB10 y GMB14

---

### Claude Sonnet 4.5

**Precisión en punzonados**: 62.5% (5 de 8 planos correctos)

**Resumen**: 5 planos completamente correctos (GMB5, GMB10, GMB11, GMB12, GMB14). Los errores se concentran en GMB2, GMB3 y GMB13, donde extrae punzonados adicionales.

**Errores en punzonados**:

- **GMB2**: Valor extra 7010 → `[35, 7010, 7045, 7131, 7353]` (esperado: `[35, 7045, 7131, 7353]`)
- **GMB3**: Valores incorrectos → `[82, 164, 250, 418, 7178, 7213]` (esperado: `[82, 168, 7178, 7213]`)
- **GMB13**: Valor extra 1097 → `[35, 925, 1011, 1097, 8107, 8189]` (esperado: `[35, 925, 1011, 8021, 8107, 8189]`)

**Errores en cantidadGruposPunzonados**:

- **GMB2**: 4 (esperado: 3)
- **GMB3**: 5 (esperado: 3)
- **GMB13**: 5 (correcto, pero punzonados tienen valor extra)

---

### Gemini 2.5 Pro

**Precisión en punzonados**: 75% (6 de 8 planos correctos)

**Resumen**: 6 planos completamente correctos (GMB3, GMB5, GMB10, GMB11, GMB12, GMB14). Solo tiene errores menores en GMB2 y GMB13, donde omite algunos valores.

**Errores en punzonados**:

- **GMB2**: Falta valor 7045 → `[35, 7046, 7131, 7353]` (esperado: `[35, 7045, 7131, 7353]`)
- **GMB13**: Falta valor 1011 → `[35, 925, 8021, 8107, 8189]` (esperado: `[35, 925, 1011, 8021, 8107, 8189]`)

**Errores en cantidadGruposPunzonados**:

- **GMB2**: 4 (esperado: 3)
- **GMB13**: 5 (correcto, pero falta valor en punzonados)

---

### Gemini 3 Pro

**Precisión en punzonados**: 87.5% (7 de 8 planos correctos)

**Resumen**: El mejor rendimiento con 7 planos completamente correctos (GMB2, GMB3, GMB5, GMB10, GMB12, GMB13, GMB14). Solo tiene errores menores en GMB11 y GMB12.

**Errores en punzonados**:

- **GMB11**: Falta valor inicial 35 → `[3079, 3114, 3378]` (esperado: `[35, 3114, 3378]`)
- **GMB12**: Valor extra 2738 → `[35, 2738, 2773, 2808]` (esperado: `[35, 2773, 2808]`)

**Errores en cantidadGruposPunzonados**:

- **GMB12**: 3 (esperado: 2) - debido al valor extra en punzonados

---

## Comparativa de Precisión

| Modelo                | Precisión Punzonados | Planos Correctos | Errores Críticos | Errores Menores |
| --------------------- | -------------------- | ---------------- | ---------------- | --------------- |
| **GPT 4.1 Mini**      | 12.5%                | 1 (GMB11)        | 7 planos         | 0               |
| **Claude Sonnet 4.5** | 62.5%                | 5 planos         | 0                | 3 planos        |
| **Gemini 2.5 Pro**    | 75%                  | 6 planos         | 0                | 2 planos        |
| **Gemini 3 Pro**      | 87.5%                | 7 planos         | 0                | 2 planos        |

## Conclusión

**Gemini 3 Pro** es el modelo más adecuado para la extracción de punzonados con una precisión del 87.5%, mostrando solo errores menores en 2 planos (GMB11 y GMB12). Con pequeñas correcciones, podría alcanzar niveles de precisión muy altos.

**Gemini 2.5 Pro** muestra un buen rendimiento con 75% de precisión, con 6 planos completamente correctos y errores menores en 2 planos.

**Claude Sonnet 4.5** muestra una precisión aceptable del 62.5%, con 5 planos completamente correctos y errores en los otros 3.

**GPT 4.1 Mini** tiene problemas significativos en la extracción de punzonados, con solo 1 plano correcto y errores críticos en la mayoría de los planos.

Los planos GMB2, GMB3 y GMB13 son los más problemáticos y requieren atención especial en el procesamiento.
