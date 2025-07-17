import { DataTypes, Sequelize, Model, Optional } from 'sequelize';
import { CaseAttributes } from '../types/caseTypes';

interface CaseCreationAttributes extends Optional<CaseAttributes, 'case_id'> {}

export default (sequelize: Sequelize) => {
  const Case = sequelize.define<Model<CaseAttributes, CaseCreationAttributes>>(
    'case',
    {
      case_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      case_name: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    },
    {
      tableName: 'case',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Case;
};
