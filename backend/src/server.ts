import express, { Express, Request, Response } from "express";
import database from "./database/database";
import cors from 'cors';
import hello from "./routes/hello";

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

const sdk = require('postman-collection');
const generator = require('postman-code-generators');



// const request = new sdk.Request({
//   method: 'GET',
//   header: [
//     {
//       key: 'User-Agent',
//       value: 'MyAwesomeApp/1.0',
//     },
//     {
//       key: 'Postman-Token',
//       value: 'a0b1c2d3-e4f5-6789-abcd-ef0123456789',
//     },
//     {
//       key: 'Accept',
//       value: '*/*',
//     }
//   ],
//   url: new sdk.Url({
//     protocol: 'https',
//     host: ['haveibeenpwned', 'com'],
//     path: ['unifiedsearch', 'charuwan_arkat@hotmail.com']
//   })
// });

// // ✅ Generate axios code
// generator.convert(
//   request.toJSON(),
//   'nodejs',
//   'axios',
//   {},
//   (err: Error | null, snippet: string) => {
//     if (err) {
//       console.error('Error generating code:', err.message);
//       console.error(JSON.stringify(err, null, 2));
//     } else {
//       console.log(snippet);
//     }
//   }
// );

const email = 'charuwan_arkat@hotmail.com';

// fetch(`https://api.pwnedpasswords.com/range/7c4a8`, {
//   method: 'GET',
//   headers: {
//     // 'hibp-api-key': 'pk_3345470725c48b212f86f2b4e8779901',
//     'User-Agent': 'MyAwesomeApp/1.0',
//     'Accept': 'application/json'
//   }
// })
//   .then(response => {
//     if (!response.ok) throw new Error(`Error: ${response.status}`);
//     return response.text();
//   })
//   .then(data => {
//     console.log('Breaches found:', data);
//   })
//   .catch(error => {
//     console.error('Failed to fetch:', error.message);
//   });



app.use('/api/', hello);
// Routes

app.get('/whois', hello);

app.get('/wmn', hello);

app.get('/hipn', hello);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'first ("/")' });
});



// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

const startServer = async () => {
  try {
    // await database.sequelize.authenticate();
    // await database.sequelize.sync({ force: false }); 
    // await db.sequelize.sync(); 

    // console.log('Connection has been established successfully.');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();