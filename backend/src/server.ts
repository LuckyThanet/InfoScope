import express, { Express, Request, Response } from "express";
import database from "./database/database";
import cors from 'cors';
import apiRouter from "./routes/apiRouter";

const app:Express = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(
    cors({
        origin: ["http://localhost:5173"],
        methods: ["GET", "POST", "PUT", "DELETE"],
    }),
);
app.use(express.urlencoded({ extended: true }));

app.use('/api/', apiRouter);
// Routes

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'first ("/")' });
});



// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

const startServer = async () => {
  try {
    await database.sequelize.authenticate();
    await database.sequelize.sync({ force: false}); 

    console.log('Connection has been established successfully.');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();