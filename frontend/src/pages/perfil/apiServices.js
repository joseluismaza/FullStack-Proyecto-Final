const API_URL = "http://localhost:3000/api/v1";

export const updateUser = async (userId, userData) => {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al actualizar los datos");
  }

  return response.json();
};

export const deleteUser = async (userId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No hay sesión activa");
  }

  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId })
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type");
    let errorMessage = "Error al eliminar la cuenta";

    if (contentType?.includes("application/json")) {
      const data = await response.json();
      errorMessage = data.message || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response;
};