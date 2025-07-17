import { DataTypes, Sequelize, Model, Optional } from 'sequelize';
import { IndicatorTypeAttributes } from '../types/caseTypes';

interface IndicatorTypeCreationAttributes extends Optional<IndicatorTypeAttributes, 'type_id'> {}

export default (sequelize: Sequelize) => {
  const IndicatorType = sequelize.define<Model<IndicatorTypeAttributes, IndicatorTypeCreationAttributes>>(
    'indicatorType',
    {
      type_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      type_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'indicator_type',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return IndicatorType;
};
