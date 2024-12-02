import "./avatar.css";

export const createAvatarSection = (userObject, editForm, mostrarMensaje) => {
  const avatarContainer = document.createElement("div");
  avatarContainer.classList.add("avatar-container");

  const avatar = document.createElement("img");
  avatar.src = userObject.avatar || "/assets/usuario.png";
  avatar.classList.add("avatar");

  const avatarInput = document.createElement("input");
  avatarInput.type = "file";
  avatarInput.accept = "image/*";
  avatarInput.id = "avatar-input";
  avatarInput.style.display = "none";

  const avatarLabel = document.createElement("label");
  avatarLabel.textContent = "Cambiar avatar";
  avatarLabel.htmlFor = "avatar-input";
  avatarLabel.classList.add("avatar-label");

  avatarInput.addEventListener("change", async (e) => {
    try {
      const compressedBase64 = await processImage(e.target.files[0]);
      avatar.src = compressedBase64;

      const avatarField = document.createElement("input");
      avatarField.type = "hidden";
      avatarField.name = "avatar";
      avatarField.value = compressedBase64;
      editForm.append(avatarField);
    } catch (error) {
      mostrarMensaje(error.message, "error");
    }
  });

  avatarContainer.append(avatar, avatarInput, avatarLabel);
  return avatarContainer;
};

export const processImage = (file, maxWidth = 400) => {
  return new Promise((resolve, reject) => {
    if (file.size > 1024 * 1024) {
      reject(new Error("El archivo es demasiado grande. La imagen debe ser menor de 1MB."));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (maxWidth * height) / width;
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
        resolve(compressedBase64);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};