//Controlador de Videojuegos
const Videojuegos = require('../models/videojuegos');
const { deleteFile } = require('../../utils/deleteFile');

//Publicar un videojuego
const publishGame = async (req, res) => {
  try {
    //Verficiar el usaurio
    if (!req.user) {
      return res.status(401).json("Usuario no autenticado");
    }

    //Crear un nuevo videojuego
    const newGame = new Videojuegos(req.body);

    //Ruta de la imagen
    if (req.file) {
      newGame.imagen = req.file.path;
    }

    //Verificar si el usuario es admin
    newGame.verified = req.user.rol === "admin";

    //Guardar el videojuego en la base de datos
    const savedGame = await newGame.save();
    return res.status(201).json(savedGame);
  } catch (error) {
    console.log('Error al publicar el videojuego', error);
    return res.status(500).json({ error: "Error al publicar el videojuego", details: error.message });
  }
};

//Obtener todos los videojuegos
const getAllGames = async (req, res) => {
  try {
    const games = await Videojuegos.find();
    return res.status(200).json(games);
  } catch (error) {
    return res.status(500).json(error);
  }
};

//Obtener un videojuego por su ID
const getGameById = async (req, res) => {
  try {
    const { id } = req.params;
    const game = await Videojuegos.findById(id);
    return res.status(200).json(game);
  } catch (error) {
    return res.status(500).json("Error en la solicitud");
  }
};

//Obtener videjuegos por categoria
const getGamesByCategory = async (req, res) => {
  try {
    const { categoria } = req.params;
    const games = await Videojuegos.find({ categoria });
    return res.status(200).json(games);
  } catch (error) {
    return res.status(500).json("Error en la solicitud");
  }
};

//Obtener videojuegos por precio
const getGamesByPrice = async (req, res) => {
  try {
    const { precio } = req.params;
    const games = await Videojuegos.find({ precio: { $lte: precio } }); //lte = less then equal, menor o igual
    return res.status(200).json(games);
  } catch (error) {
    return res.status(500).json("Error en la solicitud");
  }
};

//Actualizar un videojuego
const updateGame = async (req, res) => {
  try {
    const { id } = req.params;
    const newGame = new Videojuegos(req.body);
    newGame._id = id;

    //Ruta de la imagen
    if (req.file) {
      newGame.imagen = req.file.path;
      const oldGame = await Videojuegos.findById(id);
      deleteFile(oldGame.imagen);//Eliminar la imagen anterior
    }
    //Actualizar el videojuego
    const updateGame = await Videojuegos.findByIdAndUpdate(id, newGame, { new: true });
    return res.status(200).json(updateGame);
  } catch (error) {
    return res.status(500).json("Error en la solicitud");
  }
};

//Eliminar un videojuego
const deleteGame = async (req, res) => {
  try {
    const { id } = req.params;
    const gameDeleted = await Videojuegos.findByIdAndDelete(id);
    deleteFile(gameDeleted.imagen); //Eliminar la imagen de cloudinary

    return res.status(200).json(gameDeleted);
  } catch (error) {
    return res.status(500).json("Error en la solicitud");
  }
};

module.exports = { publishGame, getAllGames, getGameById, getGamesByCategory, getGamesByPrice, updateGame, deleteGame };
