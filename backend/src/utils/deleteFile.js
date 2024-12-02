//Función para eliminar un archivo
const cloudinary = require('cloudinary').v2;

const deleteFile = async (filePath) => {
  const imgSplited = filePath.split('/'); //Separar la ruta por '/'
  const folderName = imgSplited.at(-2); //.at recorre el array desde el final
  const fileName = imgSplited.at(-1).split('.')[0]; //Separar el nombre del archivo por '.' y obtener el nombre

  cloudinary.uploader.destroy(`${folderName}/${fileName}`, () => {
    console.log("Archivo eliminado de Cloudinary");
  });
};

module.exports = { deleteFile };
