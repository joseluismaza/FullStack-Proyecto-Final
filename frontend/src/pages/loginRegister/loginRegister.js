import { Header } from '../../components/header/header';
import { Home } from '../home/home';
import './loginRegister.css'

export const LoginRegister = () => {
  const main = document.querySelector('main');
  main.innerHTML = "";

  const containerDiv = document.createElement('div');
  containerDiv.id = "auth-container";

  //Contenedor para los formularios
  const formsDiv = document.createElement('div');
  formsDiv.id = "forms-container";
  containerDiv.append(formsDiv);

  //Botones para cambiar entre login y registro
  const buttonContainer = document.createElement('div');
  buttonContainer.className = "auth-buttons";

  //Botones para cambiar entre login y registro
  const loginButton = document.createElement('button');
  loginButton.textContent = "Iniciar Sesión";
  loginButton.classList.add("auth-button-login");
  const registerButton = document.createElement('button');
  registerButton.textContent = "Registrarse";
  registerButton.classList.add("auth-button-register");
  buttonContainer.append(loginButton, registerButton);
  containerDiv.append(buttonContainer);


  //Mostrar login por defecto
  Login(formsDiv);

  //Event listeners para cambiar entre formularios
  loginButton.addEventListener('click', () => {
    formsDiv.innerHTML = "";
    Login(formsDiv);
    loginButton.style.display = "none";
    registerButton.style.display = "block";
  });

  registerButton.addEventListener('click', () => {
    formsDiv.innerHTML = "";
    Register(formsDiv);
    loginButton.style.display = "block";
    registerButton.style.display = "none";
  });

  loginButton.style.display = "none";
  registerButton.style.display = "block";

  main.append(containerDiv);
};

const Register = (elementoPadre) => {
  const form = document.createElement('form');
  form.classList.add("auth-form");

  const inputNombre = document.createElement('input');
  const inputApellido = document.createElement('input');
  const inputEmail = document.createElement('input');
  const inputUsername = document.createElement('input');
  const inputPassword = document.createElement('input');
  const button = document.createElement('button');

  inputNombre.placeholder = "Nombre";
  inputApellido.placeholder = "Apellido";
  inputEmail.placeholder = "Email";
  inputUsername.placeholder = "Nombre de usuario";
  inputPassword.placeholder = "********";
  inputPassword.type = "password";
  button.textContent = "Registrar";
  button.classList.add("auth-button");

  elementoPadre.append(form);
  form.append(inputNombre, inputApellido, inputEmail, inputUsername, inputPassword, button);

  //Event listener para enviar el formulario
  form.addEventListener('submit', (e) => {
    //Prevenir el envío del formulario por defecto
    e.preventDefault();

    //Validar que los campos no estén vacíos
    if (!inputNombre.value ||
      !inputApellido.value ||
      !inputEmail.value ||
      !inputUsername.value ||
      !inputPassword.value) {
      const pError = document.createElement('p');
      pError.classList.add('error');
      pError.textContent = "Todos los campos son obligatorios";

      //Eliminar mensaje de error si ya existe
      const errorExistente = form.querySelector('.error');
      if (errorExistente) errorExistente.remove();

      form.append(pError);
      return;
    }
    submitRegister(
      inputNombre.value,
      inputApellido.value,
      inputEmail.value,
      inputUsername.value,
      inputPassword.value,
      form);
  });
}

const submitRegister = async (nombre, apellido, email, userName, password, form) => {
  //este fetch necesita más información
  //necesita ser capaza de enviarle a esa ruta el metodo POST, JSON con username, password, nombre, apellido, email
  //e indicarle a la petición que tipo de contenido se esta utilizando mediante el header

  const objetoFinal = JSON.stringify({
    nombre,
    apellido,
    email,
    userName,
    password
  });

  const opciones = {
    method: "POST",
    body: objetoFinal,
    headers: {
      "Content-Type": "application/json"
    }
  };
  try {
    const res = await fetch("http://localhost:3000/api/v1/users/register", opciones);
    if (!res.ok) {
      const pError = document.createElement('p');
      pError.classList.add('error');
      pError.textContent = "Error al registrar el usuario";
      form.append(pError);
      return;
    }

    const respuestaFinal = await res.json();
    console.log('Respuesta del registro:', respuestaFinal);

    // Ajustamos la validación para la estructura actual de la respuesta
    if (respuestaFinal) {
      // Ahora hacemos el login automático
      await submitLogin(userName, password, form);
    } else {
      throw new Error('Respuesta del servidor incompleta');
    }
  } catch (error) {
    console.error("Error completo:", error);
    const pError = document.createElement('p');
    pError.classList.add('error');
    pError.textContent = "Error de conexión";
    form.append(pError);
  }
};

const Login = (elementoPadre) => {
  const form = document.createElement('form');
  form.classList.add("auth-form");

  const inputUsername = document.createElement('input');
  const inputPassword = document.createElement('input');
  const button = document.createElement('button');

  inputUsername.placeholder = "Nombre de usuario";
  inputPassword.placeholder = "********";
  inputPassword.type = "password";
  button.textContent = "Iniciar sesión";
  button.classList.add("auth-button");

  elementoPadre.append(form);
  form.append(inputUsername, inputPassword, button);

  //Event listener para enviar el formulario
  form.addEventListener('submit', (e) => {
    //Prevenir el envío del formulario por defecto
    e.preventDefault();

    //Validar que los campos no estén vacíos
    if (!inputUsername.value || !inputPassword.value) {
      const pError = document.createElement('p');
      pError.classList.add('error');
      pError.textContent = "Complete todos los campos";

      //Eliminar mensaje de error si ya existe
      const errorExistente = form.querySelector('.error');
      if (errorExistente) errorExistente.remove();

      form.append(pError);
      return;
    }

    submitLogin(inputUsername.value, inputPassword.value, form);
  });
};

const submitLogin = async (userName, password, form) => {
  const objetoFinal = JSON.stringify({
    userName,
    password
  });

  const opciones = {
    method: "POST",
    body: objetoFinal,
    headers: {
      "Content-Type": "application/json"
    }
  };

  try {
    const res = await fetch("http://localhost:3000/api/v1/users/login", opciones);

    //Eliminar mensaje de error si ya existe
    const errorExistente = form.querySelector('.error');
    if (errorExistente) errorExistente.remove();

    //Manejar diferentes errores
    if (!res.ok) {
      const pError = document.createElement('p');
      pError.classList.add('error');

      if (res.status === 400) {
        pError.textContent = "Usuario o contraseña incorrectos";
      } else if (res.status === 404) {
        pError.textContent = "Usuario no encontrado";
      } else {
        pError.textContent = "Error al iniciar sesión";
      }
      form.append(pError);
      return;
    }

    const respuestaFinal = await res.json();
    console.log(respuestaFinal);

    localStorage.setItem("token", respuestaFinal.token);
    localStorage.setItem("user", JSON.stringify(respuestaFinal.userExist));
    Home();
    Header();

  } catch (error) {
    console.error("Error al iniciar sesión", error);
    const pError = document.createElement('p');
    pError.classList.add('error');
    pError.textContent = "Error de conexión. Por favor, inténtelo de nuevo.";
    form.append(pError);
  }
};
