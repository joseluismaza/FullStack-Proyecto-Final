//Rutas de Usuarios
const { registerUser, loginUser, getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/users');
const { isAuth, isAdmin } = require('../../middlewares/auth');
const usersRoutes = require('express').Router();

usersRoutes.post('/register', registerUser);
usersRoutes.post('/login', loginUser);
usersRoutes.get('/', getAllUsers);
usersRoutes.get('/:id', getUserById);
usersRoutes.put('/:id', [isAuth], updateUser);
usersRoutes.delete('/:id', [isAuth], deleteUser);

module.exports = usersRoutes;
