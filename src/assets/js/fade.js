document.addEventListener("DOMContentLoaded", function () {
    const section = document.querySelector(".fade-gradient");
    window.addEventListener("scroll", function () {
        if (window.scrollY > 200) {
            section.classList.add("fade-in");
        }
    });
});