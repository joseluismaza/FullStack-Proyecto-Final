//Middleware de autenticación
const Users = require('../api/models/users');
const { verifyToken } = require("../config/jwt");

//Middleware para verificar si el usuario está autenticado
const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const parsedToken = token.replace("Bearer ", "");

    const { id } = verifyToken(parsedToken);
    const user = await Users.findById(id);

    user.password = null;
    req.user = user;
    next();

  } catch (error) {
    return res.status(401).json("No estas autorizado");
  }
};

module.exports = { isAuth };
