import { DataTypes, Sequelize, Model, Optional } from 'sequelize';
import { TestAttributes } from '../types/testTypes';
interface TestCreationAttributes extends Optional<TestAttributes, 'id'> {}

export default (sequelize: Sequelize) => {
  const Test = sequelize.define<Model<TestAttributes, TestCreationAttributes>>(
    'test',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      test_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'test',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Test;
};