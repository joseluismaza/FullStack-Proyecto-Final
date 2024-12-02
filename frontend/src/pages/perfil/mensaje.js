import "./mensaje.css";

export const createMessageContainer = () => {
  const container = document.createElement("div");
  container.id = "mensaje-container";
  container.style.display = "none";

  const mostrarMensaje = (mensaje, tipo) => {
    container.textContent = mensaje;
    container.style.display = "block";
    container.className = `mensaje-container ${tipo}`;
    setTimeout(() => {
      container.style.display = "none";
    }, 3000);
  };

  return { container, mostrarMensaje };
};

export const createConfirmationModal = (mensaje, onConfirm) => {
  const modalContainer = document.createElement("div");
  modalContainer.classList.add("delete-container");

  const modalContent = document.createElement("div");
  modalContent.classList.add("delete-modal-content");

  const modalText = document.createElement("p");
  modalText.textContent = mensaje;
  modalText.classList.add("confirm-text");

  const buttonsContainer = document.createElement("div");
  buttonsContainer.classList.add("buttons-container");

  const confirmarButton = document.createElement("button");
  confirmarButton.textContent = "Confirmar";
  confirmarButton.classList.add("confirmar-button");

  const cancelarButton = document.createElement("button");
  cancelarButton.textContent = "Cancelar";
  cancelarButton.classList.add("cancelar-button");

  buttonsContainer.append(confirmarButton, cancelarButton);
  modalContent.append(modalText, buttonsContainer);
  modalContainer.append(modalContent);

  cancelarButton.onclick = () => modalContainer.remove();
  confirmarButton.onclick = () => {
    onConfirm();
    modalContainer.remove();
  };

  return modalContainer;
};