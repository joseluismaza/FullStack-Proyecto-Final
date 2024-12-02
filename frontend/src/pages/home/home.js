import './home.css';

export const Home = async () => {
  const main = document.querySelector('main');

  try {
    const res = await fetch("http://localhost:3000/api/v1/videojuegos");
    if (!res.ok) {
      throw new Error("Error al obtener los videojuegos");
    }

    //Vaciar el main
    main.innerHTML = "";

    const juegos = await res.json();

    //Verificar que los juegos sean un array válido
    if (Array.isArray(juegos)) {
      pintarJuegos(juegos, main);
    } else {
      main.innerHTML = "<h2>No se encontraron videojuegos</h2>";
    }
  } catch (error) {
    console.error("Error al obtener los videojuegos", error);
    main.innerHTML = "<h2>Error de conexión</h2>";
  }
};

export const pintarJuegos = (juegos, elementoPadre) => {
  const divJuegos = document.createElement('div');
  divJuegos.className = "juegos";

  for (const juego of juegos) {
    const divJuego = document.createElement('div');
    const titulo = document.createElement('h2');
    titulo.className = "titulo";
    const imagen = document.createElement('img')
    imagen.className = "caratula";
    const info = document.createElement('div');

    const favIcon = document.createElement('img');
    favIcon.className = "fav";

    // Modificar esta parte para manejar mejor el localStorage
    const userString = localStorage.getItem("user");
    const user = userString && userString !== "undefined"
      ? JSON.parse(userString)
      : { favoritos: [] };

    if (Array.isArray(user.favoritos) && user.favoritos.includes(juego._id)) {
      favIcon.src = "/assets/me-gusta_relleno.png";
    } else {
      favIcon.src = "/assets/me-gusta.png";
    }

    favIcon.addEventListener('click', async () => {
      //Comprobar si el usuario está logueado
      const userString = localStorage.getItem("user");
      if (!userString) {
        alert("Debes estar logueado para añadir a favoritos");
        return;
      }
      const user = JSON.parse(userString);

      const isFavorito = user.favoritos.includes(juego._id);
      let resultado;

      if (isFavorito) {
        resultado = await removeFavorito(juego._id);
        if (resultado) {
          favIcon.src = "/assets/me-gusta.png";
        }
      } else {
        resultado = await addFavorito(juego._id);
        if (resultado) {
          favIcon.src = "/assets/me-gusta_relleno.png";
        }
      }
    });

    divJuego.className = "juego";
    titulo.textContent = juego.titulo;
    imagen.src = juego.imagen;
    imagen.alt = juego.titulo;
    info.innerHTML = `
    <p>Precio: ${juego.precio}€</p>
    <p>Categoría: ${juego.categoria}</p>
    `;

    divJuego.append(titulo, imagen, info, favIcon);
    divJuegos.append(divJuego);
  }
  elementoPadre.append(divJuegos);
};

const addFavorito = async (idJuego) => {
  //http://localhost:3000/api/v1/users/ID
  //metodo PUT
  //autorizacion (token)
  //id usuaio
  // añadir el juego a un array dentro de un objeto y pasarlo a JSONstringify
  const userId = JSON.parse(localStorage.getItem("user"));
  const userString = localStorage.getItem("user");
  if (!userString) return false;
  const user = JSON.parse(userString);
  const token = localStorage.getItem("token");

  if (user.favoritos.includes(idJuego)) {
    alert("El juego ya está en favoritos");
    return false;
  }

  try {
    const res = await fetch(`http://localhost:3000/api/v1/users/${user._id}`, {
      method: "PUT",
      body: JSON.stringify({ favoritos: [...user.favoritos, idJuego] }),
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    if (!res.ok) {
      throw new Error('Error al añadir el juego a favoritos');
    }
    const data = await res.json();
    // Actualizar el localStorage con los datos actualizados
    user.favoritos = [...user.favoritos, idJuego];
    localStorage.setItem("user", JSON.stringify(user));
    return true;
  } catch (error) {
    console.error('Error al añadir el juego a favoritos', error);
    return false;
  }
};

const removeFavorito = async (idJuego) => {
  const userString = localStorage.getItem("user");
  if (!userString) return false;
  const user = JSON.parse(userString);
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`http://localhost:3000/api/v1/users/${user._id}`, {
      method: "PUT",
      body: JSON.stringify({
        favoritos: [idJuego],
        action: "remove"
      }),
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) {
      throw new Error('Error al eliminar el juego de favoritos');
    }

    const data = await res.json();
    // Actualizar el localStorage con los datos actualizados
    user.favoritos = user.favoritos.filter(id => id !== idJuego);
    //refrescar la página
    window.location.reload();
    localStorage.setItem("user", JSON.stringify(user));
    return true;

  } catch (error) {
    console.error('Error al eliminar el juego de favoritos', error);
    return false;

  }
};



