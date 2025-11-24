// ============================================
// Nodo getAprobados para n8n
// Combina datos de getPlanosAprobados y getMedidasAprobados
// ============================================

try {
  // Obtener entradas de los nodos anteriores
  const planosAprobadosItems = $('getPlanosAprobados').all() || [];
  const medidasAprobadosItems = $('getMedidasAprobados').all() || [];

  // Extraer los datos JSON de cada entrada
  let planosAprobados = [];
  let medidasAprobados = [];

  // Procesar planos aprobados
  if (planosAprobadosItems.length > 0) {
    planosAprobados = planosAprobadosItems
      .map((item) => {
        // Manejar diferentes estructuras de entrada
        if (Array.isArray(item.json)) {
          return item.json;
        } else if (item.json && Array.isArray(item.json.data)) {
          return item.json.data;
        } else if (item.json && typeof item.json === 'object') {
          return [item.json];
        }
        return [];
      })
      .flat();
  }

  // Procesar medidas aprobados
  if (medidasAprobadosItems.length > 0) {
    medidasAprobados = medidasAprobadosItems
      .map((item) => {
        // Manejar diferentes estructuras de entrada
        if (Array.isArray(item.json)) {
          return item.json;
        } else if (item.json && Array.isArray(item.json.data)) {
          return item.json.data;
        } else if (item.json && typeof item.json === 'object') {
          return [item.json];
        }
        return [];
      })
      .flat();
  }

  // Validar que tenemos datos
  if (planosAprobados.length === 0) {
    throw new Error('No se recibieron datos de getPlanosAprobados');
  }

  if (medidasAprobados.length === 0) {
    throw new Error('No se recibieron datos de getMedidasAprobados');
  }

  // Crear un mapa de planos por Id/Plano para acceso rápido
  const planosMap = new Map();
  planosAprobados.forEach((plano) => {
    const planoId = plano.Id || plano.Plano || plano.id || plano.plano;
    if (planoId) {
      planosMap.set(planoId, plano);
    }
  });

  // Agrupar medidas por PlanoId
  const medidasPorPlano = new Map();
  medidasAprobados.forEach((medida) => {
    const planoId = medida.PlanoId || medida.planoId;
    if (planoId) {
      if (!medidasPorPlano.has(planoId)) {
        medidasPorPlano.set(planoId, []);
      }
      medidasPorPlano.get(planoId).push(medida);
    }
  });

  // Generar el output combinando planos y medidas
  const output = [];

  // Iterar sobre los planos aprobados
  planosAprobados.forEach((plano) => {
    const planoId = plano.Id || plano.Plano || plano.id || plano.plano;
    if (!planoId) return;

    // Obtener las medidas para este plano
    const medidas = medidasPorPlano.get(planoId) || [];

    // Ordenar medidas por número (PZ-1, PZ-2, etc.)
    const medidasOrdenadas = medidas.sort((a, b) => {
      const numA =
        parseInt((a.Medida || a.medida || '').replace('PZ-', '')) || 0;
      const numB =
        parseInt((b.Medida || b.medida || '').replace('PZ-', '')) || 0;
      return numA - numB;
    });

    // Extraer valores de punzonados ordenados
    const punzonados = medidasOrdenadas
      .map((medida) => {
        const valor = medida.Valor || medida.valor || 0;
        return typeof valor === 'number' ? valor : parseFloat(valor) || 0;
      })
      .filter((valor) => valor !== null && valor !== undefined);

    // Solo agregar al output si tiene punzonados
    if (punzonados.length === 0) {
      return; // Saltar este plano si no tiene punzonados
    }

    // Construir el objeto de salida
    const outputItem = {
      estaciones: plano.Estaciones || plano.estaciones || 'N/A',
      almaPerfil: parseFloat(
        plano['Alma Perfil'] || plano.almaPerfil || plano['Alma de Perfil'] || 0
      ),
      tipoPerfil:
        plano['Tipo Perfil'] ||
        plano.tipoPerfil ||
        plano['Tipo de Perfil'] ||
        '',
      plano: planoId,
      longitud: parseFloat(plano.Longitud || plano.longitud || 0),
      punzonados: punzonados,
    };

    output.push(outputItem);
  });

  // Retornar en el formato esperado
  return [
    {
      json: {
        items: {
          output: output,
        },
      },
    },
  ];
} catch (error) {
  console.error('[getAprobados] Error:', error);
  return [
    {
      json: {
        error: true,
        mensaje: error.message,
        stack: error.stack,
      },
    },
  ];
}
