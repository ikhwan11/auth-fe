const API_BASE_URL = "http://localhost:8060";

async function checkEmployee(employeeNo) {
  const response = await fetch(`${API_BASE_URL}/auth/check-employee`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      employee_no: employeeNo,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to check employee");
  }

  return data;
}

/* LOGIN */

async function login(employeeNo, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ employee_no: employeeNo, password: password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
}

async function getEmployee(employeeNo) {
  return checkEmployee(employeeNo);
}

function getAccessToken() {
  return localStorage.getItem("access_token");
}

function decodeToken(token) {
  const payload = token.split(".")[1];

  return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
}

function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}
