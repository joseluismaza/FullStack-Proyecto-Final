const express = require("express");
const app = express();
const cors = require('cors');
const connectDB = require('./src/config/db');
const videojuegosRoutes = require('./src/api/routes/videojuegos');
require('dotenv').config();
const usersRoutes = require('./src/api/routes/users');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

app.use(cors());
app.use(express.json());
connectDB();

app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/videojuegos', videojuegosRoutes);

app.use("*", (req, res, next) => {
  return res.status(404).json("Ruta no encontrada")
});


app.listen(3000, () => {
  console.log("Servidor levantado: http://localhost:3000");
});