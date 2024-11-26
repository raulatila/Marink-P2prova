
module.exports = (sequelize, DataTypes) => {
  // Define o modelo Profile
  const Profile = sequelize.define(
    'Profile',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: false, // Adicionado para garantir preenchimento obrigatório
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      profession: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      balance: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0, // Balance inicial é 0
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'Profiles',
      timestamps: false, // Remove os campos createdAt e updatedAt
    }
  );

  // Define as associações do modelo
  Profile.associate = (models) => {
    Profile.hasMany(models.Contract, {
      foreignKey: 'clientId',
      as: 'clientContracts', // Associações de cliente
    });

    Profile.hasMany(models.Contract, {
      foreignKey: 'contractorId',
      as: 'contractorContracts', // Associações de contratante
    });

    Profile.hasMany(models.Deposit, {
      foreignKey: 'clientId',
      as: 'deposits', // Depósitos feitos pelo cliente
    });
  };

  return Profile;
};
