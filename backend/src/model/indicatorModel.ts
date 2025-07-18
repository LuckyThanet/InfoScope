import { DataTypes, Sequelize, Model, Optional } from 'sequelize';
import { IndicatorAttributes } from '../types/caseTypes';

interface IndicatorCreationAttributes extends Optional<IndicatorAttributes, 'indicator_id'> {}

export default (sequelize: Sequelize) => {
  const Indicator = sequelize.define<Model<IndicatorAttributes, IndicatorCreationAttributes>>(
    'indicator',
    {
      indicator_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      value: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      case: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'case',
          key: 'case_id',
        },
      },
    },
    {
      tableName: 'indicators',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Indicator;
};
