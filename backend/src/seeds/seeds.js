const mongoose = require("mongoose");
const Videojuegos = require("../api/models/videojuegos");
const { juegosData } = require("../data/data");
require("dotenv").config();

mongoose.connect(process.env.DB_URL).then(async () => {
  const allJuegos = await Videojuegos.find();

  if (allJuegos.length) {
    await Videojuegos.collection.drop();
  }
})
  .catch((error) => console.log(`Error eliminando información: ${error}`)).then(async () => {
    await Videojuegos.insertMany(juegosData);
  })
  .catch((error) => console.log(`Errror creando información: ${error}`)).finally(() => mongoose.disconnect());





//const mongoose = require("mongoose");
//const Comic = require("../api/models/comics");
//const Libreria = require("../api/models/librerias");
//const { comicsData, libreriasData } = require("../data/data");
//require("dotenv").config();

//mongoose.connect(process.env.DB_URL).then(async () => {
//const allComics = await Comic.find();
//const allLibrerias = await Libreria.find();

//if (allComics.length, allLibrerias.length) {
//await Comic.collection.drop();
//await Libreria.collection.drop();
///}
//})
//.catch((error) => console.log(`Error eliminando información: ${error}`)).then(async () => {
// await Comic.insertMany(comicsData);
//await Libreria.insertMany(libreriasData);
//})
// .catch((error) => console.log(`Error creando inforamción: ${error}`)).finally(() => mongoose.disconnect());