const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Carro = sequelize.define(
  "Carro",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    marca: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 50],
      },
    },
    modelo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 50],
      },
    },
    ano: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1900,
        max: new Date().getFullYear() + 1,
      },
    },
    preco: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    quilometragem: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    combustivel: {
      type: DataTypes.ENUM(
        "flex",
        "gasolina",
        "etanol",
        "diesel",
        "hibrido",
        "eletrico"
      ),
      allowNull: false,
      defaultValue: "flex",
    },
    transmissao: {
      type: DataTypes.ENUM("manual", "automatico", "cvt"),
      allowNull: false,
      defaultValue: "manual",
    },
    cor: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 30],
      },
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    caracteristicas: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    imagens: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "carros",
    timestamps: true,
    createdAt: "data_cadastro",
    updatedAt: "data_atualizacao",
  }
);

module.exports = Carro;
