# Análisis de Resultados - Planos MOLINOS BOMBAL

Este documento presenta un análisis comparativo de los resultados obtenidos por diferentes modelos de IA al procesar los planos MOLINOS BOMBAL, comparándolos con los valores esperados (`bombal_expected.json`).

## Resumen Ejecutivo

Se evaluaron 3 modelos de IA procesando 8 planos (GMB2, GMB3, GMB5, GMB10, GMB11, GMB12, GMB13, GMB14).

**Gemini 2.5 Pro** obtuvo la mejor precisión con 75% (6 planos correctos), seguido de **Claude Sonnet 4.5** con 62.5% (5 planos correctos) y **GPT 4.1 Mini** con 12.5% (1 plano correcto).

## Resumen por Modelo

### GPT 4.1 Mini

**Precisión**: 12.5% (1 de 8 planos correctos)

**Resumen**: El modelo tiene problemas graves en la extracción de punzonados. Solo GMB11 tiene valores técnicos correctos, aunque con conteo incorrecto. En los demás planos (especialmente GMB3, GMB5, GMB10 y GMB13) los valores de punzonados y distancias son completamente incorrectos, sugiriendo que está interpretando mal los planos o extrayendo datos de lugares incorrectos.

**Errores principales**:

- Extracción completamente incorrecta de punzonados en 7 de 8 planos
- Campo `obra` incluye prefijo "1132 - " en lugar de solo "MOLINOS BOMBAL"
- Errores en conteo de grupos punzonados

---

### Claude Sonnet 4.5

**Precisión**: 62.5% (5 de 8 planos correctos)

**Resumen**: Muestra una precisión aceptable con 5 planos completamente correctos (GMB5, GMB10, GMB11, GMB12, GMB14). Los errores se concentran principalmente en GMB2, GMB3 y GMB13, donde extrae punzonados adicionales o valores incorrectos.

**Errores principales**:

- Extracción de punzonados adicionales en GMB2, GMB3 y GMB13
- Campo `obra` incluye prefijo "1132 - " en lugar de solo "MOLINOS BOMBAL"
- Errores menores en conteo de grupos punzonados

---

### Gemini 2.5 Pro

**Precisión**: 75% (6 de 8 planos correctos)

**Resumen**: El mejor rendimiento general con 6 planos completamente correctos (GMB3, GMB5, GMB10, GMB11, GMB12, GMB14). Solo tiene errores menores en GMB2 y GMB13, donde omite algunos valores de punzonados. Los errores son consistentes y menores, sugiriendo que con pequeñas correcciones podría alcanzar niveles muy altos de precisión.

**Errores principales**:

- Omisión de valores de punzonados en GMB2 (falta 7045) y GMB13 (falta 1011)
- Campo `obra` incluye prefijo "1132 - " en lugar de solo "MOLINOS BOMBAL"
- Errores menores en distancias derivados de los punzonados faltantes

---

## Comparativa de Precisión

| Modelo                | Precisión | Planos Correctos | Errores Críticos | Errores Menores |
| --------------------- | --------- | ---------------- | ---------------- | --------------- |
| **GPT 4.1 Mini**      | 12.5%     | 1 (GMB11)        | 7 planos         | 0               |
| **Claude Sonnet 4.5** | 62.5%     | 5 planos         | 0                | 3 planos        |
| **Gemini 2.5 Pro**    | 75%       | 6 planos         | 0                | 2 planos        |

## Conclusión

**Gemini 2.5 Pro** es el modelo más adecuado para este tipo de extracción con una precisión del 75%, mostrando solo errores menores en 2 planos. Con pequeñas correcciones en la extracción de punzonados, podría alcanzar niveles de precisión muy altos.

**Claude Sonnet 4.5** muestra una precisión aceptable del 62.5%, con 5 planos completamente correctos y errores menores en los otros 3.

**GPT 4.1 Mini** tiene problemas significativos en la extracción de datos, con solo 1 plano correcto y errores críticos en la mayoría de los planos. Requiere mejoras importantes en su lógica de extracción.

Los planos GMB2, GMB3 y GMB13 son los más problemáticos y requieren atención especial en el procesamiento.
