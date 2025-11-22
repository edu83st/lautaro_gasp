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
          "value": "gid=0",
          "mode": "list",
          "cachedResultName": "Medidas",
          "cachedResultUrl": "https://docs.google.com/spreadsheets/d/1_FgIJ-ZJxoiw-ksfiboO2741TD5n491P7RH3trtRgtA/edit#gid=0"
        },
        "columns": {
          "mappingMode": "defineBelow",
          "value": {
            "Hash": "={{ $json.hash }}",
            "PlanoId": "={{ $json.plano }}",
            "Medida": "={{ $json.medida }}",
            "Valor": "={{ $json.valor }}"
          },
          "matchingColumns": [
            "Hash"
          ],
          "schema": [
            {
              "id": "Hash",
              "displayName": "Hash",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": false
            },
            {
              "id": "PlanoId",
              "displayName": "PlanoId",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Medida",
              "displayName": "Medida",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "Valor",
              "displayName": "Valor",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
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
        1344,
        1104
      ],
      "id": "bf70e270-710f-4669-9c2c-6b2b939fe025",
      "name": "updateMedidas",
      "credentials": {
        "googleSheetsOAuth2Api": {
          "id": "5eZaiXYm8J2g11wg",
          "name": "Google Sheets account"
        }
      }
    }
  ],
  "connections": {},
  "pinData": {},
  "meta": {
    "templateCredsSetupCompleted": true,
    "instanceId": "f90e91753a3d3051e36567c09c1bc7ca3b0fdb5d350413776236c4bcd0a39f96"
  }
}