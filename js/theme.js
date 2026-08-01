const themeToggle = document.getElementById("theme-toggle");

function isDarkMode() {
  return document.documentElement.classList.contains("dark-mode");
}

function updateThemeIcon() {
  themeToggle.textContent = isDarkMode() ? "☀️" : "🌙";
}

updateThemeIcon();

themeToggle.addEventListener("click", () => {
  const darkMode = isDarkMode();

  document.documentElement.classList.toggle("dark-mode", !darkMode);

  localStorage.setItem("theme", darkMode ? "light" : "dark");

  updateThemeIcon();
});
