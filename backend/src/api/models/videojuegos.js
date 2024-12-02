//Modelo de Videojuegos

const mongoose = require('mongoose');

const videojuegoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  imagen: { type: String, required: true },
  precio: { type: Number, required: true },
  categoria: { type: String, required: true, enum: ['accion', 'aventura', 'deportes', 'estrategia', 'simulacion', 'terror', 'shooter'] },
  valoracion: { type: Number, required: true },
}, {
  timestamps: true,
  collection: "videojuegos"
});

const Videojuegos = mongoose.model("videojuego", videojuegoSchema, "videojuegos");

module.exports = Videojuegos;
