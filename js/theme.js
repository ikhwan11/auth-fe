const themeToggle = document.getElementById("theme-toggle");

const savedTheme = localStorage.getItem("theme");

/* ======================================
   APPLY SAVED THEME
   ====================================== */

if (savedTheme === "dark") {
  document.documentElement.setAttribute("data-theme", "dark");

  themeToggle.textContent = "☀️";
} else {
  document.documentElement.setAttribute("data-theme", "light");

  themeToggle.textContent = "🌙";
}

/* ======================================
   TOGGLE THEME
   ====================================== */

themeToggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");

  if (currentTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "light");

    localStorage.setItem("theme", "light");

    themeToggle.textContent = "🌙";
  } else {
    document.documentElement.setAttribute("data-theme", "dark");

    localStorage.setItem("theme", "dark");

    themeToggle.textContent = "☀️";
  }
});
