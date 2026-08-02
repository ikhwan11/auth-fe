/* ======================================
   ELEMENTS
   ====================================== */

const userName = document.getElementById("user-name");

const userRole = document.getElementById("user-role");

const userAvatar = document.getElementById("user-avatar");

const themeToggle = document.getElementById("theme-toggle");

const copyrightYear = document.getElementById("copyright-year");

const logoutButton = document.getElementById("logout-button");

const toast = document.getElementById("toast");

const toastMessage = document.getElementById("toast-message");

/* ======================================
   LOGIN TOAST
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
   USER DISPLAY
   ====================================== */

function displayUser(user) {
  if (!user) {
    return;
  }

  userName.textContent = user.name || "User";

  userRole.textContent = user.role || "User";

  /*
   * Generate initials automatically.
   *
   * Example:
   *
   * Ikhwan Sulestra
   *       ↓
   * IS
   */

  const initials = user.name
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");

  userAvatar.textContent = initials || "U";
}

/* ======================================
   THEME
   ====================================== */

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);

  if (theme === "dark") {
    themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
  } else {
    themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
  }
}

/* ======================================
   LOAD THEME
   ====================================== */

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  applyTheme("dark");
} else {
  applyTheme("light");
}

/* ======================================
   TOGGLE THEME
   ====================================== */

themeToggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");

  const newTheme = currentTheme === "dark" ? "light" : "dark";

  applyTheme(newTheme);

  localStorage.setItem("theme", newTheme);
});

/* ======================================
   TOAST
   ====================================== */

function showToast(message, type = "success") {
  toast.classList.remove("success", "warning", "error");

  toastMessage.textContent = message;

  toast.classList.add(type);
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

/* ======================================
   LOGOUT
   ====================================== */

logoutButton.addEventListener("click", () => {
  logout();

  sessionStorage.setItem("toastMessage", "Logout Success");
  sessionStorage.setItem("toastType", "success");

  window.location.href = "../index.html";
});

/* ======================================
   COPYRIGHT
   ====================================== */

copyrightYear.textContent = new Date().getFullYear();

/* ======================================
   INIT
   ====================================== */

async function initApplication() {
  const token = getAccessToken();

  if (!token) {
    sessionStorage.setItem(
      "toastMessage",
      "You're not login, please login first",
    );
    sessionStorage.setItem("toastType", "error");

    window.location.href = "../index.html";
    return;
  }

  try {
    const payload = decodeToken(token);

    const employeeNo = payload.emp;

    const response = await checkEmployee(employeeNo);

    const employee = response.data.employee;

    displayUser({
      name: employee.name,
      role: employee.position,
    });
  } catch (error) {
    console.error("Failed to load user:", error);

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    sessionStorage.setItem("toastMessage", "Youre not login");
    sessionStorage.setItem("toastType", "error");

    window.location.href = "../index.html";
  }
}

initApplication();
