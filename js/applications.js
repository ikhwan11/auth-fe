/* ======================================
   DUMMY USER
   ====================================== */

const currentUser = {
  name: "Ikhwan Sulestra",
  role: "User",
};

/* ======================================
   ELEMENTS
   ====================================== */

const userName = document.getElementById("user-name");

const userRole = document.getElementById("user-role");

const userAvatar = document.getElementById("user-avatar");

const themeToggle = document.getElementById("theme-toggle");

const copyrightYear = document.getElementById("copyright-year");

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
   COPYRIGHT
   ====================================== */

copyrightYear.textContent = new Date().getFullYear();

/* ======================================
   INIT
   ====================================== */

displayUser(currentUser);
