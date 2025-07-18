import { Sequelize } from 'sequelize';
import defineTestModel from '../model/testModel';
import { initModels } from '../model/index';

const sequelize = new Sequelize('mydb', 'myuser', 'mypassword', {
  host: 'localhost',
  dialect: 'postgres',
  logging: console.log
});

// Initialize test model
const Test = defineTestModel(sequelize);

// Initialize all case-related models with associations
const models = initModels(sequelize);

const db = {
    sequelize,
    Sequelize,
    // Test,
    Case: models.Case,
    Indicator: models.Indicator,
    // IndicatorType: models.IndicatorType,
    Result: models.Result,
    // ResultType: models.ResultType,
    Tool: models.Tool,
}

export default db;