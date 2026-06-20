const { Model, DataTypes } = require('sequelize');

class Team extends Model {}

const initTeam = (sequelize) => {
  Team.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      dissolved_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      token_balance: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Team',
      tableName: 'teams',
      timestamps: true,
      underscored: true,
    }
  );
  return Team;
};

module.exports = { Team, initTeam };
