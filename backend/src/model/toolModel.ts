import { DataTypes, Sequelize, Model, Optional } from 'sequelize';
import { ToolAttributes } from '../types/caseTypes';

interface ToolCreationAttributes extends Optional<ToolAttributes, 'tool_id'> {}

export default (sequelize: Sequelize) => {
  const Tool = sequelize.define<Model<ToolAttributes, ToolCreationAttributes>>(
    'tool',
    {
      tool_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      tool_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'tools',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Tool;
};
