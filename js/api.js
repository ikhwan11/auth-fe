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
