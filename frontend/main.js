import { Header } from './src/components/header/header';
import { Home } from './src/pages/home/home';
import { LoginRegister } from './src/pages/loginRegister/loginRegister';
import { Perfil } from './src/pages/perfil/perfil';
import './style.css'

const Main = () => {
  const app = document.querySelector('#app')
  app.innerHTML = `
    <header></header>
    <main></main>
  `
}

const router = () => {
  const path = window.location.hash || '#/';

  // Siempre mostramos el header
  Header();

  switch (path) {
    case '#/':
      Home();
      break;
    case '#/login':
    case '#/register':
      LoginRegister();
      break;
    case '#/perfil':
      const userData = localStorage.getItem("user");
      const userObject = userData && userData !== "undefined" ? JSON.parse(userData) : null;

      if (!userObject) {
        window.location.hash = '#/login';
        return;
      }
      Perfil();
      break;
    default:
      Home();
  }
}

// Inicialización
Main();
router();

// Escuchar cambios en la ruta
window.addEventListener('hashchange', router);

