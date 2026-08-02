/* ======================================
   ELEMENTS
   ====================================== */

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

const togglePassword = document.getElementById("toggle-password");

const toggleConfirmPassword = document.getElementById(
  "toggle-confirm-password",
);

/* ======================================
   LOGOUT TOAST
   ====================================== */

const pendingToastMessage = sessionStorage.getItem("toastMessage");
const pendingToastType = sessionStorage.getItem("toastType");

window.addEventListener("load", () => {
  if (!pendingToastMessage) {
    return;
  }

  showToast(pendingToastMessage, pendingToastType || "success");

  sessionStorage.removeItem("toastMessage");
  sessionStorage.removeItem("toastType");
});

/* ======================================
   STATE
   ====================================== */

let debounceTimer = null;

let requestController = null;

let currentStatus = null;

let toastTimer = null;

/* ======================================
   ANIMATION HELPERS
   ====================================== */

function showElement(element) {
  element.classList.add("show");
}

function hideElement(element) {
  element.classList.remove("show");
}

/* ======================================
   TOAST
   ====================================== */

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

/* ======================================
   RESET AUTH UI
   ====================================== */

function resetAuthUI() {
  currentStatus = null;

  hideElement(employeeInfo);

  hideElement(passwordSection);

  hideElement(confirmPasswordSection);

  hideElement(authButton);

  employeeName.textContent = "";

  employeePosition.textContent = "";

  passwordInput.value = "";

  confirmPasswordInput.value = "";

  passwordInput.required = false;

  confirmPasswordInput.required = false;

  authMessage.textContent = "";
}

/* ======================================
   LOADING
   ====================================== */

function showLoading() {
  authMessage.textContent = "Checking employee...";

  authMessage.classList.remove("error");
  /*  */
  authMessage.classList.add("loading");
}

/* ======================================
   CHECK EMPLOYEE
   ====================================== */

async function handleEmployeeCheck() {
  const employeeNo = employeeNoInput.value.trim();

  /* Empty */

  if (!employeeNo) {
    resetAuthUI();

    return;
  }

  /* Cancel previous request */

  if (requestController) {
    requestController.abort();
  }

  requestController = new AbortController();

  showLoading();

  try {
    const response = await checkEmployee(employeeNo);

    /*
     * Make sure response belongs
     * to current employee number.
     */

    if (employeeNo !== employeeNoInput.value.trim()) {
      return;
    }

    const data = response.data;

    currentStatus = data.status;

    /* ==================================
       EMPLOYEE FOUND
       ================================== */

    if (data.employee) {
      employeeName.textContent = data.employee.name;

      employeePosition.textContent = data.employee.position;

      showElement(employeeInfo);
    }

    /* ==================================
       LOGIN
       ================================== */

    if (data.status === "LOGIN") {
      showElement(passwordSection);

      hideElement(confirmPasswordSection);

      passwordInput.required = true;

      confirmPasswordInput.required = false;

      authButton.textContent = "LOGIN";

      showElement(authButton);

      authMessage.textContent = "";

      showToast("Employee and User valid, please login", "success");

      passwordInput.focus();

      return;
    }

    /* ==================================
       REGISTER
       ================================== */

    if (data.status === "REGISTER") {
      showElement(passwordSection);

      showElement(confirmPasswordSection);

      passwordInput.required = true;

      confirmPasswordInput.required = true;

      authButton.textContent = "CREATE ACCOUNT";

      showElement(authButton);

      authMessage.textContent = "";

      showToast(
        "Employee Found but not registered yet, please register",
        "warning",
      );

      passwordInput.focus();

      return;
    }

    /* ==================================
       NOT FOUND
       ================================== */

    if (data.status === "NOT_FOUND") {
      hideElement(employeeInfo);

      hideElement(passwordSection);

      hideElement(confirmPasswordSection);

      hideElement(authButton);

      currentStatus = null;

      employeeName.textContent = "";

      employeePosition.textContent = "";

      passwordInput.value = "";

      confirmPasswordInput.value = "";

      passwordInput.required = false;

      confirmPasswordInput.required = false;

      authMessage.textContent = "";

      showToast("Employee Not Found", "error");

      return;
    }
  } catch (error) {
    /*
     * AbortError means the previous
     * request was cancelled because
     * user typed another number.
     */

    if (error.name === "AbortError") {
      return;
    }

    console.error(error);

    resetAuthUI();

    showToast("Unable to connect to authentication server", "error");
  }
}

/* ======================================
   REALTIME EMPLOYEE INPUT
   ====================================== */

employeeNoInput.addEventListener("input", () => {
  const employeeNo = employeeNoInput.value.trim();

  /*
   * Immediately hide previous
   * authentication form.
   */

  resetAuthUI();

  /*
   * Empty input
   */

  if (!employeeNo) {
    return;
  }

  /*
   * Clear previous debounce
   */

  clearTimeout(debounceTimer);

  /*
   * Wait 400ms before request
   */

  debounceTimer = setTimeout(() => {
    handleEmployeeCheck();
  }, 400);
});

/* ======================================
   FORM SUBMIT
   ====================================== */

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const employeeNo = employeeNoInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  if (currentStatus === "LOGIN") {
    try {
      const response = await login(employeeNo, password);

      localStorage.setItem("access_token", response.data.access_token);

      localStorage.setItem("refresh_token", response.data.refresh_token);

      window.location.href = "./pages/application.html";
    } catch (error) {
      console.error(error);

      showToast(error.message || "Login failed", "error");
    }

    return;
  }

  if (currentStatus === "REGISTER") {
    if (password !== confirmPassword) {
      showToast("Password and Confirm Password do not match", "error");

      return;
    }

    try {
      const response = await register(employeeNo, password, confirmPassword);

      localStorage.setItem("access_token", response.data.access_token);

      localStorage.setItem("refresh_token", response.data.refresh_token);

      showToast("Registration successful", "success");

      setTimeout(() => {
        window.location.href = "./pages/application.html";
      }, 1000);
    } catch (error) {
      console.error(error);

      showToast(error.message || "Registration failed", "error");
    }

    return;
  }
});
