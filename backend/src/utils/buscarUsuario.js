const Users = require('../api/models/users');

const buscarUsuario = async (email, userName) => {
  try {
    const usuario = await Users.findOne({
      $or: [
        { email },
        { userName }
      ]
    });
    return usuario;
  } catch (error) {
    console.error('Error al buscar usuario:', error);
    throw new Error('Error al buscar el usuario en la base de datos');
  }
}

module.exports = { buscarUsuario };