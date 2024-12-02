import { pintarJuegos } from '../home/home';
import './favoritos.css';

export const Favoritos = async () => {
  const main = document.querySelector('main');
  main.innerHTML = "";

  const user = JSON.parse(localStorage.getItem("user"));

  const res = await fetch(`http://localhost:3000/api/v1/users/${user._id}`);
  const usuario = await res.json();

  //Verificar si el usuario tiene favoritos
  if (!usuario.favoritos || usuario.favoritos.length === 0) {
    main.innerHTML = "<h2>Todavía no tienes favoritos</h2>";
    return;
  };

  main.innerHTML = "<h2>Estos son tus juegos favoritos</h2>"
  //Obtener los datos completos de los juegos
  const juegosPromises = usuario.favoritos.map(juego => fetch(`http://localhost:3000/api/v1/videojuegos/${juego._id}`).then(
    res => res.json()
  ));

  const juegosCompletos = await Promise.all(juegosPromises);
  console.log(juegosCompletos);

  pintarJuegos(juegosCompletos, main);
}
