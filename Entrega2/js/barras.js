document.addEventListener("DOMContentLoaded", () => {
  const botones = document.querySelectorAll(".toggle-menu");

  botones.forEach(boton => {
    boton.addEventListener("click", (e) => {
      const targetId = boton.getAttribute("data-target");
      const menu = document.getElementById(targetId);

      // Cierra cualquier otro menú abierto
      document.querySelectorAll(".menu").forEach(m => {
        if (m !== menu) m.classList.remove("active");
      });

      // Alterna el menú clickeado
      menu.classList.toggle("active");

      // Evita que se cierre al hacer click dentro del menú
      e.stopPropagation();
    });
  });

  // Cierra menús al hacer click fuera
  document.addEventListener("click", () => {
    document.querySelectorAll(".menu").forEach(menu => {
      menu.classList.remove("active");
    });
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.querySelector(".sidebar");
  const touchZone = document.querySelector(".touch-zone");

  // Abrir sidebar al tocar el borde izquierdo
  touchZone.addEventListener("touchstart", () => {
    sidebar.classList.add("active");
  });

  // Cerrar sidebar al tocar fuera
  document.addEventListener("touchstart", (e) => {
    if (!sidebar.contains(e.target) && !touchZone.contains(e.target)) {
      sidebar.classList.remove("active");
    }
  });
});
