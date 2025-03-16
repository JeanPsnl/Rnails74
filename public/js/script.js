document.addEventListener("DOMContentLoaded", function() {
    const menuToggle = document.querySelector(".menu-toggle");
    const closeMenu = document.querySelector(".close-menu");
    const navMenu = document.querySelector(".nav-menu");

    menuToggle.addEventListener("click", () => {
        navMenu.classList.add("active");
    });

    closeMenu.addEventListener("click", () => {
        navMenu.classList.remove("active");
    });
});