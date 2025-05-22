import express from 'express';
import dotenv, { configDotenv } from 'dotenv';
import cors from 'cors';
import bookRoutes from './routes/books.js';
import pgclient from './db.js';
import morgan from 'morgan';


const server = express();
dotenv.config();
server.use(cors());
server.use(morgan('dev'));
server.use(express.json());

const PORT = process.env.PORT || 5000;

server.use('/api/books', bookRoutes);

// Add this after your routes
server.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

pgclient.connect()
    .then(() => {
        console.log('Connected to PostgreSQL database');
        server.listen(PORT, () => {
            console.log(`Listening on PORT ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Failed to connect to PostgreSQL', err);
        process.exit(1);
    });


export default server;