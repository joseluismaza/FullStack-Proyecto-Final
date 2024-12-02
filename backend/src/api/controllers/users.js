//Controlador de Usuarios
const { generateToken } = require('../../config/jwt');
const { buscarUsuario } = require('../../utils/buscarUsuario');
const Users = require('../models/users');
const bcrypt = require('bcrypt');

//Registrar un usuario
const registerUser = async (req, res) => {
  try {
    //Validar campos requeridos
    if (!req.body.email || !req.body.userName || !req.body.password) {
      return res.status(400).json({
        message: "Campos obligatorios",
        required: {
          email: !req.body.email ? "Falta correo electronico" : null,
          userName: !req.body.username ? "Falta nombre de usuario" : null,
          password: !req.body.password ? "Falta contraseña" : null
        }
      })
    };

    //Crear un nuevo usuario Campos requeridos
    const newUser = new Users({
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      rol: "user"
    });
    console.log("Usuario a registrar", newUser);
    //Evitar usuarios duplicados
    const userDuplicated = await buscarUsuario(newUser.email);
    if (userDuplicated) {
      return res.status(400).json({ message: "El usuario ya existe" });
    };

    //Guardar el nuevo usuario en la base de datos
    const userSaved = await newUser.save();
    res.status(201).json(userSaved);
  } catch (error) {
    res.status(404).json("Registro incorrecto");
  }
};

//Login de usuario
const loginUser = async (req, res) => {
  try {
    const { email, userName, password } = req.body;
    const userExist = await buscarUsuario(email, userName);

    if (!userExist) {
      return res.status(404).json("El usuario no existe");
    }
    if (bcrypt.compareSync(password, userExist.password)) {
      //Generar token
      const token = generateToken(userExist._id);
      res.status(200).json({ userExist, token });
    } else {
      res.status(404).json("Contraseña incorrecta");
    }
  } catch (error) {
    res.status(404).json("Login incorrecto");
  }
};

//Obtener todos los usuarios
const getAllUsers = async (req, res) => {
  try {
    const users = await Users.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(404).json("Error al obtener los usuarios");
  }
};

//Obtener un usuario por su ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findById(id).populate("favoritos");
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json("Error al obtener el usuario");
  }
};

//Actualizar un usuario
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    //Verificar si el usuario autenticado es el mismo que el usuario que se quiere actualizar
    if (req.user.id !== id) {
      return res.status(401).json("No puedes actualizar este usuario");
    }

    // Actualizar userName
    if (req.body.userName) {
      const existingUserName = await Users.findOne({ userName: req.body.userName });
      if (existingUserName && existingUserName._id.toString() !== id) {
        return res.status(400).json("El nombre de usuario ya está en uso");
      }
    }

    // Actualizar contraseña
    if (req.body.password) {
      const salt = bcrypt.genSaltSync(10);
      req.body.password = bcrypt.hashSync(req.body.password, salt);
    }

    // Actualizar avatar
    if (req.file) {
      req.body.avatar = req.file.path;
    }

    //Actualizar datos personales
    if (req.body.nombre || req.body.apellido) {
      const usuario = await Users.findById(id);
      req.body.nombre = req.body.nombre || usuario.nombre;
      req.body.apellido = req.body.apellido || usuario.apellido;
    };

    // Manejo especial de favoritos
    if (req.body.favoritos && Array.isArray(req.body.favoritos)) {
      const userWithFavorites = await Users.findById(id).populate("favoritos");
      if (!userWithFavorites) {
        return res.status(404).json("Usuario no encontrado");
      }

      if (req.body.action === "remove") {
        // Convertir IDs a eliminar a strings
        const favoritosToRemove = req.body.favoritos.map(fav =>
          typeof fav === 'object' ? fav._id.toString() : fav.toString()
        );

        // Filtrar los favoritos actuales, manteniendo solo los que no están en favoritosToRemove
        const currentFavoritos = userWithFavorites.favoritos
          .map(fav => fav._id.toString())
          .filter(favId => !favoritosToRemove.includes(favId));

        req.body.favoritos = currentFavoritos;
      } else {
        // Comportamiento existente para agregar favoritos
        const newFavoritos = req.body.favoritos.map(fav =>
          typeof fav === 'object' ? fav._id.toString() : fav.toString()
        );
        const currentFavoritos = userWithFavorites.favoritos.map(fav => fav._id.toString());
        const uniqueFavoritos = [...new Set([...currentFavoritos, ...newFavoritos])];
        req.body.favoritos = uniqueFavoritos;
      }

      console.log("Favoritos actualizados", req.body.favoritos);
    }

    //Actualizar el usuario con los campos modificados
    const updatedUser = await Users.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    ).populate("favoritos");

    //Verificar si el usuario fue actualizado
    if (!updatedUser) {
      return res.status(404).json("Usuario no encontrado");
    }
    console.log("Usuario actualizado");
    res.status(200).json(updatedUser);

  } catch (error) {
    console.log("Error al actualizar el usuario", error);
    res.status(500).json({
      mensaje: "Error al actualizar el usuario",
      error: error.message
    });
  }
};

//Eliminar usuario
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Permitir que los usuarios eliminen su propia cuenta o que un admin elimine cualquier cuenta
    if (req.user.id !== id && req.user.rol !== "admin") {
      return res.status(401).json({
        message: "No tienes permisos para eliminar este usuario"
      });
    }

    const userDeleted = await Users.findByIdAndDelete(id);

    if (!userDeleted) {
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }

    res.status(200).json({
      message: "Usuario eliminado correctamente",
      userDeleted
    });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({
      message: "Error al eliminar el usuario",
      error: error.message
    });
  }
};

module.exports = { registerUser, loginUser, getAllUsers, getUserById, updateUser, deleteUser };
