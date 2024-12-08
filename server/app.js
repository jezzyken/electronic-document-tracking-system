const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const compression = require('compression');
const cors = require('cors');
const path = require('path'); 
const connectDB = require('./config/db');
const serverRoutes = require('./config/defaultServerRoutes');


dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

serverRoutes(app);

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

global.__basedir = __dirname;

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});