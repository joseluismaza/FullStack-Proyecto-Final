import { createAvatarSection } from './avatar';
import { createMessageContainer, createConfirmationModal } from './mensaje';
import { updateUser, deleteUser } from './apiServices';
import { createProfileForm } from './formPerfil';


import "./perfil.css";

export const Perfil = () => {
  const main = document.querySelector('main');
  main.innerHTML = "";

  const userObject = JSON.parse(localStorage.getItem("user") || "null");
  if (!userObject) return;

  const perfilContainer = document.createElement('div');
  perfilContainer.id = "perfil-container";

  perfilContainer.innerHTML = `<h1 class="perfil-title">Bienvenido, ${userObject.userName}</h1>`;

  // Crear componentes
  const { container: mensajeContainer, mostrarMensaje } = createMessageContainer();
  const editForm = createProfileForm(userObject, mostrarMensaje, async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedData = Object.fromEntries(formData);

    if (updatedData.password !== updatedData.confirmPassword) {
      mostrarMensaje("Las contraseñas no coinciden", "error");
      return;
    }

    if (!updatedData.password) {
      delete updatedData.password;
      delete updatedData.confirmPassword;
    }

    try {
      const updatedUserData = await updateUser(userObject._id, {
        id: userObject._id,
        ...updatedData
      });

      const newUserData = {
        ...userObject,
        ...updatedUserData,
      };
      localStorage.setItem("user", JSON.stringify(newUserData));

      mostrarMensaje("Datos actualizados correctamente", "success");
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      mostrarMensaje(error.message, "error");
      console.error("Error detallado:", error);
    }
  });

  const avatarSection = createAvatarSection(userObject, editForm, mostrarMensaje);

  // Agregar botón de eliminar cuenta
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Eliminar cuenta";
  deleteButton.type = "button";
  deleteButton.classList.add("delete-button");

  deleteButton.addEventListener("click", async (e) => {
    e.preventDefault();

    const confirmacionDelete = createConfirmationModal(
      "¿Estás seguro de querer eliminar tu cuenta? Esta acción es irreversible.",
      async () => {
        try {
          await deleteUser(userObject._id);
          localStorage.clear();
          mostrarMensaje("Cuenta eliminada correctamente", "success");
          setTimeout(() => window.location.reload(), 3000);
        } catch (error) {
          mostrarMensaje(error.message, "error");
        }
      }
    );
    document.body.append(confirmacionDelete);
  });


  editForm.append(deleteButton);

  // Montar componentes
  perfilContainer.append(avatarSection, mensajeContainer, editForm);
  main.append(perfilContainer);
};