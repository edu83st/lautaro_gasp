/**
 * Tabla de Punzonados Disponibles
 * Contiene la información de referencia sobre los tipos de punzonados y perfiles disponibles
 */

export const PUNZONES_DISPONIBLES = {
  punzonados: [
    { codigo: 'S/PZ', descripcion: 'Sin Punzonado' },
    { codigo: 'Ø10', descripcion: 'Diámetro 10' },
    { codigo: 'Ø12', descripcion: 'Diámetro 12' },
    { codigo: 'Ø14', descripcion: 'Diámetro 14' },
    { codigo: 'Ø16', descripcion: 'Diámetro 16' },
    { codigo: 'Ø18', descripcion: 'Diámetro 18' },
    { codigo: 'Ø20', descripcion: 'Diámetro 20' },
    { codigo: '14x28 L', descripcion: '14x28 L' },
    { codigo: '14x28 T', descripcion: '14x28 T' },
    { codigo: '11x25 L', descripcion: '11x25 L' },
    { codigo: '11x25 T', descripcion: '11x25 T' }
  ],
  
  tiposPerfiles: [
    { codigo: 'C', descripcion: 'Perfil C' },
    { codigo: 'U', descripcion: 'Perfil U' },
    { codigo: 'Z', descripcion: 'Perfil Z' },
    { codigo: 'NRV', descripcion: 'Perfil NRV' },
    { codigo: 'SIGMA', descripcion: 'Perfil SIGMA' }
  ],
  
  /**
   * Valida si un código de punzonado es válido
   */
  esPunzonadoValido(codigo) {
    return this.punzonados.some(p => p.codigo === codigo);
  },
  
  /**
   * Valida si un tipo de perfil es válido
   */
  esPerfilValido(codigo) {
    return this.tiposPerfiles.some(p => p.codigo === codigo);
  }
};

