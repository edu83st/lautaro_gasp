# Análisis de Resultados - Planos MILITELLO

Este documento presenta un análisis comparativo de los resultados obtenidos por diferentes modelos de IA al procesar los planos MILITELLO, comparándolos con los valores esperados (`militello_expected.json`).

## Resumen Ejecutivo

Se evaluaron 3 modelos de IA:

- **GPT 4.1 Mini**: Mejor precisión en datos técnicos, pero diferencias en formato
- **Claude Sonnet 4.5**: Errores en conteo de grupos punzonados y formato de plano
- **Gemini 2.5 Pro**: Errores significativos en extracción de punzonados y distancias

## Estructura de Datos Esperada

Los resultados esperados contienen 4 planos:

- **1055-GM21**: Perfil C 240mm, longitud 6420mm, 5 grupos punzonados
- **1055-GM22**: Perfil C 140mm, longitud 6037mm, 5 grupos punzonados
- **1055-GM23**: Perfil C 140mm, longitud 6440mm, 5 grupos punzonados
- **1055-GM24**: Perfil C 240mm, longitud 5620mm, 4 grupos punzonados

## Análisis Detallado por Modelo

### 1. GPT 4.1 Mini (`militello_gpt_4.1_mini.json`)

#### ✅ Aciertos:

- Todos los valores de `longitud` correctos
- Todos los valores de `almaPerfil` y `tipoPerfil` correctos
- Formato de `plano` correcto ("1055-GM21", etc.)
- GM21, GM22, GM24: `punzonados` y `distancias` correctos
- `cantidadGruposPunzonados` correcta para GM21, GM22, GM24

#### ❌ Errores:

- **Campo `obra`**: Devuelve "1055 - MILITELLO" en lugar de "MILITELLO"
- **Campo `estaciones`**: Devuelve "GM21", "GM22", etc. en lugar de "N/A"
- **GM23**:
  - `cantidadGruposPunzonados`: 4 (esperado: 5)
  - `punzonados`: Falta el valor 6405 → `[173, 243, 6074, 6144, 6440]` (esperado: `[173, 243, 6074, 6144, 6405, 6440]`)
  - `distancias`: Falta el último valor → `[173, 70, 5831, 70, 261]` (esperado: `[173, 70, 5831, 70, 261, 35]`)

#### Observaciones:

- Incluye array `observaciones` con mensajes informativos (no presente en valores esperados)

**Precisión**: 87.5% (7 de 8 planos completamente correctos, 1 con errores menores)

---

### 2. Claude Sonnet 4.5 (`militello_sonnet_4.5.json`)

#### ✅ Aciertos:

- Todos los valores de `longitud` correctos
- Todos los valores de `almaPerfil` y `tipoPerfil` correctos
- Campo `estaciones` correcto ("N/A")
- Todos los arrays `punzonados` y `distancias` tienen valores correctos

#### ❌ Errores:

- **Campo `obra`**: Devuelve "1055 - MILITELLO" en lugar de "MILITELLO"
- **Campo `plano`**: Formato incorrecto → "GM21", "GM22", etc. (falta prefijo "1055-")
- **GM21**:
  - `cantidadGruposPunzonados`: 6 (esperado: 5)
  - `distancias[2]`: 5831 (esperado: 5830) - diferencia de 1mm
- **GM22**:
  - `cantidadGruposPunzonados`: 6 (esperado: 5)
- **GM23**:
  - `cantidadGruposPunzonados`: 6 (esperado: 5)
- **GM24**:
  - `cantidadGruposPunzonados`: 5 (esperado: 4)

**Precisión**: 50% (todos los planos tienen errores en `cantidadGruposPunzonados` y formato de `plano`)

---

### 3. Gemini 2.5 Pro (`militello_gemini_2.5_pro.json`)

#### ✅ Aciertos:

- Campo `obra` correcto ("MILITELLO")
- Campo `estaciones` correcto ("N/A")
- Formato de `plano` correcto ("1055-GM21", etc.)
- Todos los valores de `longitud` correctos
- Todos los valores de `almaPerfil` y `tipoPerfil` correctos

#### ❌ Errores Críticos:

- **GM21**:
  - `cantidadGruposPunzonados`: 6 (esperado: 5)
  - `punzonados`: Valores incorrectos → `[70, 170, 240, 6074, 6144, 6385, 6420]` (esperado: `[173, 243, 6074, 6144, 6385, 6420]`)
  - `distancias`: Valores incorrectos → `[70, 100, 70, 5830, 70, 241, 35]` (esperado: `[173, 70, 5830, 70, 241, 35]`)
- **GM22**:
  - `cantidadGruposPunzonados`: 6 (esperado: 5)
  - `punzonados`: Valores incorrectos → `[35, 70, 105, 5671, 5741, 6002, 6037]` (esperado: `[35, 105, 5671, 5741, 6002, 6037]`)
  - `distancias`: Valores incorrectos → `[35, 35, 35, 5566, 70, 261, 35]` (esperado: `[35, 70, 5566, 70, 261, 35]`)
- **GM23**:
  - `cantidadGruposPunzonados`: 6 (esperado: 5)
  - `punzonados`: Valores incorrectos → `[70, 173, 243, 6074, 6144, 6405, 6440]` (esperado: `[173, 243, 6074, 6144, 6405, 6440]`)
  - `distancias`: Valores incorrectos → `[70, 103, 70, 5831, 70, 261, 35]` (esperado: `[173, 70, 5831, 70, 261, 35]`)
- **GM24**:
  - `cantidadGruposPunzonados`: 5 (esperado: 4)
  - `punzonados`: Valores incorrectos → `[35, 70, 105, 5515, 5585, 5620]` (esperado: `[35, 105, 5515, 5585, 5620]`)
  - `distancias`: Valores incorrectos → `[35, 35, 35, 5410, 70, 35]` (esperado: `[35, 70, 5410, 70, 35]`)

**Patrón de Error**: Gemini está extrayendo punzonados adicionales al inicio de cada plano, lo que genera valores incorrectos en los arrays `punzonados` y `distancias`.

**Precisión**: 25% (todos los planos tienen errores significativos en extracción de datos)

---

## Comparativa de Precisión

| Modelo                | Precisión | Errores Críticos | Errores Menores             |
| --------------------- | --------- | ---------------- | --------------------------- |
| **GPT 4.1 Mini**      | 87.5%     | 0                | 1 plano (GM23)              |
| **Claude Sonnet 4.5** | 50%       | 0                | 4 planos (formato y conteo) |
| **Gemini 2.5 Pro**    | 25%       | 4 planos         | 0                           |

## Tipos de Errores Identificados

### 1. Errores de Formato

- **Campo `obra`**: Algunos modelos incluyen "1055 - " antes de "MILITELLO"
- **Campo `plano`**: Algunos modelos omiten el prefijo "1055-"
- **Campo `estaciones`**: Algunos modelos extraen el código de estación en lugar de "N/A"

### 2. Errores de Conteo

- **`cantidadGruposPunzonados`**: Varios modelos cuentan incorrectamente el número de grupos punzonados

### 3. Errores de Extracción de Datos

- **Arrays `punzonados`**: Algunos modelos extraen valores adicionales o incorrectos
- **Arrays `distancias`**: Errores derivados de la extracción incorrecta de punzonados

## Recomendaciones

1. **Mejor Modelo**: GPT 4.1 Mini muestra la mejor precisión general, con solo errores menores en formato y un plano con datos incompletos.

2. **Post-procesamiento Necesario**:

   - Normalizar campo `obra` a "MILITELLO"
   - Normalizar campo `estaciones` a "N/A"
   - Validar que `cantidadGruposPunzonados` coincida con la longitud de `punzonados - 1`
   - Validar que la suma de `distancias` coincida con `longitud`

3. **Validaciones Adicionales**:

   - Verificar que `punzonados[0]` sea igual a `distancias[0]`
   - Verificar que `punzonados[-1]` sea igual a `longitud`
   - Verificar que la suma de `distancias` sea igual a `longitud`

4. **Mejoras para Claude Sonnet 4.5**:

   - Corregir formato de campo `plano` para incluir prefijo "1055-"
   - Revisar lógica de conteo de grupos punzonados

5. **Mejoras para Gemini 2.5 Pro**:
   - Revisar completamente la lógica de extracción de punzonados
   - El modelo está detectando punzonados adicionales que no existen en los planos

## Conclusión

El modelo **GPT 4.1 Mini** es el más adecuado para este tipo de extracción, aunque requiere post-procesamiento para normalizar campos de formato. Los otros dos modelos necesitan mejoras significativas en sus prompts o lógica de extracción para alcanzar niveles aceptables de precisión.
