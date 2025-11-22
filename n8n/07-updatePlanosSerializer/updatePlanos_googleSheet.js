{
  "nodes": [
    {
      "parameters": {
        "operation": "appendOrUpdate",
        "documentId": {
          "__rl": true,
          "value": "1_FgIJ-ZJxoiw-ksfiboO2741TD5n491P7RH3trtRgtA",
          "mode": "id"
        },
        "sheetName": {
          "__rl": true,
          "value": 2100298841,
          "mode": "list",
          "cachedResultName": "Plano",
          "cachedResultUrl": "https://docs.google.com/spreadsheets/d/1_FgIJ-ZJxoiw-ksfiboO2741TD5n491P7RH3trtRgtA/edit#gid=2100298841"
        },
        "columns": {
          "mappingMode": "defineBelow",
          "value": {
            "Id": "={{ $json.plano }}",
            "Proveedor": "Inlcuir Proveedor",
            "Estaciones": "={{ $json.estaciones }}",
            "Alma Perfil": "={{ $json.almaPerfil }}",
            "Tipo Perfil": "={{ $json.tipoPerfil }}",
            "Plano": "={{ $json.plano }}",
            "Longitud": "={{ $json.longitud }}",
            "Cant Punzonados": "={{ $json.punzonados.length }}",
            "Observaciones": "={{ $json.observaciones }}"
          },
          "matchingColumns": [
            "Id"
          ],
          "schema": [
            {
              "id": "Id",
              "displayName": "Id",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": false
            },
            {
              "id": "Proveedor",
              "displayName": "Proveedor",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Estaciones",
              "displayName": "Estaciones",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Alma Perfil",
              "displayName": "Alma Perfil",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Tipo Perfil",
              "displayName": "Tipo Perfil",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Plano",
              "displayName": "Plano",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Longitud",
              "displayName": "Longitud",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Cant Punzonados",
              "displayName": "Cant Punzonados",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Observaciones",
              "displayName": "Observaciones",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": false
            }
          ],
          "attemptToConvertTypes": false,
          "convertFieldsToString": false
        },
        "options": {}
      },
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4.7,
      "position": [
        1248,
        816
      ],
      "id": "7701ab55-3c9e-4cf0-9836-04e1c2b15d95",
      "name": "updatePlanos",
      "credentials": {
        "googleSheetsOAuth2Api": {
          "id": "5eZaiXYm8J2g11wg",
          "name": "Google Sheets account"
        }
      }
    }
  ],
  "connections": {
    "updatePlanos": {
      "main": [
        []
      ]
    }
  },
  "pinData": {},
  "meta": {
    "templateCredsSetupCompleted": true,
    "instanceId": "f90e91753a3d3051e36567c09c1bc7ca3b0fdb5d350413776236c4bcd0a39f96"
  }
}