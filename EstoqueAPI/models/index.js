const { sequelize } = require('../config/database');
const Usuario = require('./Usuario');
const Carro = require('./Carro');

// Definir relacionamentos
Carro.belongsTo(Usuario, {
  foreignKey: 'usuario_id',
  as: 'usuario'
});

Usuario.hasMany(Carro, {
  foreignKey: 'usuario_id',
  as: 'carros'
});

module.exports = {
  sequelize,
  Usuario,
  Carro
}; 