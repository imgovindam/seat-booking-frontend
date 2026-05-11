// const BASE_URL = "http://localhost:8000/api";
// // const BASE_URL = "https://seat-booking-system-backend.onrender.com/api";

// export async function apiRequest(endpoint, method = "GET", data) {
//   const options = {
//     method,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   };

//   if (data) {
//     options.body = JSON.stringify(data);
//   }

//   const response = await fetch(`${BASE_URL}${endpoint}`, options);

//   if (!response.ok) {
//     const error = await response.json();
//     throw new Error(error.message || "API error");
//   }

//   return response.json();
// }


const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";
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
