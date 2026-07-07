export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw new Error(
      "No se pudo conectar con el servidor. Verifica que la API este corriendo."
    );
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.detail ?? `Error ${response.status} del servidor`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function getProducts() {
  return request("/api/products");
}

export function createProduct(product) {
  return request("/api/products", {
    method: "POST",
    body: JSON.stringify(product),
  });
}

export function updateProduct(productId, product) {
  return request(`/api/products/${productId}`, {
    method: "PUT",
    body: JSON.stringify(product),
  });
}

export function updatePrice(productId, currentPrice) {
  return request(`/api/products/${productId}/price`, {
    method: "PATCH",
    body: JSON.stringify({ currentPrice }),
  });
}

export function deleteProduct(productId) {
  return request(`/api/products/${productId}`, { method: "DELETE" });
}

export function getHistory(productId) {
  return request(`/api/products/${productId}/history`);
}

export function sendAlertsReport() {
  return request("/api/alerts/send", {
    method: "POST",
  });
}
