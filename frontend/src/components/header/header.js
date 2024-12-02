import { Home } from "../../pages/home/home";
import { Favoritos } from "../../pages/favoritos/favoritos";
import { LoginRegister } from "../../pages/loginRegister/loginRegister";
import "./header.css";
import { Perfil } from "../../pages/perfil/perfil";

const routes = [
  {
    texto: "Home",
    funcion: Home,
    path: "/home"
  },
  {
    texto: "Favoritos",
    funcion: Favoritos,
    path: "/favoritos"
  },
  {
    texto: "Login / Register",
    funcion: LoginRegister,
    path: "/alta_usuario"
  },
  {
    texto: "Perfil",
    funcion: Perfil,
    path: "/perfil"
  }
];

export const Header = () => {
  const header = document.querySelector("header");
  header.innerHTML = "";
  const nav = document.createElement("nav");

  for (const route of routes) {
    const a = document.createElement("a");
    a.href = route.path;

    //Login del usuario
    if (route.texto === "Login / Register" && localStorage.getItem("token") && localStorage.getItem("user")) {
      a.textContent = "Logout";
      a.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/home";
      });
    } else {
      //Favoritos
      if (route.texto === "Favoritos" && !localStorage.getItem("token")) {
      } else {
        a.textContent = route.texto;
        a.addEventListener("click", (e) => {
          e.preventDefault();
          route.funcion();
          history.pushState({}, '', route.path);
        });
      }
    }

    //Perfil del usuario
    if (route.texto === "Perfil") {
      const userStr = localStorage.getItem("user");
      if (localStorage.getItem("token") && userStr && userStr !== "undefined") {
        try {
          const user = JSON.parse(userStr);
          if (user) {
            const avatarImg = document.createElement("img");
            avatarImg.classList.add("avatar-icon");
            avatarImg.src = user.avatar || '/assets/usuario.png';
            avatarImg.alt = "Avatar del usuario";

            a.textContent = "";
            a.append(avatarImg);
            a.addEventListener("click", route.funcion);
            nav.append(a);
          }
        } catch (error) {
          console.error("Error al parsear usuario:", error);
        }
      }
      continue;
    }
    nav.append(a);
  }
  header.append(nav);

}



