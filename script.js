document.addEventListener("DOMContentLoaded", function () {

  const menu = document.querySelector(".menu-btn");
  const nav = document.querySelector(".desktop-nav");

  if (menu && nav) {
    menu.addEventListener("click", function () {
      nav.classList.toggle("open");

      const isOpen = nav.classList.contains("open");

      menu.setAttribute("aria-expanded", isOpen ? "true" : "false");
      menu.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");

      menu.innerHTML = isOpen ? "✕" : "☰";
    });
  }

  const form = document.getElementById("contactForm");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("name")?.value.trim() || "";
      const mobile = document.getElementById("mobile")?.value.trim() || "";
      const interest = document.getElementById("interest")?.value || "";
      const message = document.getElementById("message")?.value.trim() || "";

      const text =
        "Hello DAKSHORA,%0A%0A" +
        "Name: " + encodeURIComponent(name) + "%0A" +
        "Mobile: " + encodeURIComponent(mobile) + "%0A" +
        "Requirement: " + encodeURIComponent(interest) + "%0A" +
        "Message: " + encodeURIComponent(message);

      window.open(
        "https://wa.me/918796347851?text=" + text,
        "_blank"
      );

      const msg = document.getElementById("msg");

      if (msg) {
        msg.textContent = "Opening WhatsApp with your enquiry...";
      }
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function () {
      if (nav) {
        nav.classList.remove("open");
      }

      if (menu) {
        menu.innerHTML = "☰";
        menu.setAttribute("aria-expanded", "false");
      }
    });
  });

});
