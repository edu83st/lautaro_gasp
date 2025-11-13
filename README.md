# Lautaro GASP

Sistema para generar archivos de configuración GASP a partir de planos técnicos.

## Estructura del Proyecto

```
lautaro_gasp/
├── program/              # Código JavaScript para generación de archivos
│   ├── generador.js      # Lógica principal de generación
│   ├── punzonesDisponibles.js  # Datos de referencia
│   └── ejemplo.js        # Ejemplo de uso
├── n8n/                  # Código para nodos de n8n
│   ├── generator.js      # Nodo Code para generación
│   ├── transformOutput.js  # Nodo Code para transformación de salidas
│   ├── PROMPT-ORQUESTADOR.md  # Prompt para agente orquestador
│   ├── PROMPT-ORQUESTADOR-main.md  # Prompt principal del orquestador
│   └── PROMPT-CORREAS-GALVANIZADAS.md  # Prompt para correas galvanizadas
├── examples/             # Planos técnicos de ejemplo
└── raw/                 # Archivos CSV y resultados de referencia
```

## Descripción

Este proyecto emula el proceso de generación de archivos de texto (C200-.txt) a partir de planos técnicos. El sistema procesa planos técnicos mediante agentes de IA que extraen información estructurada y generan archivos de configuración en formato GASP.

## Componentes Principales

### 1. Generador de Archivos (`program/`)

Lógica JavaScript que convierte datos estructurados en archivos de texto GASP.

- **Entrada**: Datos estructurados (estaciones, tipo de perfil, longitud, punzonados, etc.)
- **Salida**: Archivo de texto en formato GASP

### 2. Nodos n8n (`n8n/`)

Código para integrar el sistema en workflows de n8n:

- `generator.js`: Procesa múltiples inputs y genera archivos de texto
- `transformOutput.js`: Transforma salidas de agentes de IA a formato esperado
- Prompts para agentes de IA que procesan planos técnicos

### 3. Agentes de IA

Sistema de prompts para procesamiento de planos técnicos:

- **Orquestador**: Identifica el tipo de plano y selecciona el prompt adecuado
- **Específicos**: Extraen información de planos técnicos según su tipo

## Uso

### Generación de Archivos (JavaScript)

Ver `program/README.md` para detalles sobre el uso del generador.

### Integración con n8n

1. Copia el contenido de `n8n/generator.js` en un nodo Code de n8n
2. Configura los inputs según el formato esperado (ver `n8n/mock-input.json`)
3. El nodo retornará el contenido del archivo generado

## Formato de Datos

### Entrada

```json
{
  "estaciones": "5-6",
  "almaPerfil": 140,
  "tipoPerfil": "C",
  "plano": "GCV86",
  "longitud": 5630,
  "punzonados": {
    "PZ-1": 35,
    "PZ-2": 1385,
    "PZ-3": 2775,
    "PZ-4": 4165,
    "PZ-5": 5515,
    "PZ-6": 5550
  }
}
```

### Salida

El sistema genera un archivo de texto en formato GASP con secciones `[DATA]` y `[BANCO1]`.

## Licencia

[Especificar licencia si aplica]
