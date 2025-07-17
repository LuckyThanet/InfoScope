import { DataTypes, Sequelize, Model, Optional } from 'sequelize';
import { ResultTypeAttributes } from '../types/caseTypes';

interface ResultTypeCreationAttributes extends Optional<ResultTypeAttributes, 'result_type_id'> {}

export default (sequelize: Sequelize) => {
  const ResultType = sequelize.define<Model<ResultTypeAttributes, ResultTypeCreationAttributes>>(
    'resultType',
    {
      result_type_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      result_type_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'result_type',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return ResultType;
};
