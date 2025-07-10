import { Sequelize } from 'sequelize';
import defineTestModel from '../model/testModel';

const sequelize = new Sequelize('mydb', 'myuser', 'mypassword', {
  host: 'localhost',
  dialect: 'postgres',
  logging: console.log
});


const Test = defineTestModel(sequelize);


const db = {
    sequelize,
    Sequelize,
    Test,
}

export default db;