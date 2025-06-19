document.addEventListener("DOMContentLoaded", function () {
  // Sidebar toggle functionality
  const sidebar = document.querySelector(".sidebar");
  const mainContent = document.querySelector(".main-content");
  const collapseBtn = document.querySelector(".collapse-btn");

  collapseBtn.addEventListener("click", function () {
    sidebar.classList.toggle("sidebar-collapsed");
    mainContent.classList.toggle("expanded");
  });

  // Navigation item expand/collapse
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach((item) => {
    const link = item.querySelector(".nav-link");
    if (item.querySelector(".nav-sub-menu")) {
      link.addEventListener("click", function (e) {
        if (sidebar.classList.contains("sidebar-collapsed")) return;
        e.preventDefault();

        // Close all other expanded items
        navItems.forEach((otherItem) => {
          if (otherItem !== item && otherItem.classList.contains("expanded")) {
            otherItem.classList.remove("expanded");
          }
        });

        // Toggle current item
        item.classList.toggle("expanded");
      });
    }
  });

  // ---------------- REPORT INCIDENT MODAL ----------------
  const reportModalBtn = document.getElementById("reportPrompt");
  const reportModal = document.getElementById("incidentReportModal");
  const closeReportModal = document.getElementById("closeIncidentModal");
  const cancelReportModal = document.getElementById("cancelIncidentBtn");
  const submitReportBtn = document.getElementById("submitIncidentBtn");

  // OPEN THE MODAL
  reportModalBtn.addEventListener("click", () => {
    reportModal.style.display = "flex";
  });
  // CLOSE THE MODAL
  const closeReportModalBtns = [closeReportModal, cancelReportModal];
  closeReportModalBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      reportModal.style.display = "none";
    });
  });
  window.addEventListener("click", (e) => {
    if (e.target === reportModal) {
      reportModal.style.display = "none";
    }
  });
});
