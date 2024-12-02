export const createProfileForm = (userObject, mostrarMensaje, handleSubmit) => {
  const editForm = document.createElement("form");
  editForm.id = "edit-form";

  const fields = [
    { label: "Nombre", name: "nombre", value: userObject.nombre, required: true },
    { label: "Apellido", name: "apellido", value: userObject.apellido, required: true },
    { label: "Email", name: "email", value: userObject.email, required: true },
    { label: "Username", name: "userName", value: userObject.userName, required: true },
    { label: "Nueva Contraseña", name: "password", type: "password" },
    { label: "Confirmar Contraseña", name: "confirmPassword", type: "password" },
  ];

  fields.forEach(field => {
    const fieldsDiv = document.createElement("div");
    fieldsDiv.classList.add("form-field");

    const fieldslabel = document.createElement("label");
    fieldslabel.textContent = field.label;

    const fieldsInput = document.createElement("input");
    fieldsInput.name = field.name;
    fieldsInput.type = field.type || "text";
    fieldsInput.value = field.value || "";
    if (field.required) {
      fieldsInput.required = true;
      fieldsInput.addEventListener('invalid', () => {
        mostrarMensaje(`El campo ${field.label} es requerido`, "error");
      });
    }

    fieldsDiv.append(fieldslabel, fieldsInput);
    editForm.append(fieldsDiv);
  });

  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.textContent = "Guardar cambios";
  editForm.append(submitButton);

  editForm.addEventListener("submit", handleSubmit);

  return editForm;
};