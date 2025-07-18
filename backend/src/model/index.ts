import { Sequelize } from 'sequelize';
import caseModel from './caseModel';
import indicatorModel from './indicatorModel';
import indicatorTypeModel from './indicatorTypeModel';
import resultModel from './resultModel';
import resultTypeModel from './resultTypeModel';
import toolModel from './toolModel';

export const initModels = (sequelize: Sequelize) => {
  // Initialize models
  const Case = caseModel(sequelize);
  const Indicator = indicatorModel(sequelize);
  const IndicatorType = indicatorTypeModel(sequelize);
  const Result = resultModel(sequelize);
  const ResultType = resultTypeModel(sequelize);
  const Tool = toolModel(sequelize);

  // Define associations
  // Case has many Indicators (one-to-many)
  Case.hasMany(Indicator, {
    foreignKey: 'case',
    sourceKey: 'case_id',
    as: 'indicators',
  });
  Indicator.belongsTo(Case, {
    foreignKey: 'case',
    targetKey: 'case_id',
    as: 'caseData',
  });

  // IndicatorType has many Indicators (one-to-many)
  // IndicatorType.hasMany(Indicator, {
  //   foreignKey: 'type',
  //   sourceKey: 'type_id',
  //   as: 'indicators',
  // });
  // Indicator.belongsTo(IndicatorType, {
  //   foreignKey: 'type',
  //   targetKey: 'type_id',
  //   as: 'indicatorType',
  // });

  // Indicator has many Results (one-to-many)
  Indicator.hasMany(Result, {
    foreignKey: 'indicator',
    sourceKey: 'indicator_id',
    as: 'results',
  });
  Result.belongsTo(Indicator, {
    foreignKey: 'indicator',
    targetKey: 'indicator_id',
    as: 'indicatorData',
  });

  // Tool has many Results (one-to-many)
  Tool.hasMany(Result, {
    foreignKey: 'tool',
    sourceKey: 'tool_id',
    as: 'results',
  });
  Result.belongsTo(Tool, {
    foreignKey: 'tool',
    targetKey: 'tool_id',
    as: 'toolData',
  });

  // ResultType has many Results (one-to-many)
  // ResultType.hasMany(Result, {
  //   foreignKey: 'type',
  //   sourceKey: 'result_type_id',
  //   as: 'results',
  // });
  // Result.belongsTo(ResultType, {
  //   foreignKey: 'type',
  //   targetKey: 'result_type_id',
  //   as: 'resultType',
  // });

  return {
    Case,
    Indicator,
    // IndicatorType,
    Result,
    // ResultType,
    Tool,
  };
};
