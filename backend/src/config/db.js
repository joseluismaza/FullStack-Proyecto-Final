//Conexión a la base de datos

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Conexión a la base de datos exitosa");
  } catch (error) {
    console.log("Error al conectar a la base de datos", error);
  }
};

module.exports = connectDB;
