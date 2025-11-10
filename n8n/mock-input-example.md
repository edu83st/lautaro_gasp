# Ejemplos de JSON para Mock del Nodo Anterior en n8n

Estos son ejemplos de JSON que puedes usar como mock del nodo anterior en n8n para probar el generador.

## Formato 1: Objeto estructurado (recomendado)

Este formato es el más limpio y organizado. Los punzones vienen en un objeto separado:

```json
{
  "json": {
    "estaciones": "5-6",
    "almaPerfil": 140,
    "tipoPerfil": "C",
    "plano": "GCV86",
    "longitud": 5630,
    "punzones": {
      "PZ-1": 35,
      "PZ-2": 1385,
      "PZ-3": 2775,
      "PZ-4": 4165,
      "PZ-5": 5515,
      "PZ-6": 5550
    }
  }
}
```

## Formato 2: Campos separados (alternativo)

Este formato simula cuando los datos vienen como campos separados en el JSON:

```json
{
  "json": {
    "ESTACIONES": "5-6",
    "ALMA DE PERFIL": 140,
    "TIPO DE PERFIL": "C",
    "PLANO": "GCV86",
    "LONGITUD": 5630,
    "PZ-1": 35,
    "PZ-2": 1385,
    "PZ-3": 2775,
    "PZ-4": 4165,
    "PZ-5": 5515,
    "PZ-6": 5550
  }
}
```

## Cómo usar en n8n

1. **Crear un nodo "Set" o "Code" antes del nodo generador**
   - En el nodo anterior, configura los datos de salida usando uno de los formatos anteriores
   - O usa un nodo "HTTP Request" con respuesta mock

2. **En el nodo de código generador**
   - El código ya está preparado para leer desde `$input.item.json`
   - Funcionará con cualquiera de los dos formatos mostrados arriba

3. **Para probar directamente**
   - Puedes usar el nodo "Set" de n8n y configurar los valores manualmente
   - O crear un workflow de prueba con un nodo "Manual Trigger" seguido de un "Set"

## Ejemplo con más punzones

Si necesitas probar con más punzones, simplemente agrega más campos PZ-X:

```json
{
  "json": {
    "estaciones": "5-6",
    "almaPerfil": 140,
    "tipoPerfil": "C",
    "plano": "GCV86",
    "longitud": 5630,
    "punzones": {
      "PZ-1": 35,
      "PZ-2": 1385,
      "PZ-3": 2775,
      "PZ-4": 4165,
      "PZ-5": 5515,
      "PZ-6": 5550,
      "PZ-7": 6000,
      "PZ-8": 6500
    }
  }
}
```

## Notas importantes

- Los valores numéricos deben ser números, no strings (sin comillas)
- Los punzones pueden venir en cualquier orden, el código los ordena automáticamente
- Si falta algún campo requerido, el código lanzará un error descriptivo
- El código valida que el tipo de perfil sea uno de: C, U, Z, NRV, SIGMA

