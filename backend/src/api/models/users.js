//Modelo de Usuarios
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
  nombre: { type: String, default: "" },
  apellido: { type: String, default: "" },
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: {
    type: String,
    required: true,
    enum: ['admin', 'user'],
    default: 'user'
  },
  favoritos: [{ type: mongoose.Schema.Types.ObjectId, ref: "videojuego" }],
  avatar: { type: String, default: "" },
}, {
  timestamps: true,
  collection: "usuarios"
});

//encriptar contraseña
userSchema.pre("save", function () {
  this.password = bcrypt.hashSync(this.password, 10);//número de saltos que se encripta la contraseña
})

const User = mongoose.model("users", userSchema, "users");
module.exports = User;