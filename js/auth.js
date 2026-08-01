const authForm = document.getElementById("auth-form");

const employeeNoInput = document.getElementById("employee-no");

const employeeInfo = document.getElementById("employee-info");
const employeeName = document.getElementById("employee-name");
const employeePosition = document.getElementById("employee-position");

const passwordSection = document.getElementById("password-section");
const confirmPasswordSection = document.getElementById(
  "confirm-password-section",
);

const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");

const authMessage = document.getElementById("auth-message");
const authButton = document.getElementById("auth-button");

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toast-message");

let debounceTimer = null;
let requestController = null;
let currentStatus = null;
let toastTimer = null;

// TOAST

function showToast(message, type) {
  clearTimeout(toastTimer);

  toast.classList.remove("success", "warning", "error");

  toastMessage.textContent = message;

  toast.classList.add(type);
  toast.classList.add("show");

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// RESET UI

function resetAuthUI() {
  currentStatus = null;

  employeeInfo.classList.add("hidden");

  passwordSection.classList.add("hidden");
  confirmPasswordSection.classList.add("hidden");

  authButton.classList.add("hidden");

  employeeName.textContent = "";
  employeePosition.textContent = "";

  passwordInput.value = "";
  confirmPasswordInput.value = "";

  passwordInput.required = false;
  confirmPasswordInput.required = false;

  authMessage.textContent = "";
}

// LOADING

function showLoading() {
  authMessage.textContent = "Checking employee...";
  authMessage.classList.remove("error");
  authMessage.classList.add("loading");
}

// CHECK EMPLOYEE

async function handleEmployeeCheck() {
  const employeeNo = employeeNoInput.value.trim();

  // EMPTY

  if (!employeeNo) {
    resetAuthUI();
    return;
  }

  // CANCEL PREVIOUS REQUEST

  if (requestController) {
    requestController.abort();
  }

  requestController = new AbortController();

  showLoading();

  try {
    const response = await checkEmployee(employeeNo);

    if (employeeNo !== employeeNoInput.value.trim()) {
      return;
    }

    const data = response.data;

    currentStatus = data.status;

    // EMPLOYEE FOUND

    if (data.employee) {
      employeeName.textContent = data.employee.name;
      employeePosition.textContent = data.employee.position;

      employeeInfo.classList.remove("hidden");
    }

    // LOGIN
    // Employee TRUE
    // User TRUE

    if (data.status === "LOGIN") {
      passwordSection.classList.remove("hidden");

      confirmPasswordSection.classList.add("hidden");

      passwordInput.required = true;
      confirmPasswordInput.required = false;

      authButton.textContent = "LOGIN";
      authButton.classList.remove("hidden");

      authMessage.textContent = "";

      showToast("Employee and User found, please login", "success");

      passwordInput.focus();

      return;
    }

    // REGISTER
    // Employee TRUE
    // User FALSE

    if (data.status === "REGISTER") {
      passwordSection.classList.remove("hidden");

      confirmPasswordSection.classList.remove("hidden");

      passwordInput.required = true;
      confirmPasswordInput.required = true;

      authButton.textContent = "CREATE ACCOUNT";
      authButton.classList.remove("hidden");

      authMessage.textContent = "";

      showToast(
        "Employee Found but not registered yet, please register",
        "warning",
      );

      passwordInput.focus();

      return;
    }

    // NOT FOUND
    // Employee FALSE
    // User FALSE

    if (data.status === "NOT_FOUND") {
      resetAuthUI();

      showToast("Employee Not Found", "error");

      return;
    }
  } catch (error) {
    if (error.name === "AbortError") {
      return;
    }

    console.error(error);

    resetAuthUI();

    showToast("Unable to connect to authentication server", "error");
  }
}

// REALTIME EMPLOYEE INPUT

employeeNoInput.addEventListener("input", () => {
  const employeeNo = employeeNoInput.value.trim();

  resetAuthUI();

  if (!employeeNo) {
    return;
  }

  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    handleEmployeeCheck();
  }, 400);
});

// FORM SUBMIT

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!currentStatus) {
    return;
  }

  // LOGIN
  if (currentStatus === "LOGIN") {
    console.log("LOGIN");

    // Endpoint login akan kita sambungkan berikutnya

    return;
  }

  // REGISTER
  if (currentStatus === "REGISTER") {
    console.log("REGISTER");

    // Endpoint register akan kita sambungkan berikutnya

    return;
  }
});
