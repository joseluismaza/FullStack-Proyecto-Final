//Rutas de Videojuegos
const { publishGame, getAllGames, getGameById, getGamesByCategory, getGamesByPrice, updateGame, deleteGame } = require('../controllers/videojuegos');
const { isAuth } = require('../../middlewares/auth');
const upload = require('../../middlewares/image');
const videojuegosRoutes = require('express').Router();


videojuegosRoutes.post('/', [isAuth], upload.single('imagen'), publishGame);
videojuegosRoutes.get('/', getAllGames);
videojuegosRoutes.get('/:id', getGameById);
videojuegosRoutes.get('/categoria/:categoria', getGamesByCategory);
videojuegosRoutes.get('/precio/:precio', getGamesByPrice);
videojuegosRoutes.put('/:id', [isAuth], updateGame);
videojuegosRoutes.delete('/:id', [isAuth], deleteGame);

module.exports = videojuegosRoutes;
