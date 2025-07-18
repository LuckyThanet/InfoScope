import { DataTypes, Sequelize, Model, Optional } from 'sequelize';
import { ResultAttributes } from '../types/caseTypes';

interface ResultCreationAttributes extends Optional<ResultAttributes, 'result_id'> {}

export default (sequelize: Sequelize) => {
  const Result = sequelize.define<Model<ResultAttributes, ResultCreationAttributes>>(
    'result',
    {
      result_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      result: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      tool: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'tools',
          key: 'tool_id',
        },
      },
      indicator: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'indicators',
          key: 'indicator_id',
        },
      },
    },
    {
      tableName: 'results',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Result;
};
