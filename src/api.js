
// const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

console.log("ENV:", import.meta.env.VITE_API_URL);
console.log("BASE_URL:", BASE_URL);

// const BASE_URL = import.meta.env.VITE_API_URL ?? "https://backend-seat-booking.onrender.com/";
// or deployed URL later

export async function apiRequest(endpoint, method = "GET", data) {
  const token = localStorage.getItem("token"); // ***JWT stored after login

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "API error");
  }

  return response.json();
}
